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
  Icon,
  Text,
  Link,
  Image,
  Box,
} from '@chakra-ui/core';
import {
  faCheckCircle,
  faTimesCircle,
  faPaperPlane,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PROJECT_PART_SUBMISSIONS } from '../_helpers';

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
  } else if (status === 'attempted') {
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

const getDefaultOpenedTab = (content) => {
  if (content.every(({ status }) => status === 'passed')) return [];

  const failedOrFailedButPending = content.findIndex(
    ({ status }) => status === 'failed-but-pending' || status === 'failed'
  );

  if (failedOrFailedButPending !== -1) return [failedOrFailedButPending];

  const firstIfNotFinished = content.findIndex(
    ({ status }) =>
      status === 'in-progress' ||
      status === 'not-started' ||
      status === 'attempted'
  );

  if (firstIfNotFinished === -1) return [firstIfNotFinished];

  return [0];
};

const AttemptedView = ({
  image,
  title,
  description,
  attempts,
  viewPastSubmission,
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
    {attempts.map(({ status, ...attempt }, index) => {
      const passed = status === 'passed';

      const props = {
        key: index,
        p: 3,
        mt: 2,
        cursor: 'pointer',
        borderRadius: 'md',
        fontSize: 'sm',
        justify: 'space-between',
        align: 'center',
        bg: passed ? 'green.50' : 'magenta.50',
      };

      const iconColor = passed ? 'green.400' : 'magenta.400';

      return (
        <Flex {...props} onClick={viewPastSubmission}>
          <Flex align="center">
            <Icon
              as={FontAwesomeIcon}
              icon={passed ? faCheckCircle : faTimesCircle}
              color={iconColor}
              size="lg"
              mr={4}
            />
            <Text fontWeight="bold" mr={2}>
              {passed ? 'Passed' : 'Failed'}
            </Text>
            {/* TODO: Patrick, convert the below dates to something the user will understand */}
            <Text fontStyle="italic" color="gray.700">
              {passed ? attempt.passed_at : attempt.failed_at}
            </Text>
          </Flex>
          <Icon as={FontAwesomeIcon} icon={faArrowRight} color={iconColor} />
        </Flex>
      );
    })}
  </Box>
);

export default ({
  content,
  setSubmissionView,
  onBeginProjectPart,
  ...props
}) => {
  const [indexes, setIndexes] = useState(getDefaultOpenedTab(content));

  const openIndex = (index) => {
    if (indexes.includes(index)) setIndexes(indexes.filter((i) => i !== index));
    else setIndexes([...indexes, index]);
  };

  const pendingSubmissionText = (
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

  const getButtonText = (status) => {
    if (status === 'not-started') return 'Begin';
    else if (status === 'in-progress') return 'Continue Working';
    else if (status === 'attempted') return 'Review Submission';
    else if (status === 'failed-but-pending') return 'Try Again';
  };

  return (
    <Accordion index={indexes} {...props}>
      {content.map(({ _key, title, description, status, attempts }, index) => {
        const { color, icon, ...styles } = getStatusStyles(status);
        const bg = `${color}.${styles.bg}`;
        const text = `${color}.${styles.text}`;

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
            <AccordionButton {...buttonStyles} onClick={() => openIndex(index)}>
              <Flex flex="1" align="center">
                {typeof icon !== 'string' && (
                  <Icon
                    size="lg"
                    as={FontAwesomeIcon}
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
                        : pendingSubmissionText}
                    </Text>
                  )}
                  {status === 'failed-but-pending' && (
                    <AttemptedView
                      image="https://emojis.slackmojis.com/emojis/images/1531847584/4234/blob-eyeroll.gif?1531847584"
                      title="Sorry, let's try again!"
                      description="You did not pass this part of the project. You can check out the link below for your feedback and try again after making some corrections."
                      attempts={attempts}
                      viewPastSubmission={() => setSubmissionView(_key)}
                      mb={6}
                    />
                  )}
                  <Flex align="center">
                    <Button
                      onClick={() => {
                        if (status === 'not-started') {
                          onBeginProjectPart(_key).then(() => {
                            setSubmissionView(_key);
                          });
                        } else {
                          setSubmissionView(_key);
                        }
                      }}
                      colorScheme="black"
                      mr={4}
                    >
                      {getButtonText(status)}
                    </Button>
                    <Text color="gray.700" fontSize="sm">
                      {attempts.length} of {PROJECT_PART_SUBMISSIONS} attempts
                    </Text>
                  </Flex>
                </>
              )}
              {/* TODO: Patrick, get the links to our bootcamp signup and mentorship program signup */}
              {status === 'failed' && (
                <AttemptedView
                  image="https://emojis.slackmojis.com/emojis/images/1578406259/7444/sadblob.gif?1578406259"
                  title="You're out of attempts!"
                  description={
                    <>
                      We're sorry to inform you that you have run out of
                      attempts on this part of the project. But don't worry,
                      there are other ways to take your learning to the next
                      level. Try applying for one of our{' '}
                      <Link
                        as="a"
                        href=""
                        target="_blank"
                        rel="noopener noreferrer"
                        textDecoration="underline"
                        color="magenta.500"
                        _hover={{ color: 'magenta.700' }}
                      >
                        bootcamps
                      </Link>{' '}
                      or our{' '}
                      <Link
                        as="a"
                        href=""
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
                  attempts={attempts}
                  viewPastSubmission={() => setSubmissionView(_key)}
                />
              )}
              {status === 'passed' && (
                <AttemptedView
                  image="https://emojis.slackmojis.com/emojis/images/1572027739/6832/blob_cheer.png?1572027739"
                  title="Congratulations!"
                  description="You passed this portion of the project. Check out the link below for your feedback."
                  attempts={attempts}
                  viewPastSubmission={() => setSubmissionView(_key)}
                />
              )}
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
