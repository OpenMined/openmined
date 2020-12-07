import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Divider as ChakraDivider } from '@chakra-ui/core';

import Content from './blocks';

import GridContainer from '../../../components/GridContainer';

export default ({
  data,
  dbCourse,
  course,
  lesson,
  concept,
  conceptNum,
  setCompletedQuizzes,
}) => {
  // Destructure the data for easier access
  const {
    concept: { title, content },
    title: lessonTitle,
  } = data;

  // We need to track how many quizzes have been completed by the user
  const [numCompletedQuizzes, setNumCompletedQuizzes] = useState(0);

  // Store the number of quizzes on this concept
  let numberOfQuizzesOnConcept = 0;

  // ... and tally the result
  content.forEach(({ _type }) => {
    if (_type === 'quiz') numberOfQuizzesOnConcept += 1;
  });

  // We need to have a function that's called when a quiz is completed
  const onQuizComplete = () => {
    // Add to the number of completed quizzes
    setNumCompletedQuizzes(numCompletedQuizzes + 1);
  };

  // Every time those numbers change, see if we've completed all of them...
  useEffect(() => {
    // If we have, tell the parent component that we're done
    if (numCompletedQuizzes >= numberOfQuizzesOnConcept) {
      setCompletedQuizzes(true);
    }
  }, [numCompletedQuizzes, numberOfQuizzesOnConcept, setCompletedQuizzes]);

  return (
    <Box bg="gray.800">
      <GridContainer pt="header" pb="header">
        <Box bg="white" px={8} pt={[8, null, null, 16]} pb={16}>
          <Box maxW={600} mx="auto">
            <Text color="gray.700" mb={2}>
              <Text fontWeight="bold" as="span">
                {lessonTitle}
              </Text>{' '}
              | Concept {conceptNum}
            </Text>
            <Heading as="h1" size="xl">
              {title}
            </Heading>
            <ChakraDivider my={6} />
            <Content
              content={content}
              course={course}
              lesson={lesson}
              concept={concept}
              dbCourse={dbCourse}
              onQuizComplete={onQuizComplete}
              numberOfQuizzesOnConcept={numberOfQuizzesOnConcept}
            />
          </Box>
        </Box>
      </GridContainer>
    </Box>
  );
};
