import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFirestore, useFirestoreDocData, useUser } from 'reactfire';
import useScrollPosition from '@react-hook/window-scroll';
import { faBookOpen, faLink } from '@fortawesome/free-solid-svg-icons';
import Page from '@openmined/shared/util-page';
import { useSanity } from '@openmined/shared/data-access-sanity';

import Video from './Video';
import Main from './Main';

import {
  getConceptIndex,
  getLastCompletedConcept,
  getLessonIndex,
  hasCompletedConcept,
  hasStartedConcept,
  hasStartedCourse,
  hasStartedLesson,
  isConceptAvailable,
} from '../_helpers';
import CourseHeader from '../../../components/CourseHeader';
import CourseFooter from '../../../components/CourseFooter';

const Concept = ({ dbCourse, data, user, db, course, lesson, concept }) => {
  // Destructure our data object for easier use
  const {
    concept: { title },
    concepts,
    course: { lessons },
    resources,
    title: lessonTitle,
  } = data;

  const navigate = useNavigate();

  useEffect(() => {
    if (!isConceptAvailable(dbCourse, lessons, lesson, concept)) {
      const lastCompletedConcept = getLastCompletedConcept(dbCourse, lessons);

      navigate(
        `/courses/${course}/${lastCompletedConcept.lesson}/${lastCompletedConcept.concept}`
      );
    }
  }, [navigate, dbCourse, lessons, course, lesson, concept]);

  const [hasUpdatedDbCourse, setHasUpdatedDbCourse] = useState(false);

  // Also store a reference to the server timestamp (we'll use this later to mark start and completion time)
  // Note that this value will always reflect the Date.now() value on the server, it's not a static time reference
  const serverTimestamp = useFirestore.FieldValue.serverTimestamp();

  // Update the DB that the user has started the course, lesson, and/or concept
  useEffect(() => {
    if (!hasUpdatedDbCourse) {
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

        setHasUpdatedDbCourse(true);
      }
    }
  }, [
    user.uid,
    db,
    dbCourse,
    serverTimestamp,
    course,
    lesson,
    concept,
    hasUpdatedDbCourse,
  ]);

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
      if (!hasCompletedConcept(dbCourse, lesson, concept)) {
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
          link:
            status !== 'unavailable'
              ? `/courses/${course}/${lesson}/${_id}`
              : null,
        };
      }),
    },
    {
      title: 'Resources',
      icon: faLink,
      fields: resources ? resources : [],
    },
  ];

  // TODO: On the course overview page, make sure the "walk away being able to" items have images for icons instead of Font Awesome icons
  // TODO: On the course overview page, make sure to have the project show up at the end in the syllabus
  // TODO: Test responsiveness
  // TODO: The redirect I have above (line 37-ish) actually will still add "started_at" to the next course while it redirects
  // Clean up this file and test everything again - it's a damn mess.

  // Given the content we need to render... what's the type of the first piece?
  const firstContentPiece = data.concept.content[0]._type;

  // Create a variable to store the concept component we need to render
  // If the first content piece is a video, render it full-size... otherwise, render the default concept
  const ConceptType = firstContentPiece === 'video' ? Video : Main;

  // We need to store the previous concept id and the next concept id to know where to link
  const prevConceptId =
    conceptIndex - 1 < 0 ? '' : concepts[conceptIndex - 1]._id;
  const nextConceptId =
    conceptNum + 1 > concepts.length ? '' : concepts[conceptIndex + 1]._id;

  const isNextAvailable =
    (firstContentPiece !== 'video' &&
      hasScrolledToBottom &&
      hasCompletedAllQuizzes) ||
    (firstContentPiece === 'video' && hasCompletedAllQuizzes) ||
    hasCompletedConcept(dbCourse, lesson, concept);

  return (
    <Page title={`${lessonTitle} - ${title}`}>
      <CourseHeader
        lessonNum={lessonNum}
        title={title}
        course={course}
        leftDrawerSections={leftDrawerSections}
      />
      <ConceptType
        data={data}
        dbCourse={dbCourse}
        course={course}
        lesson={lesson}
        concept={concept}
        conceptNum={conceptNum}
        setCompletedQuizzes={setHasCompletedAllQuizzes}
      />
      {firstContentPiece !== 'quiz' && (
        <CourseFooter
          current={conceptNum}
          total={concepts.length}
          scrollProgress={scrollProgress}
          isBackAvailable={conceptNum > 1}
          isNextAvailable={isNextAvailable}
          backLink={`/courses/${course}/${lesson}/${prevConceptId}`}
          nextLink={
            conceptNum === concepts.length
              ? `/courses/${course}/${lesson}/complete`
              : `/courses/${course}/${lesson}/${nextConceptId}`
          }
          onCompleteConcept={onCompleteConcept}
          onProvideFeedback={onProvideFeedback}
        />
      )}
    </Page>
  );
};

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
  const dbCourse = useFirestoreDocData(dbCourseRef);

  // If the data from the CMS is still loading, render nothing
  // Note that this has to be the FINAL side effect (after all useState and useEffect calls)
  if (loading) return null;

  return (
    <Concept
      dbCourse={dbCourse}
      data={data}
      user={user}
      db={db}
      course={course}
      lesson={lesson}
      concept={concept}
    />
  );
};
