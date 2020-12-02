import React from 'react';
import {
  Box,
  Flex,
  Text,
  Divider,
  Stack,
  Button,
  Progress,
  Icon,
  Heading,
  Image,
} from '@chakra-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faLongArrowAltRight,
} from '@fortawesome/free-solid-svg-icons';

import theme from '../../../theme';

export default ({ content, ...props }) => {
  const lessons = [
    {
      name: 'Lesson 1',
      completed: true,
    },
    {
      name: 'Lesson 2',
      completed: true,
    },
    {
      name: 'Name of Quiz',
      completed: false,
    },
  ];
  const absoluteOpacityStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transitionProperty: 'opacity',
    transitionDuration: 'slow',
    transitionTimingFunction: 'ease-in-out',
  };

  const progress = 70; // this will be received from api, or can be calculated, but currently hardcoded
  const ongoing = false; // this will be received from api

  const { title, visual, cost, level, length, description } = content;
  return ongoing ? (
    <Box w="90%" {...props}>
      <Text fontWeight="bold" fontSize="xl">
        Resume
      </Text>
      <Box mt={5} width={['100%']} p={4} boxShadow="lg">
        <Flex justifyContent="space-between">
          <Heading as="h3" size="lg" mb={2} fontWeight="bold">
            {title}
          </Heading>
          <Text fontWeight="normal" fontSize="xs" color="gray.600">
            {progress}%
          </Text>
        </Flex>
        <Stack direction="row" h="20px" fontSize="sm" color="gray.600">
          <Text fontFamily="mono" color="gray.500" as="span">
            {level}
          </Text>
          <Divider orientation="vertical" />
          <Text fontFamily="mono" color="gray.500" as="span">
            {length}
          </Text>
        </Stack>
        <Stack
          direction="column"
          fontSize="sm"
          backgroundColor="#f3fcfd"
          p={4}
          my={2}
          width={`${progress}%`}
        >
          {lessons.map((lesson) => (
            <Box>
              {lesson.completed ? (
                <FontAwesomeIcon icon={faCheckCircle} />
              ) : (
                <Text
                  as="span"
                  w="14px"
                  h="14px"
                  d="inline-block"
                  border="2px solid black"
                  borderRadius="50%"
                ></Text>
              )}
              <Text as="span" m={4}>
                {lesson.name}
              </Text>
            </Box>
          ))}
        </Stack>
        <Flex flexDirection="row-reverse">
          <Button variant="ghost">
            <Text as="span" pr={2}>
              Start
            </Text>
            <Icon as={FontAwesomeIcon} icon={faLongArrowAltRight} />
          </Button>
        </Flex>
      </Box>
      <Progress value={progress} size="sm" colorScheme="green" />
    </Box>
  ) : (
    <Box {...props}>
      <Text fontWeight="bold" fontSize="xl">
        Begin Learning
      </Text>
      <Flex
        color="white"
        role="group"
        direction="column"
        justify="space-between"
        transitionProperty="transform filter"
        transitionDuration="slow"
        transitionTimingFunction="ease-in-out"
        cursor="pointer"
        bg="gray.800"
        position="relative"
        overflow="hidden"
        borderRadius="md"
        boxShadow="lg"
        p={6}
        mt={5}
      >
        <Flex direction="row" justifyContent="space-between" flex={1}>
          <Box width={['100%', '80%', '60%']}>
            <Text fontFamily="mono" color="gray.400" mb={2}>
              {cost.toUpperCase()}
            </Text>
            <Heading as="h3" size="lg" mb={8}>
              {title}
            </Heading>
            <Text color="gray.600" mb={2} pr={2} noOfLines={2}>
              {description}
            </Text>
          </Box>
          <Box
            width="200px"
            height="200px"
            borderRadius="full"
            mx="auto"
            mb={8}
            position="relative"
          >
            <Image
              {...absoluteOpacityStyles}
              src={visual.default}
              alt={title}
              _groupHover={{ opacity: 0 }}
            />
            <Image
              {...absoluteOpacityStyles}
              src={visual.full}
              alt={title}
              opacity={0}
              _groupHover={{ opacity: 1 }}
            />
          </Box>
        </Flex>
        <Flex alignItems="center" justify="space-between" flexDirection="row">
          <Box>
            <Stack direction="row" h="20px" fontSize="sm" color="gray.600">
              <Text fontFamily="mono" as="span">
                {level}
              </Text>
              <Divider orientation="vertical" />
              <Text fontFamily="mono" as="span">
                {length}
              </Text>
            </Stack>
          </Box>
          <Button
            variant="ghost"
            _hover={{ backgroundColor: 'white', color: theme.colors.gray[900] }}
          >
            <Text as="span" pr={2}>
              Begin Course
            </Text>
            <Icon as={FontAwesomeIcon} icon={faLongArrowAltRight} />
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};
