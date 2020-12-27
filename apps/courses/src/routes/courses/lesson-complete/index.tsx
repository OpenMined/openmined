import React, { useState } from 'react';
import { useAnalytics, useFirestore } from 'reactfire';
import {
  Box,
  Button,
  CloseButton,
  Divider,
  Flex,
  Heading,
  Link,
  Text,
  Textarea,
} from '@chakra-ui/react';
import {
  faArrowRight,
  faBullhorn,
  faCheckCircle,
  faCommentAlt,
  faShapes,
} from '@fortawesome/free-solid-svg-icons';
import { CoursePagesProp } from '@openmined/shared/types';

import { getLessonIndex } from '../_helpers';
import { handleLessonComplete, handleProvideFeedback } from '../_firebase';
import useToast, { toastConfig } from '../../../components/Toast';
import GridContainer from '../../../components/GridContainer';
import Icon from '../../../components/Icon';
import { handleErrors } from '../../../helpers';
import { discussionLink } from '../../../content/links';

const DetailLink = ({ icon, children, ...props }) => (
  <Box
    width={{ base: 'full', md: '35%' }}
    color="gray.400"
    textAlign="center"
    {...props}
  >
    <Icon icon={icon} boxSize={8} mb={4} />
    <Text>{children}</Text>
  </Box>
);

const LessonLine = ({ status, title, isProjectNext = false }) => (
  <Flex
    bg="gray.800"
    borderTop={status === 'current' ? 'none' : '1px solid'}
    borderTopColor="gray.700"
    justify="space-between"
    align="center"
    width="full"
    p={6}
  >
    <Flex align="center">
      <Icon
        icon={
          status === 'current'
            ? faCheckCircle
            : status === 'next'
            ? faArrowRight
            : faShapes
        }
        color={
          status === 'current'
            ? 'green.400'
            : status === 'next'
            ? 'cyan.500'
            : isProjectNext
            ? 'gray.400'
            : 'gray.700'
        }
        boxSize={5}
        mr={6}
      />
      <Text
        fontSize="lg"
        color={
          (status === 'project' && isProjectNext) || status !== 'project'
            ? 'white'
            : 'gray.700'
        }
      >
        {title}
      </Text>
    </Flex>
    {status === 'next' && (
      <Text color="gray.400" ml={6}>
        Up Next
      </Text>
    )}
  </Flex>
);

export default ({
  progress,
  page,
  user,
  ts,
  course,
  lesson,
}: CoursePagesProp) => {
  const db = useFirestore();
  const analytics = useAnalytics();

  const {
    course: { lessons, projectTitle },
    title,
  } = page;

  // Be able to push a toast message
  const toast = useToast();

  // Allow this component to capture the user's feedback
  const [isFeedbackActive, setFeedbackActive] = useState(false);
  const [vote, setVote] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Get the current lesson index, the lesson number, and (if applicable) the next lesson or final project
  const lessonIndex = getLessonIndex(lessons, lesson);
  const lessonNum = lessonIndex + 1;
  const nextLesson =
    lessons.length > lessonNum ? lessons[lessonNum] : 'project';

  // Create a function that is triggered when the lesson is completed
  // This is triggered by clicking the "Next" button in the <ConceptFooter />
  const onCompleteLesson = () =>
    handleLessonComplete(
      db,
      analytics,
      user.uid,
      course,
      ts,
      progress,
      lesson
    ).catch((error) => handleErrors(toast, error));

  // We need a function to be able to provide feedback for this lesson
  const onProvideFeedback = (value, feedback = null) =>
    handleProvideFeedback(
      db,
      analytics,
      user.uid,
      course,
      lesson,
      value,
      feedback,
      'lesson'
    ).catch((error) => handleErrors(toast, error));

  const votes = [
    { text: '👎', val: -1 },
    { text: '👌', val: 0 },
    { text: '👍', val: 1 },
  ];

  return (
    <Box bg="gray.900" color="white">
      <GridContainer isInitial py={[8, null, null, 16]}>
        {!isFeedbackActive && (
          <Flex direction="column" align="center" maxW={600} mx="auto">
            <Icon icon={faCheckCircle} color="cyan.300" boxSize={12} mb={4} />
            <Heading as="p" size="xl" textAlign="center" mb={4}>
              Congratulations!
            </Heading>
            <Heading
              as="p"
              size="md"
              textAlign="center"
              color="gray.400"
              mb={12}
            >
              You just finished the{' '}
              <Text as="span" color="white">
                "{title}"
              </Text>{' '}
              lesson.
            </Heading>
            <Flex align="center" width="full" mb={8}>
              <Divider />
              <Text
                color="gray.400"
                fontStyle="italic"
                width={200}
                textAlign="center"
              >
                Up Next
              </Text>
              <Divider />
            </Flex>
            <Box borderRadius="md" overflow="hidden" width="full" mb={8}>
              <LessonLine status="current" title={title} />
              {typeof nextLesson !== 'string' && (
                <LessonLine status="next" title={nextLesson.title} />
              )}
              <LessonLine
                status="project"
                title={projectTitle}
                isProjectNext={typeof nextLesson === 'string'}
              />
            </Box>
            <Button
              mb={12}
              colorScheme="cyan"
              size="lg"
              onClick={() =>
                onCompleteLesson().then(() => {
                  window.location.href = `/courses/${course}/${
                    typeof nextLesson === 'string' ? nextLesson : nextLesson._id
                  }`;
                })
              }
            >
              Continue
            </Button>
            <Flex
              direction={{ base: 'column', md: 'row' }}
              justify="space-between"
            >
              <DetailLink icon={faCommentAlt}>
                Talk about this topic further in our{' '}
                <Link
                  href={discussionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="gray.400"
                  _hover={{ color: 'gray.600' }}
                >
                  discussion board
                </Link>
                .
              </DetailLink>
              <DetailLink icon={faBullhorn} mt={[8, null, 0]}>
                Tell us how we're doing! Make sure to{' '}
                <Link
                  onClick={() => setFeedbackActive(true)}
                  color="gray.400"
                  _hover={{ color: 'gray.600' }}
                >
                  give feedback
                </Link>
                .
              </DetailLink>
            </Flex>
          </Flex>
        )}
        {isFeedbackActive && (
          <Box
            position="relative"
            bg="gray.800"
            borderRadius="md"
            p={8}
            textAlign="center"
            maxW={600}
            mx="auto"
          >
            <Flex justify={['center', null, 'flex-end']} mb={4} mt={-2}>
              <CloseButton onClick={() => setFeedbackActive(false)} />
            </Flex>
            <Heading as="p" size="lg" mb={4}>
              Send us your feedback!
            </Heading>
            <Text color="gray.400" mb={8}>
              Tell us about your experience on this lesson. Was it helpful? Full
              of bugs? Is the material no longer accurate?
            </Text>
            <Box maxW={480} mx="auto">
              <Flex justify="space-around" align="center" mb={4}>
                {votes.map(({ text, val }) => (
                  <Text
                    fontSize="5xl"
                    key={val}
                    cursor="pointer"
                    onClick={() => setVote(val)}
                    opacity={vote !== null && vote !== val ? 0.5 : 1}
                  >
                    {text}
                  </Text>
                ))}
              </Flex>
              <Textarea
                placeholder="Type whatever you'd like..."
                onChange={({ target }) => setFeedback(target.value)}
                resize="vertical"
                variant="filled"
                bg="white"
                _hover={{ bg: 'white' }}
                _focus={{ bg: 'white' }}
                color="gray.800"
                py={3}
                mb={4}
              />
              <Button
                onClick={() => {
                  onProvideFeedback(vote, feedback).then(() => {
                    setFeedbackActive(false);

                    toast({
                      ...toastConfig,
                      title: 'Feedback sent',
                      description:
                        "We appreciate you telling us how we're doing!",
                      status: 'success',
                    });
                  });
                }}
                disabled={vote === null}
                colorScheme="cyan"
                size="lg"
              >
                Submit
              </Button>
            </Box>
          </Box>
        )}
      </GridContainer>
    </Box>
  );
};
