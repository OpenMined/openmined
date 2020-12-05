import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirestore, useFirestoreDocDataOnce, useUser } from 'reactfire';
import useScrollPosition from '@react-hook/window-scroll';
import { faBookOpen, faLink } from '@fortawesome/free-solid-svg-icons';
import Page from '@openmined/shared/util-page';
import { useSanity } from '@openmined/shared/data-access-sanity';

import Concept from './Concept';

import {
  getConceptIndex,
  getLessonIndex,
  hasCompletedConcept,
  hasStartedConcept,
  hasStartedCourse,
  hasStartedLesson,
} from '../_helpers';
import CourseHeader from '../../../components/CourseHeader';
import CourseFooter from '../../../components/CourseFooter';

export default () => {
  // Get our data from the CMS
  const { course, lesson, concept } = useParams();
  const { data, loading } = useSanity(
    `*[_type == "lesson" && _id == "${lesson}"] {
      title,
      resources,
      "concept": *[_type == "concept" && _id == "${concept}"][0],
      "concepts": concepts[] -> {
        _id,
        title
      },
      "course": *[_type == "course" && references(^._id)][0] {
        title,
        "lessons": lessons[] -> {
          _id,
          title,
          "concepts": concepts[] -> { _id }
        }
      }
    }[0]`
  );

  // Get the current user and the course object (dbCourse) for this particular course
  const user = useUser();
  const db = useFirestore();
  const dbCourseRef = db
    .collection('users')
    .doc(user.uid)
    .collection('courses')
    .doc(course);
  const dbCourse = useFirestoreDocDataOnce(dbCourseRef);

  // Also store a reference to the server timestamp (we'll use this later to mark start and completion time)
  // Note that this value will always reflect the Date.now() value on the server, it's not a static time reference
  const serverTimestamp = useFirestore.FieldValue.serverTimestamp();

  // Update the DB that the user has started the course, lesson, and/or concept
  useEffect(() => {
    const isCourseStarted = hasStartedCourse(dbCourse);
    const isLessonStarted = hasStartedLesson(dbCourse, lesson);
    const isConceptStarted = hasStartedConcept(dbCourse, lesson, concept);

    // If we haven't started the course, lesson, or concept
    if (!isCourseStarted || !isLessonStarted || !isConceptStarted) {
      const data = dbCourse;

      // Append the course data structure
      if (!isCourseStarted) {
        data.started_at = serverTimestamp;
        data.lessons = {};
      }

      // Then the lesson data structure inside that
      if (!isLessonStarted) {
        data.lessons[lesson] = {
          started_at: serverTimestamp,
          concepts: {},
        };
      }

      // Then the concept data structure inside that
      if (!isConceptStarted) {
        data.lessons[lesson].concepts[concept] = {
          started_at: serverTimestamp,
        };
      }

      // When the object is constructed, store it!
      db.collection('users')
        .doc(user.uid)
        .collection('courses')
        .doc(course)
        .set(data, { merge: true });
    }
  }, [user.uid, db, dbCourse, serverTimestamp, course, lesson, concept]);

  // We need to track the user's scroll progress, as well as whether or not they've hit the bottom at least once
  const scrollY = useScrollPosition();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  // This is the logic to track their scroll progress and so on
  useEffect(() => {
    const conceptHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const progress = (scrollY / conceptHeight) * 100;

    setScrollProgress(progress > 100 ? 100 : progress);

    if (scrollProgress === 100 && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  }, [scrollY, scrollProgress, hasScrolledToBottom]);

  // We also need to track if the user has completed all quizzes for this concept
  const [hasCompletedAllQuizzes, setHasCompletedAllQuizzes] = useState(false);

  // If the data from the CMS is still loading, render nothing
  // Note that this has to be the FINAL side effect (after all useState and useEffect calls)
  if (loading) return null;

  // Destructure our data object for easier use
  const {
    concept: { title },
    concepts,
    course: { lessons },
    resources,
    title: lessonTitle,
  } = data;

  // Get the current lesson and concept indexes, and their non-zero numbers
  const lessonIndex = getLessonIndex(lessons, lesson);
  const lessonNum = lessonIndex + 1;
  const conceptIndex = getConceptIndex(lessons, lesson, concept);
  const conceptNum = conceptIndex + 1;

  // Create a function that is triggered when the concept is completed
  // This is triggered by clicking the "Next" button in the <ConceptFooter />
  const onCompleteConcept = () =>
    new Promise((resolve, reject) => {
      // If we haven't already completed this concept...
      if (!dbCourse.lessons[lesson].concepts[concept].completed_at) {
        // Tell the DB we've done so
        db.collection('users')
          .doc(user.uid)
          .collection('courses')
          .doc(course)
          .set(
            {
              lessons: {
                [lesson]: {
                  concepts: {
                    [concept]: {
                      completed_at: serverTimestamp,
                    },
                  },
                },
              },
            },
            { merge: true }
          )
          .then(resolve)
          .catch(reject);
      } else {
        resolve();
      }
    });

  // We need a function to be able to provide feedback for this concept
  const onProvideFeedback = (value, feedback = null) =>
    db
      .collection('users')
      .doc(user.uid)
      .collection('feedback')
      .doc(concept)
      .set(
        {
          value,
          feedback,
          type: 'concept',
        },
        { merge: true }
      );

  // Set up the content for the left-side drawer in the <ConceptHeader />
  const leftDrawerSections = [
    {
      title: 'Concepts',
      icon: faBookOpen,
      fields: concepts.map(({ _id, title }, index) => {
        // Default concept status is "unavailable"
        let status = 'unavailable';

        // If they've started the concept
        if (hasStartedConcept(dbCourse, lesson, _id)) {
          // And they've also completed it
          if (hasCompletedConcept(dbCourse, lesson, _id)) status = 'completed';
          // Otherwise, it must be available
          else status = 'available';
        }

        // On the other hand, perhaps it's the first concept, in which casee it's definitely available
        else if (index === 0) status = 'available';

        return {
          status,
          title,
          link: status !== 'unavailable' ? `/courses/${course}/${_id}` : null,
        };
      }),
    },
    {
      title: 'Resources',
      icon: faLink,
      fields: resources ? resources : [],
    },
  ];

  // TODO: Video concept
  // TODO: Quiz concept, they can only go at the end of lessons (add "quiz" as a field to the lesson in the CMS)
  // TODO: How to complete a concept?
  //  - Video should not require anything.
  //  - Quiz pages should require attempting all questions.
  //  - Normal pages should require attempting all questions and scrolling to the bottom of the concept at least once.
  // TODO: Test responsiveness
  // TODO: Make sure that they cannot begin a concept if they haven't completed the previous concepts (unless it's the first)
  // TODO: Make sure that they cannot begin a concept if they haven't completed the previous lessons (unless it's the first)

  // Given the content we need to render... what's the type of the first piece?
  const firstContentPiece = data.concept.content[0]._type;

  // Create a variable to store the concept component we need to render
  let ConceptType;

  // If the first content piece is a video
  if (firstContentPiece === 'video') {
    console.log('DO VIDEO LAYOUT');

    // Render the full-width video layout
    ConceptType = <div>Video Layout</div>;
  }

  // Otherwise, if the first content piece is a quiz
  else if (firstContentPiece === 'quiz') {
    console.log('DO QUIZ LAYOUT');

    // Render the full-size quiz layout
    ConceptType = <div>Quiz Layout</div>;
  }

  // Otherwise, render the default <Concept /> component
  else {
    ConceptType = (
      <Concept
        data={data}
        dbCourse={dbCourse}
        course={course}
        lesson={lesson}
        concept={concept}
        conceptNum={conceptNum}
        setCompletedQuizzes={setHasCompletedAllQuizzes}
      />
    );
  }

  // We need to store the previous concept id, next lesson id, and the next concept id to know where to link
  const prevConceptId =
    conceptIndex - 1 < 0 ? '' : concepts[conceptIndex - 1]._id;
  const nextLessonId =
    lessonIndex + 1 > lessons.length ? '' : lessons[lessonIndex + 1]._id;
  const nextConceptId =
    conceptIndex + 1 > concepts.length ? '' : concepts[conceptIndex + 1]._id;

  return (
    <Page title={`${lessonTitle} - ${title}`}>
      <CourseHeader
        lessonNum={lessonNum}
        title={title}
        course={course}
        leftDrawerSections={leftDrawerSections}
      />
      {ConceptType}
      {firstContentPiece !== 'quiz' && (
        <CourseFooter
          current={conceptNum}
          total={concepts.length}
          isBackAvailable={conceptNum > 1}
          isNextAvailable={
            firstContentPiece !== 'video' &&
            hasScrolledToBottom &&
            hasCompletedAllQuizzes
          }
          backLink={`/courses/${course}/${lesson}/${prevConceptId}`}
          nextLink={
            conceptNum === concepts.length
              ? `/courses/${course}/${nextLessonId}`
              : `/courses/${course}/${lesson}/${nextConceptId}`
          }
          onCompleteConcept={onCompleteConcept}
          scrollProgress={scrollProgress}
          onProvideFeedback={onProvideFeedback}
        />
      )}
    </Page>
  );
};
