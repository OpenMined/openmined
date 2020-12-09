import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirestore, useFirestoreDocDataOnce, useUser } from 'reactfire';
import { Box } from '@chakra-ui/core';
import useScrollPosition from '@react-hook/window-scroll';
import { faBookOpen, faLink } from '@fortawesome/free-solid-svg-icons';
import Page from '@openmined/shared/util-page';
import { useSanity } from '@openmined/shared/data-access-sanity';

import CourseContent from './content';

import {
  getConceptIndex,
  getLessonIndex,
  hasCompletedConcept,
  hasStartedConcept,
  usePageAvailabilityRedirect,
} from '../_helpers';
import CourseHeader from '../../../components/CourseHeader';
import CourseFooter from '../../../components/CourseFooter';

const Concept = ({ dbCourse, data, user, db, ts, course, lesson, concept }) => {
  // Destructure our data object for easier use
  const {
    concept: { title },
    concepts,
    course: { lessons },
    resources,
    title: lessonTitle,
  } = data;

  // *-----*
  // PERMISSIONS LOGIC: We need to either update the DB of their progress or navigate them away.
  // *-----*

  // Check whether or not we're able to see this page
  const status = usePageAvailabilityRedirect(
    dbCourse,
    lessons,
    course,
    lesson,
    concept
  );

  useEffect(() => {
    // Assuming this page is available to the user, update the DB to start the course, lesson, and/or concept
    if (status === 'available') {
      // If we haven't started the concept
      if (!hasStartedConcept(dbCourse, lesson, concept)) {
        const data = dbCourse;

        // Then the concept data structure inside that
        data.lessons[lesson].concepts[concept] = {
          started_at: ts(),
        };

        // When the object is constructed, store it!
        db.collection('users')
          .doc(user.uid)
          .collection('courses')
          .doc(course)
          .set(data, { merge: true });
      }
    }
  }, [user.uid, db, dbCourse, ts, course, lessons, lesson, concept, status]);

  // *-----*
  // COMPONENT LOGIC: Assuming all that permissions logic is done...
  // *-----*

  // We need to track the user's scroll progress, as well as whether or not they've hit the bottom at least once
  const scrollY = useScrollPosition();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  // This is the logic to track their scroll progress and so on
  useEffect(() => {
    const conceptHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const progress =
      conceptHeight <= 0 ? 100 : (scrollY / conceptHeight) * 100 || 0;

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
                      completed_at: ts(),
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

  // Given the content we need to render... what's the type of the first piece?
  const firstContentPiece = data.concept.content[0]._type;

  // We need to store the previous concept id and the next concept id to know where to link
  const prevConceptId =
    conceptIndex - 1 < 0 ? '' : concepts[conceptIndex - 1]._id;
  const nextConceptId =
    conceptNum === concepts.length
      ? 'complete'
      : concepts[conceptIndex + 1]._id;

  // Determine whether the next concept should be available or not to the user
  const [isNextAvailable, setIsNextAvailable] = useState(false);

  useEffect(() => {
    const should =
      (firstContentPiece !== 'video' &&
        hasScrolledToBottom &&
        hasCompletedAllQuizzes) ||
      (firstContentPiece === 'video' && hasCompletedAllQuizzes) ||
      hasCompletedConcept(dbCourse, lesson, concept);

    if (should && !isNextAvailable) {
      setIsNextAvailable(should);
    }
  }, [
    dbCourse,
    lesson,
    concept,
    isNextAvailable,
    firstContentPiece,
    hasCompletedAllQuizzes,
    hasScrolledToBottom,
  ]);

  return (
    <Page title={`${lessonTitle} - ${title}`}>
      <Box bg="gray.800">
        <CourseHeader
          subtitle={`Lesson ${lessonNum}`}
          title={title}
          course={course}
          leftDrawerSections={leftDrawerSections}
        />
        <CourseContent
          data={data}
          dbCourse={dbCourse}
          course={course}
          lesson={lesson}
          concept={concept}
          conceptNum={conceptNum}
          setCompletedQuizzes={setHasCompletedAllQuizzes}
        />
        <CourseFooter
          current={conceptNum}
          total={concepts.length}
          scrollProgress={scrollProgress}
          isBackAvailable={conceptIndex > 0}
          isNextAvailable={isNextAvailable}
          backLink={`/courses/${course}/${lesson}/${prevConceptId}`}
          nextLink={`/courses/${course}/${lesson}/${nextConceptId}`}
          onCompleteConcept={onCompleteConcept}
          onProvideFeedback={onProvideFeedback}
        />
      </Box>
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
  const dbCourse = useFirestoreDocDataOnce(dbCourseRef);

  // Store a reference to the server timestamp (we'll use this later to mark start and completion time)
  // Note that this value will always reflect the Date.now() value on the server, it's not a static time reference
  const serverTimestamp = useFirestore.FieldValue.serverTimestamp;

  // If the data from the CMS is still loading, render nothing
  if (loading) return null;

  return (
    <Concept
      dbCourse={dbCourse}
      data={data}
      user={user}
      db={db}
      ts={serverTimestamp}
      course={course}
      lesson={lesson}
      concept={concept}
    />
  );
};
