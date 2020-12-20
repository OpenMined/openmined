import React from 'react';
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
  hasStartedProjectPart,
  PROJECT_PART_SUBMISSIONS,
} from '../_helpers';
import GridContainer from '../../../components/GridContainer';
import { getLinkPropsFromLink, useQueryState } from '../../../helpers';
import { handleErrors } from '../../../helpers';
import useToast from '../../../components/Toast';
import { handleAttemptSubmission, handleProjectPartBegin } from '../_firebase';

// The detail links on the sidebar
const Detail = ({ title, value }) => (
  <Flex align="center" mb={4}>
    {/* SEE TODO (#3) */}
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

          if (equivalentReview && equivalentReview.status) {
            return { ...s, ...equivalentReview };
          }

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
export const prepAccordionAndStatus = (progress, parts) => {
  const content = parts.map((part) => ({
    ...part,
    status: getProjectPartStatus(progress, part._key),
    submissions: hasStartedProjectPart(progress, part._key)
      ? combineSubmissionsAndReviews(
          progress.project.parts[part._key].submissions,
          progress.project.parts[part._key].reviews
        )
      : [],
  }));

  return { content, status: getProjectStatus(progress, parts) };
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
  const toast = useToast();

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
  const onBeginProjectPart = (part) =>
    handleProjectPartBegin(
      db,
      user.uid,
      course,
      ts,
      progress,
      part
    ).catch((error) => handleErrors(toast, error));

  // When the user attempts a submission
  const onAttemptSubmission = async (part, content) => {
    handleAttemptSubmission(
      db,
      user.uid,
      course,
      arrayUnion,
      currentTime,
      progress,
      part,
      content
    )
      .then((succeed) => {
        // Once that's done, reload the screen to refresh the state
        succeed && window.location.reload();
      })
      .catch((error) => handleErrors(toast, error));
  };

  // We want to track the part and the attempt in state, but also in the query params
  const [submissionParams, setSubmissionParams] = useQueryState([
    'part',
    'attempt',
  ]);

  // If we have a submission view, render that screen
  if (submissionParams.part) {
    return (
      <SubmissionView
        projectTitle={title}
        number={getProjectPartNumber(parts, submissionParams.part)}
        part={
          content[content.findIndex((p) => p._key === submissionParams.part)]
        }
        submissionViewAttempt={submissionParams.attempt}
        setSubmissionParams={setSubmissionParams}
        onAttemptSubmission={onAttemptSubmission}
      />
    );
  }

  // Otherwise, render the main project page
  return (
    <GridContainer isInitial pt={[8, null, null, 16]} pb={16}>
      <Flex align="flex-start" direction={{ base: 'column', lg: 'row' }}>
        <Box mr={{ lg: 16 }}>
          <Text color="gray.700" fontWeight="bold" mb={2}>
            {courseTitle}
          </Text>
          <Box position="relative" mb={4}>
            {/* SEE TODO (#3) */}
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
            {/* SEE TODO (#3) */}
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
            setSubmissionParams={setSubmissionParams}
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
                return (
                  <ListItem key={title}>
                    <Link
                      {...getLinkPropsFromLink(link)}
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
            return (
              <Link
                key={index}
                color="gray.700"
                _hover={{ color: 'gray.800' }}
                display="block"
                mt={6}
                {...getLinkPropsFromLink(link)}
              >
                <Flex align="center">
                  {/* SEE TODO (#3) */}
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
