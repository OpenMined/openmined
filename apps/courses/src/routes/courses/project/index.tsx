import React from 'react';
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/core';
import { Link as RRDLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBug,
  faCheckCircle,
  faCommentAlt,
  faListUl,
  faShapes,
} from '@fortawesome/free-solid-svg-icons';

import GridContainer from '../../../components/GridContainer';
import StatusAccordion from '../../../components/StatusAccordion';

/*
parts: [
  {
    title: 'Extremely hard part',
    status: 'failed',
    description:
      'Some may say that white tastes better but wheat is healthier. It is up to you to decide. In this section you’ll write up a proposal on what your preferred bread is and why.',
    attempts: 2,
    max_attempts: 2,
  },
  {
    title: "Click 'n pass",
    status: 'passed',
    description:
      'Some may say that white tastes better but wheat is healthier. It is up to you to decide. In this section you’ll write up a proposal on what your preferred bread is and why.',
    attempts: 1,
    max_attempts: 2,
  },
  {
    title: 'Choose Your Bread',
    status: 'unlocked',
    description:
      'Some may say that white tastes better but wheat is healthier. It is up to you to decide. In this section you’ll write up a proposal on what your preferred bread is and why.',
    attempts: 0,
    max_attempts: 2,
  },
  {
    title: 'Locked Part of Project',
    status: 'locked',
    description:
      'Step instruction will be written here. Step instruction will be written here. Step instruction will be written here. Link to template.',
    attempts: 0,
    max_attempts: 2,
  },
],
*/

const Detail = ({ title, value }) => (
  <Flex align="center" mb={4}>
    <Icon as={FontAwesomeIcon} icon={faCheckCircle} size="2x" />
    <Box ml={4}>
      <Text fontWeight="bold">{title}</Text>
      <Text color="gray.700">{value}</Text>
    </Box>
  </Flex>
);

// TODO: Remember to revisit the header title and such once you get the CMS plugged in
// TODO: Do a project-wide search for the original project string field and see where it was used (replace with project.title)
// TODO: Do the course completion page
// TODO: Figure out what we're gonna need to do for certification in various places around the site
// TODO: Create a sidebar component for use on a few pages
// TODO: Create a link props method to determine internal vs. external links

export default ({ course, page, progress, ...props }) => {
  const SIDEBAR_WIDTH = 360;

  const {
    title: courseTitle,
    project: { title, description, goals, needs, parts },
    level,
    length,
    certification,
  } = page;

  const resources = [
    {
      title: 'Discussion Board',
      link: 'https://discussion.openmined.org',
      icon: faCommentAlt,
    },
    {
      title: 'Course Syllabus',
      link: `/courses/${course}`,
      icon: faListUl,
    },
    {
      title: 'Report Issue',
      link: 'https://github.com/OpenMined/openmined/issues',
      icon: faBug,
    },
  ];

  // TODO: Patrick, fill this in
  const status = 'Not Started';

  return (
    <GridContainer isInitial pt={[8, null, null, 16]} pb={16}>
      <Flex
        align="flex-start"
        direction={{ base: 'column-reverse', lg: 'row' }}
      >
        <Box mr={{ lg: 16 }}>
          <Text color="gray.700" fontWeight="bold" mb={2}>
            {courseTitle}
          </Text>
          <Box position="relative" mb={4}>
            <Icon
              as={FontAwesomeIcon}
              icon={faShapes}
              size="2x"
              position="absolute"
              top={1}
              left={-16}
            />
            <Heading as="h1" size="xl">
              {title}
            </Heading>
          </Box>
          <Badge
            px={3}
            py={1}
            textTransform="none"
            fontSize="sm"
            borderRadius="md"
          >
            {status}
          </Badge>
          <Divider my={6} />
          <Text color="gray.700" mb={6}>
            {description}
          </Text>
          <Heading mb={4} as="p" size="md">
            Goal
          </Heading>
          <UnorderedList spacing={2} mb={6}>
            {goals.map((goal) => (
              <ListItem key={goal}>{goal}</ListItem>
            ))}
          </UnorderedList>
          {/* <StatusAccordion content={parts} /> */}
          <Button disabled colorScheme="black">
            Finish
          </Button>
        </Box>
        <Box
          bg="gray.100"
          p={8}
          width={{ base: 'full', lg: SIDEBAR_WIDTH }}
          flex={{ lg: `0 0 ${SIDEBAR_WIDTH}px` }}
          mt={{ base: 8, lg: 0 }}
        >
          {level && <Detail title="Level" value={level} />}
          {length && <Detail title="Length" value={length} />}
          {certification && (
            <Detail title="Certification" value={certification} />
          )}
          <Divider my={6} />
          <Text fontWeight="bold" mb={4}>
            What You'll need
          </Text>
          <UnorderedList spacing={2}>
            {needs.map(({ title, link }) => {
              if (link) {
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
                  <ListItem key={title}>
                    <Link
                      {...linkProps}
                      color="gray.700"
                      _hover={{ color: 'gray.800' }}
                      textDecoration="underline"
                    >
                      {title}
                    </Link>
                  </ListItem>
                );
              }

              return (
                <ListItem key={title} color="gray.700">
                  {title}
                </ListItem>
              );
            })}
          </UnorderedList>
          <Divider my={6} />
          {resources.map(({ title, link, icon }, index) => {
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
              <Link
                key={index}
                color="gray.700"
                _hover={{ color: 'gray.800' }}
                display="block"
                mt={6}
                {...linkProps}
              >
                <Flex align="center">
                  <Icon as={FontAwesomeIcon} icon={icon} size="lg" mr={4} />
                  <Text>{title}</Text>
                </Flex>
              </Link>
            );
          })}
        </Box>
      </Flex>
    </GridContainer>
  );
};
