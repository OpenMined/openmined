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
} from '@chakra-ui/react';
import { useFirestore } from 'reactfire';
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
import SubmissionView from './SubmissionView';

import {
  getProjectPartNumber,
  getProjectPartStatus,
  getProjectStatus,
  hasSubmittedProjectPart,
  hasStartedProject,
  hasReceivedProjectPartReview,
  PROJECT_PART_SUBMISSIONS,
} from '../_helpers';
import GridContainer from '../../../components/GridContainer';

// The detail links on the sidebar
const Detail = ({ title, value }) => (
  <Flex align="center" mb={4}>
    <Icon as={FontAwesomeIcon} icon={faCheckCircle} size="2x" />
    <Box ml={4}>
      <Text fontWeight="bold">{title}</Text>
      <Text color="gray.700">{value}</Text>
    </Box>
  </Flex>
);

// Intelligently combine the submissions array and the reviews array so they're easier to work with
const combineSubmissionsAndReviews = (submissions, reviews) =>
  submissions && submissions.length > 0
    ? [
        ...submissions.map((s, i) => {
          const equivalentReview = reviews[i];

          if (equivalentReview) return { ...s, ...equivalentReview };
          return { ...s, status: 'pending' };
        }),
        ...Array(PROJECT_PART_SUBMISSIONS - submissions.length).fill({
          status: 'none',
        }),
      ]
    : Array(PROJECT_PART_SUBMISSIONS).fill({ status: 'none' });

// Tell us the status the entire project
// ... and go through the user's progress and tell us the status of each part
// ... and return all the relevant submissions and reviews
const prepAccordionAndStatus = (progress, parts) => {
  const content = parts.map((part) => ({
    ...part,
    status: getProjectPartStatus(progress, part._key),
    submissions: hasSubmittedProjectPart(progress, part._key)
      ? combineSubmissionsAndReviews(
          progress.project.parts[part._key].submissions,
          progress.project.parts[part._key].reviews
        )
      : [],
  }));

  // return { content, status: getProjectStatus(progress, parts) };
  return { content, status: 'passed' };
};

// Return the appropriate text and <Tag /> styles for the relevant status
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

export default ({ course, page, progress, user, ts }) => {
  const db = useFirestore();

  const {
    title: courseTitle,
    project: { title, description, goals, needs, parts },
    level,
    length,
    certification,
  } = page;

  // Set up the width of the sidebar
  const SIDEBAR_WIDTH = 360;

  // Define the resources for that sidebar, too
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

  // Make sure to get the content for each of the parts and the project status
  const { content, status } = prepAccordionAndStatus(progress, parts);

  // Also get the styles for the current project status
  const {
    icon: statusIcon,
    text: statusText,
    ...statusStyles
  } = getStatusStyles(status);

  // Save the arrayUnion function so that we can push items into a Firestore array
  const arrayUnion = useFirestore.FieldValue.arrayUnion;

  // Apparently, you cannot use SererTimestamp (ts()) inside of arrayUnion, so this is needed
  // https://stackoverflow.com/questions/52324505/function-fieldvalue-arrayunion-called-with-invalid-data-fieldvalue-servertime
  const currentTime = useFirestore.Timestamp.now;

  // When beginning a project part
  const onBeginProjectPart = (part) => {
    const data = progress;

    // If they haven't begun the project at all
    if (!hasStartedProject(progress)) {
      data.project = {
        started_at: ts(),
        parts: {},
      };
    }

    // Add the project part to the object of parts
    data.project.parts[part] = {
      started_at: ts(),
      submissions: [], // Make sure to set the submissions array up
      reviews: [], // Make sure to also set the reviews array up
    };

    return db
      .collection('users')
      .doc(user.uid)
      .collection('courses')
      .doc(course)
      .set(data, { merge: true });
  };

  // When the user attempts a submission
  const onAttemptSubmission = async (part, content) => {
    // Get their current submissions
    const submissions = progress.project.parts[part].submissions;

    // If we have less than the total number of allowed submissions
    if (submissions.length < PROJECT_PART_SUBMISSIONS) {
      // Get the current time (see where this function is defined above)
      const time = currentTime();

      // First, submit the submissions to the submissions subcollection
      const submission = await db
        .collection('users')
        .doc(user.uid)
        .collection('courses')
        .doc(course)
        .collection('submissions')
        .add({
          course,
          part,
          attempt:
            submissions && submissions.length ? submissions.length + 1 : 1,
          student: db.collection('users').doc(user.uid),
          submitted_at: time,
          content,
        });

      // Once that's done, add the submissions to the submissions array on the user's course document
      // Note the use of the reference to the previous submission
      await db
        .collection('users')
        .doc(user.uid)
        .collection('courses')
        .doc(course)
        .set(
          {
            project: {
              parts: {
                [part]: {
                  submissions: arrayUnion({
                    submitted_at: time,
                    submission,
                  }),
                },
              },
            },
          },
          { merge: true }
        )
        .then(() => {
          // Once that's done, reload the screen to refresh the state
          window.location.reload();
        });
    }
  };

  // submissionView will be set to a project part "_key" and will change the layout
  // submissionViewAttempt is used with submissionView to assign a specific attempt to the submission view
  const [submissionView, setSubmissionView] = useState(null);
  const [submissionViewAttempt, setSubmissionViewAttempt] = useState(null);

  // If we have a submission view, render that screen
  if (submissionView) {
    return (
      <SubmissionView
        projectTitle={title}
        number={getProjectPartNumber(parts, submissionView)}
        part={content[content.findIndex((p) => p._key === submissionView)]}
        setSubmissionView={setSubmissionView}
        submissionViewAttempt={submissionViewAttempt}
        setSubmissionViewAttempt={setSubmissionViewAttempt}
        onAttemptSubmission={onAttemptSubmission}
      />
    );
  }

  // Otherwise, render the main project page
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
            setSubmissionViewAttempt={setSubmissionViewAttempt}
            onBeginProjectPart={onBeginProjectPart}
          />
          <Button
            disabled={!(status === 'passed' || status === 'failed')}
            onClick={() =>
              (window.location.href = `/courses/${course}/project/complete`)
            }
            colorScheme="black"
          >
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
            <Detail title="Certification" value={certification.title} />
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
