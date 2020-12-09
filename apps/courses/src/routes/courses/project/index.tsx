import React from 'react';
import { useParams, Link as RRDLink, Navigate } from 'react-router-dom';
import { useFirestore, useFirestoreDocDataOnce, useUser } from 'reactfire';
import {
  faBookOpen,
  faCheckCircle,
  faCommentAlt,
  faExternalLinkAlt,
  faLink,
  faLock,
  faLockOpen,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Page from '@openmined/shared/util-page';

import GridContainer from '../../../components/GridContainer';
import CourseHeader from '../../../components/CourseHeader';
import Detail from '../../../components/Detail';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';

const content = {
  course_name: 'Privacy & Society',
  title: 'Create a PB&J',
  status: 'not_started',
  level: 'Beginner',
  length: '6hr',
  certification: 'Path to ABC Certification',
  prerequisites: ['Zoom Application', 'Whatever is needed'],
  description:
    'Each student first finds a novel dataset and uploads it to the dataset registry. Then students request a dataset from the registry for a Duet session with another student wherein one student  (the “Data Scientist” persona) trains a ML model on a dataset which only the other student (the “Data Owner” persona) has. Their zoom/meet call over which the training occurs is recorded and submitted for evaluation.',
  goals: ['Goal one', 'Goal two'],
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
  resources: [
    {
      title: 'Discussion Board',
      icon: faCommentAlt,
      link: 'https://discussion.openmined.org/',
    },
    {
      title: 'Report Issue',
      icon: faCommentAlt,
      link: '#',
    },
    {
      title: 'See Example Project',
      icon: faPen,
      link: '#',
    },
  ],
};

const ProjectStatusBadge = ({ status }) => {
  const statuses = {
    not_started: {
      title: 'Not Started',
    },
    in_review: {
      title: 'In Review',
    },
    in_progress: {
      title: 'In Progress',
    },
    complete: {
      title: 'Complete',
    },
    failed: {
      title: 'Failed',
    },
  };

  return (
    <Badge
      px={2}
      mt={4}
      textTransform="initial"
      fontSize="sm"
      borderRadius="md"
    >
      {statuses[status].title}
    </Badge>
  );
};

const ProjectPart = ({ content, course, project_part, ...props }) => {
  const { title, status, description, attempts, max_attempts } = content;

  const statuses = {
    locked: {
      icon: faLock,
      color: 'gray',
    },
    unlocked: {
      icon: faLockOpen,
      color: 'magenta',
    },
    passed: {
      icon: faCheckCircle,
      color: 'green',
    },
    failed: {
      icon: faTimesCircle,
      color: 'red',
    },
  };

  const { icon, color } = statuses[status];

  const accordionButtonProps = {
    bgColor: `${color}.50`,
    color: `${color}.500`,
    _hover: {
      bgColor: `${color}.50`,
    },
  };

  return (
    <AccordionItem isDisabled={status === 'locked'} {...props}>
      <AccordionButton {...accordionButtonProps}>
        <Box flex="1" textAlign="left">
          <Icon size="lg" mr={2} as={FontAwesomeIcon} icon={icon} />
          {title}
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel borderColor={`${color}.50`} color="gray.700" pb={4}>
        <Box {...props}>
          <Text>{description}</Text>
        </Box>
        <Flex mt={8} align="center">
          <Button
            as={RRDLink}
            to={`/courses/${course}/project/${project_part}`}
            colorScheme="black"
          >
            Begin
          </Button>
          <Text ml={4} as="i">{`${attempts}/${max_attempts} attempts`}</Text>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default () => {
  const SIDEBAR_WIDTH = 360;

  const { course } = useParams();

  const {
    course_name,
    title,
    description,
    level,
    length,
    certification,
    prerequisites,
    goals,
    parts,
    status,
    resources,
  } = content;

  return (
    <Page title={'Title'}>
      {/* @ts-ignore */}
      <CourseHeader
        subtitle="Project"
        title={title}
        course={course}
        leftDrawerSections={[]}
      />
      <GridContainer isInitial pt={[8, null, null, 16]} pb={16}>
        <Flex
          align="flex-start"
          direction={{ base: 'column-reverse', lg: 'row' }}
        >
          <Box mr={{ lg: 16 }}>
            <Text color="gray.700" mb={2}>
              <Text fontWeight="bold" as="span">
                {course_name}
              </Text>
            </Text>
            <Heading as="h1" size="xl">
              {title}
            </Heading>
            <ProjectStatusBadge status={status} />
            <Divider my={6} />
            <Text color="gray.700" mb={6}>
              {description}
            </Text>
            <Heading my={4} as="h6" size="md">
              Goal
            </Heading>
            <UnorderedList>
              {goals.map((goal) => (
                <ListItem key={goal}>{goal}</ListItem>
              ))}
            </UnorderedList>
            <Accordion
              colorScheme="magenta"
              variant="boxed"
              allowMultiple
              mt={8}
            >
              {parts.map((part) => (
                <ProjectPart
                  course={course}
                  project_part="part-01"
                  key={part.title}
                  content={part}
                />
              ))}
            </Accordion>
            <Button mt={4} disabled colorScheme="magenta">
              Finish
            </Button>
          </Box>
          <Box
            bg="gray.100"
            p={6}
            width={{ base: 'full', lg: SIDEBAR_WIDTH }}
            flex={{ lg: `0 0 ${SIDEBAR_WIDTH}px` }}
            mt={{ base: 8, lg: 0 }}
          >
            {level && <Detail title="Level" value={level} />}
            {length && <Detail title="Length" value={length} />}
            {certification && (
              <Detail title="Certification" value={certification} />
            )}
            <Divider mb={4} />
            <Text fontWeight="bold">What You'll need</Text>
            <UnorderedList mt={4}>
              {prerequisites.map((p) => (
                <ListItem key={p}>{p}</ListItem>
              ))}
            </UnorderedList>
            {resources && (
              <>
                <Divider my={6} />
                {resources.map(({ title, link, icon }, index) => {

                  const linkProps = {
                    as: 'a',
                    href: link,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  };

                  return (
                    <Link
                      key={index}
                      color="gray.700"
                      _hover={{ color: 'gray.800' }}
                      display="block"
                      my={4}
                      {...linkProps}
                    >
                      <Flex justify="flex-start" align="center">
                        <Icon
                          size="lg"
                          mr={2}
                          color="gray.800"
                          as={FontAwesomeIcon}
                          icon={icon}
                        />
                        <Text>{title}</Text>
                      </Flex>
                    </Link>
                  );
                })}
              </>
            )}
          </Box>
        </Flex>
      </GridContainer>
    </Page>
  );
};
