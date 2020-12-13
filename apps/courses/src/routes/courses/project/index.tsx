import React, { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Link,
  ListItem,
  Tag,
  TagLabel,
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
  faMinusCircle,
  faTimesCircle,
  faShapes,
} from '@fortawesome/free-solid-svg-icons';

import ProjectAccordion from './ProjectAccordion';

import {
  getProjectPartStatus,
  getProjectStatus,
  hasAttemptedProjectPart,
  hasStartedProject,
} from '../_helpers';
import GridContainer from '../../../components/GridContainer';
import { useFirestore } from 'reactfire';
import SubmissionView from './SubmissionView';

const Detail = ({ title, value }) => (
  <Flex align="center" mb={4}>
    <Icon as={FontAwesomeIcon} icon={faCheckCircle} size="2x" />
    <Box ml={4}>
      <Text fontWeight="bold">{title}</Text>
      <Text color="gray.700">{value}</Text>
    </Box>
  </Flex>
);

const prepAccordionAndStatus = (progress, parts) => {
  const content = parts.map((part) => ({
    ...part,
    status: getProjectPartStatus(progress, part._key),
    attempts: hasAttemptedProjectPart(progress, part._key)
      ? progress.project.parts[part._key].attempts
      : [],
  }));

  return { content, status: getProjectStatus(progress, parts) };
};

const getStatusStyles = (status) => {
  if (status === 'not-started') {
    return {
      text: 'Not Started',
    };
  } else if (status === 'in-progress') {
    return {
      text: 'In Progress',
      icon: faMinusCircle,
      colorScheme: 'cyan',
    };
  } else if (status === 'passed') {
    return {
      text: 'Passed',
      icon: faCheckCircle,
      colorScheme: 'green',
    };
  } else if (status === 'failed') {
    return {
      text: 'Failed',
      icon: faTimesCircle,
      colorScheme: 'magenta',
    };
  }
};

// TODO: Remember to revisit the header title and such once you get the CMS plugged in
// TODO: Do a project-wide search for the original project string field and see where it was used (replace with project.title)
// TODO: Do the course completion page
// TODO: Figure out what we're gonna need to do for certification in various places around the site
// TODO: Create a sidebar component for use on a few pages
// TODO: Create a link props method to determine internal vs. external links

export default ({ course, page, progress, user, ts }) => {
  const db = useFirestore();

  const {
    title: courseTitle,
    project: { title, description, goals, needs, parts },
    level,
    length,
    certification,
  } = page;

  const [submissionView, setSubmissionView] = useState(null);

  if (submissionView) {
    return (
      <SubmissionView
        projectTitle={title}
        part={parts[parts.findIndex((p) => p._key === submissionView)]}
        setSubmissionView={setSubmissionView}
      />
    );
  }

  const SIDEBAR_WIDTH = 360;

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

  const { content, status } = prepAccordionAndStatus(progress, parts);
  const {
    icon: statusIcon,
    text: statusText,
    ...statusStyles
  } = getStatusStyles(status);

  const onBeginProjectPart = (part) => {
    const data = {};

    if (!hasStartedProject(progress)) {
      data.project = {
        started_at: ts(),
        parts: {},
      };
    }

    data.project.parts[part] = {
      started_at: ts(),
    };

    return db
      .collection('users')
      .doc(user.uid)
      .collection('courses')
      .doc(course)
      .set(data, { merge: true });
  };

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
          <Tag {...statusStyles}>
            {statusIcon && (
              <Icon as={FontAwesomeIcon} icon={statusIcon} mr={2} />
            )}
            <TagLabel fontWeight="bold">{statusText}</TagLabel>
          </Tag>
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
          <ProjectAccordion
            content={content}
            mb={6}
            setSubmissionView={setSubmissionView}
            onBeginProjectPart={onBeginProjectPart}
          />
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
