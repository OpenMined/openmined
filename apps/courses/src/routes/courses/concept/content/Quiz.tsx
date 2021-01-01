import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Image,
  Heading,
  Text,
  Stack,
  Progress,
} from '@chakra-ui/react';
import { useFirestore, useUser } from 'reactfire';
import { faArrowRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCircle, faDotCircle } from '@fortawesome/free-regular-svg-icons';
import { handleErrors } from '../../../../helpers';
import useToast from '../../../../components/Toast';
import Icon from '../../../../components/Icon';
import { handleQuizFinish } from '../../_firebase';

const FinishedBox = ({ correct, total }) => (
  <Box bg="gray.100" borderRadius="md" p={8}>
    <Heading as="p" textAlign="center" size="md" mb={4}>
      Great work!
    </Heading>
    <Flex
      bg="gray.800"
      color="white"
      borderRadius="md"
      border="1px solid"
      borderColor="gray.900"
    >
      <Flex
        direction="column"
        justify="center"
        align="center"
        borderRight="1px solid"
        borderColor="gray.900"
        textAlign="center"
        p={8}
        width={1 / 2}
      >
        <Heading size="3xl" mb={3}>
          {correct}
        </Heading>
        <Text color="cyan.300">Correct</Text>
      </Flex>
      <Flex
        direction="column"
        justify="center"
        align="center"
        textAlign="center"
        p={8}
        width={1 / 2}
      >
        <Heading size="3xl" mb={3}>
          {total}
        </Heading>
        <Text color="gray.400">Total Questions</Text>
      </Flex>
    </Flex>
  </Box>
);

const submittedAnswerProps = {
  p: 3,
  border: '1px solid',
  borderRadius: 'md',
  cursor: 'pointer',
  align: 'flex-start',
};

const CorrectAnswer = ({ setCurrentSelection, index, value, explanation }) => (
  <Flex
    bg="green.50"
    {...submittedAnswerProps}
    borderColor="green.500"
    onClick={() => setCurrentSelection(index)}
  >
    <Image
      src="https://emojis.slackmojis.com/emojis/images/1531847402/4229/blob-clap.gif?1531847402"
      alt="Correct answer"
      boxSize={6}
      ml={-1}
      mr={3}
    />
    <Box>
      <Text mb={1}>{value}</Text>
      <Text color="green.500" fontSize="sm" fontStyle="italic">
        {typeof explanation === 'string' ? explanation : explanation()}
      </Text>
    </Box>
  </Flex>
);

const IncorrectAnswer = ({
  setCurrentSelection,
  index,
  value,
  explanation,
}) => (
  <Flex
    bg="red.50"
    {...submittedAnswerProps}
    borderColor="red.300"
    onClick={() => setCurrentSelection(index)}
  >
    <Icon icon={faTimes} color="red.300" boxSize={5} mr={4} />
    <Box>
      <Text mb={1}>{value}</Text>
      <Text color="red.300" fontSize="sm" fontStyle="italic">
        {typeof explanation === 'string' ? explanation : explanation()}
      </Text>
    </Box>
  </Flex>
);

const UnansweredAnswer = ({
  index,
  value,
  correct,
  setCurrentSelection,
  setCorrectAnswers,
  setHasAttemptedQuestion,
  hasAttemptedQuestion,
  correctAnswers,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Flex
      p={3}
      align="center"
      _hover={{ bg: 'gray.200' }}
      transitionProperty="background, color"
      transitionDuration="slow"
      transitionTimingFunction="ease-in-out"
      borderRadius="md"
      cursor="pointer"
      onClick={() => {
        setCurrentSelection(index);
        setIsHovering(false);

        if (correct && !hasAttemptedQuestion)
          setCorrectAnswers(correctAnswers + 1);

        setHasAttemptedQuestion(true);
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Icon
        icon={isHovering ? faDotCircle : faCircle}
        color={isHovering ? 'blue.500' : 'gray.700'}
        boxSize={4}
        mr={4}
      />
      <Text color={isHovering ? 'gray.800' : 'gray.700'}>{value}</Text>
    </Flex>
  );
};

const QuizCard = ({
  question,
  answers,
  index,
  currentSelection,
  correctAnswers,
  currentQuestion,
  setCurrentSelection,
  setCorrectAnswers,
  setCurrentQuestion,
  setIsFinished,
  onFinish,
  total,
}) => {
  const [hasAttemptedQuestion, setHasAttemptedQuestion] = useState(false);

  return (
    <Box
      bg="gray.100"
      borderRadius="md"
      p={8}
      display={currentQuestion === index ? 'block' : 'none'}
    >
      <Text mb={4}>{question}</Text>
      <Stack spacing={2}>
        {answers.map(({ value, explanation, correct }, answerIndex) => {
          if (
            currentQuestion === index &&
            currentSelection === answerIndex &&
            correct
          ) {
            return (
              <CorrectAnswer
                key={answerIndex}
                setCurrentSelection={setCurrentSelection}
                index={answerIndex}
                value={value}
                explanation={explanation}
              />
            );
          } else if (
            currentQuestion === index &&
            currentSelection === answerIndex &&
            !correct
          ) {
            return (
              <IncorrectAnswer
                key={answerIndex}
                setCurrentSelection={setCurrentSelection}
                index={answerIndex}
                value={value}
                explanation={explanation}
              />
            );
          }

          return (
            <UnansweredAnswer
              key={answerIndex}
              index={answerIndex}
              value={value}
              correct={correct}
              setCorrectAnswers={setCorrectAnswers}
              setCurrentSelection={setCurrentSelection}
              setHasAttemptedQuestion={setHasAttemptedQuestion}
              hasAttemptedQuestion={hasAttemptedQuestion}
              correctAnswers={correctAnswers}
            />
          );
        })}
      </Stack>
      {currentSelection !== null && (
        <Flex justify="flex-end" mt={4}>
          <Flex
            align="center"
            color="gray.700"
            _hover={{ color: 'gray.800' }}
            transitionProperty="color"
            transitionDuration="slow"
            transitionTimingFunction="ease-in-out"
            cursor="pointer"
            onClick={() => {
              if (currentQuestion + 1 >= total) {
                setIsFinished(true);
                onFinish();
              } else {
                setCurrentSelection(null);
                setCurrentQuestion(currentQuestion + 1);
                setHasAttemptedQuestion(false);
              }
            }}
          >
            <Text fontWeight="bold" mr={2}>
              {currentQuestion + 1 >= total ? 'Finish' : 'Next'}
            </Text>
            <Icon icon={faArrowRight} boxSize={4} />
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

export default ({
  quiz,
  course,
  lesson,
  concept,
  progress,
  numQuizzes,
  spacing,
  onComplete,
}: any) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const user: firebase.User = useUser();
  const db = useFirestore();
  const toast = useToast();

  const arrayUnion = useFirestore.FieldValue.arrayUnion;

  // Whenever the concept changes, reset the quiz
  useEffect(() => {
    setCurrentQuestion(0);
    setCurrentSelection(null);
    setCorrectAnswers(0);
    setIsFinished(false);
  }, [concept]);

  const onFinish = () => {
    onComplete();

    handleQuizFinish(
      db,
      user.uid,
      course,
      arrayUnion,
      progress,
      lesson,
      concept,
      numQuizzes,
      correctAnswers,
      quiz
    ).catch((error) => handleErrors(toast, error));
  };

  return (
    <Box my={spacing}>
      <Flex justify="space-between" align="center">
        <Flex align="center">
          <Image
            src="https://emojis.slackmojis.com/emojis/images/1572027739/6832/blob_cheer.png?1572027739"
            alt="Quiz Emoji"
            boxSize={10}
            mr={4}
          />
          <Heading as="span" size="lg">
            Quiz Time
          </Heading>
        </Flex>
        <Text color="gray.600">
          {currentQuestion + 1} of {quiz.length}
        </Text>
      </Flex>
      <Progress
        value={isFinished ? 100 : (currentQuestion / quiz.length) * 100}
        size="sm"
        colorScheme="blue"
        borderRadius="md"
        my={6}
      />
      {isFinished && (
        <FinishedBox correct={correctAnswers} total={quiz.length} />
      )}
      {!isFinished &&
        quiz.map(({ question, answers }, questionIndex) => (
          <QuizCard
            key={questionIndex}
            question={question}
            answers={answers}
            index={questionIndex}
            currentSelection={currentSelection}
            correctAnswers={correctAnswers}
            currentQuestion={currentQuestion}
            setCurrentSelection={setCurrentSelection}
            setCorrectAnswers={setCorrectAnswers}
            setCurrentQuestion={setCurrentQuestion}
            setIsFinished={setIsFinished}
            onFinish={onFinish}
            total={quiz.length}
          />
        ))}
    </Box>
  );
};
