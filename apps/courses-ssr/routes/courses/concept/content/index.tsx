import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Divider as ChakraDivider } from '@chakra-ui/react';

import Code from './Code';
import Divider from './Divider';
import Formula from './Formula';
import Image from './Image';
import Quiz from './Quiz';
import Tasks from './Tasks';
import RichText from './Text';
import Video from './Video';

import GridContainer from '../../../../components/GridContainer';

const SPACING = 8;

export const Content = ({
  content,
  course,
  lesson,
  concept,
  progress,
  onQuizComplete,
  numQuizzesOnConcept,
}: any) =>
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
          progress={progress}
          onComplete={onQuizComplete}
          numQuizzes={numQuizzesOnConcept}
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
  page,
  progress,
  course,
  lesson,
  concept,
  conceptNum,
  setCompletedQuizzes,
}) => {
  const {
    concept: { title, content },
    title: lessonTitle,
  } = page;

  // We need to track how many quizzes have been completed by the user
  const [numQuizzesOnConcept, setNumQuizzesOnConcept] = useState(null);
  const [numCompletedQuizzes, setNumCompletedQuizzes] = useState(0);

  // We need to have a function that's called when a quiz is completed
  const onQuizComplete = () => {
    // Add to the number of completed quizzes
    setNumCompletedQuizzes(numCompletedQuizzes + 1);
  };

  // Determine how many quizzes exist on this concept
  useEffect(() => {
    if (numQuizzesOnConcept === null) {
      let tally = 0;

      content.forEach(({ _type }) => {
        if (_type === 'quiz') tally++;
      });

      setNumQuizzesOnConcept(tally);
    }
  }, [content, numQuizzesOnConcept]);

  // Everytime those numbers change, see if we've completed all of them...
  useEffect(() => {
    // If we have, tell the parent component that we're done
    if (
      numQuizzesOnConcept !== null &&
      numCompletedQuizzes >= numQuizzesOnConcept
    ) {
      setCompletedQuizzes(true);
    }
  }, [numCompletedQuizzes, numQuizzesOnConcept, setCompletedQuizzes]);

  // Determine if we need to render the video fullscreen or not
  const firstContentPiece = content[0]._type;
  const isVideoLayout = firstContentPiece === 'video';

  return (
    <GridContainer>
      {isVideoLayout && <Video {...content[0]} />}
      <Box bg="white" px={8} py={16}>
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
            content={isVideoLayout ? content.slice(1) : content}
            course={course}
            lesson={lesson}
            concept={concept}
            progress={progress}
            onQuizComplete={onQuizComplete}
            numQuizzesOnConcept={numQuizzesOnConcept}
          />
        </Box>
      </Box>
    </GridContainer>
  );
};
