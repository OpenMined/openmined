import React, { useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Circle,
  Flex,
  Text,
  Link,
  Image,
  Box,
} from '@chakra-ui/react';
import {
  faCheckCircle,
  faTimesCircle,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';

import SubmissionInline from './SubmissionInline';

import { PROJECT_PART_SUBMISSIONS } from '../_helpers';
import Icon from '../../../components/Icon';

// As we did on the main file, we need to get some basic styles for the <AccordionItem /> according to this part's status
const getStatusStyles = (status) => {
  if (status === 'not-started') {
    return {
      icon: 'number',
      color: 'gray',
      bg: 200,
      text: 800,
    };
  } else if (status === 'in-progress') {
    return {
      icon: 'number',
      color: 'cyan',
      bg: 50,
      text: 700,
    };
  } else if (status === 'submitted') {
    return {
      icon: faPaperPlane,
      color: 'cyan',
      bg: 50,
      text: 700,
    };
  } else if (status === 'failed-but-pending') {
    return {
      icon: faTimesCircle,
      color: 'cyan',
      bg: 50,
      text: 700,
    };
  } else if (status === 'passed') {
    return {
      icon: faCheckCircle,
      color: 'green',
      bg: 50,
      text: 600,
    };
  } else if (status === 'failed') {
    return {
      icon: faTimesCircle,
      color: 'magenta',
      bg: 50,
      text: 500,
    };
  }
};

// A function that will tell us what tab to have open by default
// This heavily depends on the status of the various parts
const getDefaultOpenedTab = (content) => {
  // If every part has a "passed" status, none of them should be open (because you're done)
  if (content.every(({ status }) => status === 'passed')) return [];

  // Check for all parts with a status of "failed-but-pending" or "failed" and get the first one
  const failedOrFailedButPending = content.findIndex(
    ({ status }) => status === 'failed-but-pending' || status === 'failed'
  );

  // If there's at least one, open it
  if (failedOrFailedButPending !== -1) return [failedOrFailedButPending];

  // Otherwise, check for any that are "in-progress", "not-started", or "submitted" and get the first one
  const firstIfNotFinished = content.findIndex(
    ({ status }) =>
      status === 'in-progress' ||
      status === 'not-started' ||
      status === 'submitted'
  );

  // If there's at least one, open it
  if (firstIfNotFinished === -1) return [firstIfNotFinished];

  // Otherwise, just open the first
  return [0];
};

// This is a component that shows up when the user has made a failed attempt ("failed-but-pending")
// ... has failed all attempts ("failed")
// ... or has passed the part ("passed")
const AttemptedView = ({
  image,
  title,
  description,
  submissions,
  setSubmissionParams,
  part,
  ...props
}) => (
  <Box {...props}>
    <Flex direction="column" align="center" textAlign="center" mb={6}>
      <Image src={image} boxSize={12} mb={4} />
      <Text fontWeight="bold" mb={2}>
        {title}
      </Text>
      <Text color="gray.700" fontSize="sm">
        {description}
      </Text>
    </Flex>
    {submissions.map((submission, index) => (
      <SubmissionInline
        key={index}
        part={part}
        index={index}
        {...submission}
        setSubmissionParams={setSubmissionParams}
      />
    ))}
  </Box>
);

export default ({
  content,
  setSubmissionParams,
  onBeginProjectPart,
  ...props
}) => {
  // Set up a way to track the current open accordion items (by their "indexes")
  const [indexes, setIndexes] = useState(getDefaultOpenedTab(content));

  // What happens when you open an accordion item
  const openIndex = (index) => {
    if (indexes.includes(index)) setIndexes(indexes.filter((i) => i !== index));
    else setIndexes([...indexes, index]);
  };

  // The text to show when the user is pending a submission review
  const pendingReviewText = (
    <>
      Thank you for your submission! Out mentors will review your work and give
      you feedback within 1-2 days. You will receive a notification and an email
      when your project has been reviewed. In the meantime, see what others did
      by discussing this project on our{' '}
      <Link
        as="a"
        textDecoration="underline"
        href="https://discussion.openmined.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Discussion Board
      </Link>
      .
    </>
  );

  // The text of the main CTA button, depending on the status of the part
  const getButtonText = (status) => {
    if (status === 'not-started') return 'Begin';
    else if (status === 'in-progress') return 'Continue Working';
    else if (status === 'submitted') return 'Review Submission';
    else if (status === 'failed-but-pending') return 'Try Again';
  };

  return (
    <Accordion index={indexes} {...props}>
      {content.map(
        ({ _key, title, description, status, submissions }, index) => {
          const onlyPassAndFailSubmissions = submissions.filter(
            ({ status }) =>
              status === 'passed' ||
              status === 'failed' ||
              status === 'failed-but-pending'
          );

          const { color, icon, ...styles } = getStatusStyles(status);
          const bg = `${color}.${styles.bg}`;
          const text = `${color}.${styles.text}`;

          // The part should be disabled if it's not the first part and if the status of the part before hasn't "passed"
          const isDisabled =
            index !== 0 && content[index - 1].status !== 'passed';

          const buttonStyles = {
            px: 6,
            py: 4,
            bg,
            color: text,
            borderRadius: 'md',
            borderColor: bg,
            fontWeight: 'bold',
            _hover: { bg },
            _expanded: {
              borderBottomRadius: 'none',
            },
          };

          return (
            <AccordionItem
              key={title}
              isDisabled={isDisabled}
              border="none"
              my={4}
            >
              <AccordionButton
                {...buttonStyles}
                onClick={() => openIndex(index)}
              >
                <Flex flex="1" align="center">
                  {typeof icon !== 'string' && (
                    <Icon
                      size="lg"
                      icon={icon}
                      color={text}
                    />
                  )}
                  {typeof icon === 'string' && (
                    <Circle bg={text} color={bg} size={8}>
                      {index + 1}
                    </Circle>
                  )}
                  <Text as="span" ml={4}>
                    {title}
                  </Text>
                </Flex>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel
                px={8}
                py={6}
                border="1px solid"
                borderColor={bg}
                borderBottomRadius="md"
              >
                {status !== 'passed' && status !== 'failed' && (
                  <>
                    {status !== 'failed-but-pending' && (
                      <Text color="gray.700" mb={6}>
                        {status === 'not-started' || status === 'in-progress'
                          ? description
                          : pendingReviewText}
                      </Text>
                    )}
                    {status === 'failed-but-pending' && (
                      <AttemptedView
                        image="https://emojis.slackmojis.com/emojis/images/1531847584/4234/blob-eyeroll.gif?1531847584"
                        title="Sorry, let's try again!"
                        description="You did not pass this part of the project. You can check out the link below for your feedback and try again after making some corrections."
                        submissions={onlyPassAndFailSubmissions}
                        setSubmissionParams={setSubmissionParams}
                        part={_key}
                        mb={6}
                      />
                    )}
                    <Flex align="center">
                      <Button
                        onClick={() => {
                          if (status === 'not-started') {
                            onBeginProjectPart(_key).then(() => {
                              setSubmissionParams({ part: _key });
                            });
                          } else {
                            setSubmissionParams({ part: _key });

                            if (status === 'submitted') {
                              setSubmissionParams({
                                part: _key,
                                attempt: submissions.findIndex(
                                  ({ status }) => status === 'pending'
                                ),
                              });
                            }
                          }
                        }}
                        colorScheme="black"
                        mr={4}
                      >
                        {getButtonText(status)}
                      </Button>
                      <Text color="gray.700" fontSize="sm">
                        {
                          submissions.filter(({ status }) => status !== 'none')
                            .length
                        }{' '}
                        of {PROJECT_PART_SUBMISSIONS} attempts
                      </Text>
                    </Flex>
                  </>
                )}
                {status === 'failed' && (
                  <AttemptedView
                    image="https://emojis.slackmojis.com/emojis/images/1578406259/7444/sadblob.gif?1578406259"
                    title="You're out of attempts!"
                    description={
                      <>
                        We're sorry to inform you that you have run out of
                        attempts on this part of the project. But don't worry,
                        there are other ways to take your learning to the next
                        level. Try applying for our{' '}
                        <Link
                          as="a"
                          href="https://mentorship.openmined.org"
                          target="_blank"
                          rel="noopener noreferrer"
                          textDecoration="underline"
                          color="magenta.500"
                          _hover={{ color: 'magenta.700' }}
                        >
                          mentorship program
                        </Link>{' '}
                        to get more hands-on training.
                      </>
                    }
                    submissions={onlyPassAndFailSubmissions}
                    setSubmissionParams={setSubmissionParams}
                    part={_key}
                  />
                )}
                {status === 'passed' && (
                  <AttemptedView
                    image="https://emojis.slackmojis.com/emojis/images/1572027739/6832/blob_cheer.png?1572027739"
                    title="Congratulations!"
                    description="You passed this portion of the project. Check out the link below for your feedback."
                    submissions={onlyPassAndFailSubmissions}
                    setSubmissionParams={setSubmissionParams}
                    part={_key}
                  />
                )}
              </AccordionPanel>
            </AccordionItem>
          );
        }
      )}
    </Accordion>
  );
};
