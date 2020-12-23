import React, { useState } from 'react';
import { useFirestore } from 'reactfire';
import {
  Box,
  Button,
  CloseButton,
  Flex,
  Heading,
  Image,
  Link,
  Text,
  Textarea,
} from '@chakra-ui/react';
import {
  faBullhorn,
  faCheckCircle,
  faCommentAlt,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

import {
  getProjectPartStatus,
  hasCompletedCourse,
  hasCompletedProject,
} from '../_helpers';
import useToast, { toastConfig } from '../../../components/Toast';
import Icon from '../../../components/Icon';
import GridContainer from '../../../components/GridContainer';
import { handleErrors } from '../../../helpers';
import { handleProjectComplete, handleProvideFeedback } from '../_firebase';
import { OpenMined } from '@openmined/shared/types';

const DetailLink = ({ icon, children, ...props }) => (
  <Box
    width={{ base: 'full', md: '35%' }}
    color="gray.400"
    textAlign="center"
    {...props}
  >
    <Icon icon={icon} boxSize={5} size="lg" mb={4} />
    <Text>{children}</Text>
  </Box>
);

export default ({
  progress,
  page,
  user,
  ts,
  course,
}: OpenMined.CoursePagesProp) => {
  const db = useFirestore();

  const {
    project: { title, parts },
  } = page;

  // Be able to push a toast message
  const toast = useToast();

  // Allow this component to capture the user's feedback
  const [isFeedbackActive, setFeedbackActive] = useState(false);
  const [vote, setVote] = useState(null);
  const [feedback, setFeedback] = useState('');

  let status = null;

  parts.forEach(({ _key }) => {
    if (getProjectPartStatus(progress, _key) !== 'passed') {
      status = 'failed';
    }
  });

  if (!status) status = 'passed';

  // Create a function that is triggered when the project is completed
  const onCompleteProject = () =>
    handleProjectComplete(
      db,
      user.uid,
      course,
      ts,
      progress,
      status
    ).catch((error) => handleErrors(toast, error));
  // We need a function to be able to provide feedback for this project
  const onProvideFeedback = (value, feedback = null) =>
    handleProvideFeedback(
      db,
      user.uid,
      course,
      course,
      value,
      feedback,
      'project'
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
            <Image
              src="https://emojis.slackmojis.com/emojis/images/1572027878/6937/blob_thumbs_up.png?1572027878"
              mb={4}
              boxSize={12}
            />
            <Heading as="p" size="xl" textAlign="center" mb={4}>
              Congratulations!
            </Heading>
            <Heading as="p" size="lg" textAlign="center" mb={12}>
              You just finished the final project.
            </Heading>
            <Flex
              bg="gray.800"
              borderRadius="md"
              align="center"
              width="full"
              p={6}
              mb={8}
            >
              <Icon
                icon={status === 'passed' ? faCheckCircle : faTimesCircle}
                color={status === 'passed' ? 'green.400' : 'magenta.400'}
                boxSize={5}
                size="lg"
                mr={6}
              />
              <Text fontSize="lg">{title}</Text>
            </Flex>
            <Button
              width="full"
              mb={12}
              colorScheme="magenta"
              onClick={() =>
                onCompleteProject().then(() => {
                  window.location.href = `/courses/${course}/complete`;
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
                  href="https://discussion.openmined.org"
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
              Tell us about your experience on this project. Was it helpful?
              Full of bugs? Is the material no longer accurate?
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
                resize="none"
                variant="filled"
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
                colorScheme="magenta"
                width="full"
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
