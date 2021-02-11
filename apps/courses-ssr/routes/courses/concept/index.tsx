import React, { useEffect, useRef, useState } from 'react';
import { useFirestore } from 'reactfire';
import { Box } from '@chakra-ui/react';

import CourseContent from './content';
import CourseFooter from './Footer';

import { getConceptIndex, hasCompletedConcept } from '../_helpers';
import {
  handleErrors,
  useCourseFooterHeight,
} from '../../../helpers';
import useToast from '../../../components/Toast';
import {
  handleConceptComplete,
  handleConceptStarted,
  handleProvideFeedback,
} from '../_firebase';
import { CoursePagesProp } from '@openmined/shared/types';

export default ({
  progress,
  page,
  user,
  ts,
  course,
  lesson,
  concept,
}: CoursePagesProp) => {
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
  }, [toast, user.uid, db, progress, ts, course, lessons, lesson, concept]);

  // We need to track the user's scroll progress, as well as whether or not they've hit the bottom at least once
  // This requires some weird computation with whether or not the parent container (in parentRef.current) has a height or not
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const parentRef = useRef(null);

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

  const courseFooterHeight = useCourseFooterHeight();
  return (
    <>
      <Box
        bg="gray.800"
        ref={parentRef}
        paddingBottom={`${courseFooterHeight}px`}
      >
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
        hasScrolledToBottom={hasScrolledToBottom}
        setScrollProgress={setScrollProgress}
        setHasScrolledToBottom={setHasScrolledToBottom}
        parentRef={parentRef}
      />
    </>
  );
};
