import React, { useState } from 'react';
import { Link as RRDLink } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Progress,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBug,
  faBullhorn,
  faCommentAlt,
} from '@fortawesome/free-solid-svg-icons';

import useToast, { toastConfig } from '../../../components/Toast';

const BREAK = 'md';

const Feedback = ({
  feedbackOpen,
  setFeedbackOpen,
  vote,
  setVote,
  feedback,
  setFeedback,
  onProvideFeedback,
  setHelpOpen,
}) => {
  const toast = useToast();

  const votes = [
    { text: '👎', val: -1 },
    { text: '👌', val: 0 },
    { text: '👍', val: 1 },
  ];

  return (
    <Popover isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)}>
      <PopoverTrigger>
        <Link
          onClick={() => setFeedbackOpen(true)}
          color="gray.400"
          _hover={{ color: 'gray.200' }}
        >
          <Flex align="center">
            <Icon as={FontAwesomeIcon} icon={faBullhorn} />
            <Text display={{ base: 'none', [BREAK]: 'block' }} ml={4}>
              Give Feedback
            </Text>
          </Flex>
        </Link>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Provide Feedback</PopoverHeader>
        <PopoverBody>
          <Flex justify="space-around" align="center" mb={3}>
            {votes.map(({ text, val }) => (
              <Text
                fontSize="3xl"
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
            mb={1}
          />
          <Flex justify="flex-end">
            <Button
              onClick={() => {
                onProvideFeedback(vote, feedback).then(() => {
                  setFeedbackOpen(false);

                  if (vote === 1) {
                    toast({
                      ...toastConfig,
                      title: 'Feedback sent',
                      description:
                        "We appreciate you telling us how we're doing!",
                      status: 'success',
                    });
                  } else {
                    toast({
                      ...toastConfig,
                      title: 'Feedback sent',
                      description:
                        "Thanks for the note - if you've found something wrong, would you like to file a bug report?",
                      status: 'success',
                    });

                    setTimeout(() => {
                      setHelpOpen(true);
                    }, 1000);
                  }
                });
              }}
              disabled={vote === null}
              colorScheme="magenta"
            >
              Submit
            </Button>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const Help = ({ helpOpen, setHelpOpen }) => {
  const helpLinks = [
    {
      title: 'Report a Bug',
      link: 'https://github.com/OpenMined/openmined/issues',
      icon: faBug,
    },
    {
      title: 'Forum',
      link: 'https://discussion.openmined.org',
      icon: faCommentAlt,
    },
  ];

  return (
    <Menu
      isOpen={helpOpen}
      onOpen={() => setHelpOpen(true)}
      onClose={() => setHelpOpen(false)}
    >
      <MenuButton
        onClick={() => setHelpOpen(true)}
        color="gray.400"
        _hover={{ color: 'gray.200' }}
      >
        <Flex align="center">
          <Icon as={FontAwesomeIcon} icon={faCommentAlt} />
          <Text display={{ base: 'none', [BREAK]: 'block' }} ml={4}>
            Get Help
          </Text>
        </Flex>
      </MenuButton>
      <MenuList>
        {helpLinks.map(({ title, link, icon }, index) => {
          const isExternal =
            link.includes('http://') || link.includes('https://');

          const linkProps = isExternal
            ? {
                as: 'a',
                href: link,
                target: '_blank',
                rel: 'noopener noreferrer',
              }
            : {
                as: RRDLink,
                to: link,
              };

          return (
            <MenuItem key={index} {...linkProps}>
              {icon && (
                <Icon
                  as={FontAwesomeIcon}
                  icon={icon}
                  size="lg"
                  color="gray.400"
                  mr={4}
                />
              )}
              <Text color="gray.700">{title}</Text>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

const Controls = ({
  isBackAvailable,
  backLink,
  isNextAvailable,
  nextLink,
  current,
  total,
  onCompleteConcept,
}) => (
  <Flex align="center">
    <Button
      onClick={() => {
        window.location.href = backLink;
      }}
      colorScheme={isBackAvailable ? 'magenta' : 'black'}
      disabled={!isBackAvailable}
    >
      Back
    </Button>
    <Text mx={[6, null, 8, 12]} color="gray.400">
      {current} of {total}
    </Text>
    <Button
      onClick={() => {
        onCompleteConcept().then(() => {
          window.location.href = nextLink;
        });
      }}
      colorScheme={isNextAvailable ? 'magenta' : 'black'}
      disabled={!isNextAvailable}
    >
      Next
    </Button>
  </Flex>
);

export default ({
  current,
  total,
  isBackAvailable,
  backLink,
  isNextAvailable,
  nextLink,
  onCompleteConcept,
  scrollProgress,
  onProvideFeedback,
}) => {
  const [vote, setVote] = useState(null);
  const [feedback, setFeedback] = useState('');

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <Box
      position="fixed"
      width="100%"
      bottom={0}
      left={0}
      py={{ base: 6, [BREAK]: 4 }}
      bg="gray.900"
      boxShadow="md"
      zIndex={2}
    >
      <Box position="absolute" top={-2} left={0} width="full">
        <Progress value={scrollProgress || 0} size="sm" colorScheme="magenta" />
      </Box>
      <Box px={8}>
        <Flex justify="space-between" align="center">
          <Flex width={{ base: 6, [BREAK]: 1 / 4 }}>
            <Feedback
              feedbackOpen={feedbackOpen}
              setFeedbackOpen={setFeedbackOpen}
              vote={vote}
              setVote={setVote}
              feedback={feedback}
              setFeedback={setFeedback}
              onProvideFeedback={onProvideFeedback}
              setHelpOpen={setHelpOpen}
            />
          </Flex>
          <Flex
            width={{ base: 'full', [BREAK]: 1 / 2 }}
            justify="center"
            mx={4}
          >
            <Controls
              isBackAvailable={isBackAvailable}
              backLink={backLink}
              isNextAvailable={isNextAvailable}
              nextLink={nextLink}
              current={current}
              total={total}
              onCompleteConcept={onCompleteConcept}
            />
          </Flex>
          <Flex width={{ base: 6, [BREAK]: 1 / 4 }} justify="flex-end">
            <Help helpOpen={helpOpen} setHelpOpen={setHelpOpen} />
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
