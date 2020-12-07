import React, { useState } from 'react';
import { Link as RRDLink, useNavigate } from 'react-router-dom';
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
} from '@chakra-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBug,
  faBullhorn,
  faCommentAlt,
} from '@fortawesome/free-solid-svg-icons';

import useToast, { toastConfig } from './Toast';

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
  const navigate = useNavigate();
  const toast = useToast();

  const [vote, setVote] = useState(null);
  const [feedback, setFeedback] = useState('');

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const BREAK = 'md';

  const votes = [
    { text: '👎', val: -1 },
    { text: '👌', val: 0 },
    { text: '👍', val: 1 },
  ];

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
          <Flex display={{ base: 'none', [BREAK]: 'flex' }} width={1 / 3}>
            <Popover
              isOpen={feedbackOpen}
              onClose={() => setFeedbackOpen(false)}
            >
              <PopoverTrigger>
                <Flex
                  as={Link}
                  onClick={() => setFeedbackOpen(true)}
                  align="center"
                  color="gray.400"
                  _hover={{ color: 'gray.200' }}
                >
                  <Icon as={FontAwesomeIcon} icon={faBullhorn} mr={4} />
                  <Text>Give Feedback</Text>
                </Flex>
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
          </Flex>
          <Flex width={1 / 3} justify="center">
            <Flex align="center">
              <Button
                onClick={() => {
                  navigate(backLink);

                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                colorScheme={isBackAvailable ? 'magenta' : 'black'}
                disabled={!isBackAvailable}
              >
                Back
              </Button>
              <Text mx={12} color="gray.400" onClick={() => setHelpOpen(true)}>
                {current} of {total}
              </Text>
              <Button
                onClick={() => {
                  onCompleteConcept().then(() => {
                    navigate(nextLink);

                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  });
                }}
                colorScheme={isNextAvailable ? 'magenta' : 'black'}
                disabled={!isNextAvailable}
              >
                Next
              </Button>
            </Flex>
          </Flex>
          <Flex
            display={{ base: 'none', [BREAK]: 'flex' }}
            width={1 / 3}
            justify="flex-end"
          >
            <Menu
              isOpen={helpOpen}
              onOpen={() => setHelpOpen(true)}
              onClose={() => setHelpOpen(false)}
            >
              <MenuButton onClick={() => setHelpOpen(true)}>
                <Flex
                  as={Link}
                  align="center"
                  color="gray.400"
                  _hover={{ color: 'gray.200' }}
                >
                  <Icon as={FontAwesomeIcon} icon={faCommentAlt} mr={4} />
                  <Text>Get Help</Text>
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
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
