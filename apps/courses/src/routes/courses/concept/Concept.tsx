import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Divider as ChakraDivider } from '@chakra-ui/core';

import Code from './blocks/Code';
import Divider from './blocks/Divider';
import Formula from './blocks/Formula';
import Image from './blocks/Image';
import Quiz from './blocks/Quiz';
import Tasks from './blocks/Tasks';
import RichText from './blocks/Text';
import Video from './blocks/Video';

import GridContainer from '../../../components/GridContainer';

const SPACING = 8;

const Content = ({
  content,
  course,
  lesson,
  concept,
  dbCourse,
  onQuizComplete,
  numberOfQuizzesOnConcept,
}) =>
  content.map(({ _type, ...item }, i) => {
    if (_type === 'code') {
      return <Code key={i} spacing={SPACING} {...item} />;
    } else if (_type === 'divider') {
      return <Divider key={i} spacing={SPACING} {...item} />;
    } else if (_type === 'math') {
      return <Formula key={i} spacing={SPACING} {...item} />;
    } else if (_type === 'image') {
      return <Image key={i} spacing={SPACING} {...item} />;
    } else if (_type === 'quiz') {
      return (
        <Quiz
          key={i}
          spacing={SPACING}
          {...item}
          course={course}
          lesson={lesson}
          concept={concept}
          dbCourse={dbCourse}
          numQuizzes={numberOfQuizzesOnConcept}
          onComplete={onQuizComplete}
        />
      );
    } else if (_type === 'tasks') {
      return <Tasks key={i} spacing={SPACING} {...item} />;
    } else if (_type === 'richText') {
      return <RichText key={i} spacing={SPACING} {...item} />;
    } else if (_type === 'video') {
      return <Video key={i} spacing={SPACING} {...item} />;
    }

    return null;
  });

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
      <GridContainer pt="header" pb="header" height="100%">
        <Box bg="white" height="100%" px={8} pt={[8, null, null, 16]} pb={16}>
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
