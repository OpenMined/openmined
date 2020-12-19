import React, { useEffect, useState } from 'react';
import { useFirestore } from 'reactfire';
import { Box } from '@chakra-ui/react';
import useScrollPosition from '@react-hook/window-scroll';

import CourseContent from './content';
import CourseFooter from './Footer';

import {
  getConceptIndex,
  hasCompletedConcept,
  hasStartedConcept,
} from '../_helpers';
import { handleErrors } from '../../../helpers';
import useToast from '../../../components/Toast';
import {
  handleConceptComplete,
  handleConceptStarted,
  handleProvideFeedback,
} from '../_firebase';

export default ({ progress, page, user, ts, course, lesson, concept }) => {
  const db = useFirestore();
  const toast = useToast();

  const {
    concepts,
    course: { lessons },
  } = page;

  useEffect(() => {
    handleConceptStarted(
      db,
      user.uid,
      course,
      ts,
      progress,
      lesson,
      concept
    ).catch((error) => handleErrors(toast, error));
  }, [user.uid, db, progress, ts, course, lessons, lesson, concept]);

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

  // Get the current concept index and its non-zero numbers
  const conceptIndex = getConceptIndex(lessons, lesson, concept);
  const conceptNum = conceptIndex + 1;

  // Create a function that is triggered when the concept is completed
  // This is triggered by clicking the "Next" button in the <ConceptFooter />
  const onCompleteConcept = () =>
    handleConceptComplete(
      db,
      user.uid,
      course,
      ts,
      progress,
      lesson,
      concept
    ).catch((error) => handleErrors(toast, error));

  // We need a function to be able to provide feedback for this concept
  const onProvideFeedback = (value, feedback = null) =>
    handleProvideFeedback(
      db,
      user.uid,
      course,
      concept,
      value,
      feedback,
      'concept'
    ).catch((error) => handleErrors(toast, error));

  // Given the content we need to render... what's the type of the first piece?
  const firstContentPiece = page.concept.content[0]._type;

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
      hasCompletedConcept(progress, lesson, concept);

    if (should && !isNextAvailable) {
      setIsNextAvailable(should);
    }
  }, [
    progress,
    lesson,
    concept,
    isNextAvailable,
    firstContentPiece,
    hasCompletedAllQuizzes,
    hasScrolledToBottom,
  ]);

  return (
    <>
      <Box bg="gray.800">
        <CourseContent
          page={page}
          progress={progress}
          course={course}
          lesson={lesson}
          concept={concept}
          conceptNum={conceptNum}
          setCompletedQuizzes={setHasCompletedAllQuizzes}
        />
      </Box>
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
    </>
  );
};
