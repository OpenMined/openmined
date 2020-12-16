import React from 'react';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Circle,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Image,
  Link,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useFirestoreDocDataOnce } from 'reactfire';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import SubmissionInline from './SubmissionInline';

import { PROJECT_PART_SUBMISSIONS } from '../_helpers';
import { Content } from '../concept/content';
import GridContainer from '../../../components/GridContainer';
import RichTextEditor, {
  EDITOR_STORAGE_STRING,
} from '../../../components/RichTextEditor';

dayjs.extend(relativeTime);

const tabProps = {
  fontWeight: 'bold',
  color: 'gray.600',
  borderColor: 'gray.300',
  py: 4,
  _selected: {
    bg: 'cyan.50',
    color: 'cyan.700',
    border: '1px solid',
    borderColor: 'cyan.100',
    borderBottom: '2px solid',
    borderBottomColor: 'cyan.700',
    borderTopLeftRadius: 'md',
    borderTopRightRadius: 'md',
  },
};

const ReviewStatus = ({ status }) => {
  const passed = status === 'passed';
  const image = passed
    ? 'https://emojis.slackmojis.com/emojis/images/1572027739/6832/blob_cheer.png?1572027739'
    : 'https://emojis.slackmojis.com/emojis/images/1578406259/7444/sadblob.gif?1578406259';
  const message = passed
    ? 'Congratulations! You have passed this part of the project. Read below for more in-depth feedback from our mentors.'
    : 'Sorry you did not pass this part of the project. Read below for more in-depth feedback from our mentors.';

  return (
    <Flex width="full" p={6} bg="gray.800" borderRadius="md" align="center">
      <Image src={image} boxSize={12} mr={4} />
      <Box>
        <Text
          color={passed ? 'green.200' : 'magenta.200'}
          fontWeight="bold"
          fontSize="xl"
          mb={2}
        >
          {passed ? 'Success' : 'Fail'}
        </Text>
        <Text color="gray.400">{message}</Text>
      </Box>
    </Flex>
  );
};

export default ({
  setSubmissionView,
  submissionViewAttempt,
  setSubmissionViewAttempt,
  onAttemptSubmission,
  projectTitle,
  number,
  part,
}) => {
  const { _key, title, submissions } = part;

  // If we've been asked to load an attempt for this page
  const attemptRef =
    submissionViewAttempt !== null
      ? submissions[submissionViewAttempt].submission
      : null;
  const attemptData = attemptRef ? useFirestoreDocDataOnce(attemptRef) : null;

  // If we've been asked to load a review for this page
  const reviewRef =
    submissionViewAttempt !== null
      ? submissions[submissionViewAttempt].review
      : null;
  const reviewData = reviewRef ? useFirestoreDocDataOnce(reviewRef) : null;

  const onlyFailedOrPassedSubmissions = submissions.filter(
    ({ status }) => status === 'passed' || status === 'failed'
  );

  return (
    <Box bg="gray.50">
      <GridContainer isInitial pt={[8, null, null, 16]} pb={16}>
        <Flex justify="space-between" align="center">
          {/* SEE TODO (#3) */}
          <Breadcrumb
            spacing={2}
            color="gray.700"
            separator={
              <Icon as={FontAwesomeIcon} icon={faAngleRight} color="gray.400" />
            }
          >
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => setSubmissionView(null)}>
                {projectTitle}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{title}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Link
            as="a"
            href="https://discussion.openmined.org"
            target="_blank"
            rel="noopener noreferrer"
            color="gray.600"
            _hover={{ color: 'gray.800' }}
          >
            <Flex align="center">
              {/* SEE TODO (#3) */}
              <Icon as={FontAwesomeIcon} icon={faCommentAlt} mr={2} />
              <Text>Get Help</Text>
            </Flex>
          </Link>
        </Flex>
        <Grid templateColumns="repeat(12, 1fr)" mt={8}>
          <GridItem colSpan={1}>
            <Circle bg="gray.800" color="white" fontWeight="bold" size={8}>
              {number}
            </Circle>
          </GridItem>
          <GridItem colSpan={10}>
            <Heading as="h1" size="xl" mt={-1} mb={4}>
              {title}
            </Heading>
            <Flex justify="space-between" align="center" mb={8}>
              <SimpleGrid columns={3} spacing={2} flex={1}>
                {submissions.map(({ status }, index) => {
                  const props = {};

                  if (status === 'passed') props.bg = 'green.500';
                  else if (status === 'failed') props.bg = 'magenta.500';
                  else if (status === 'pending') props.bg = 'gray.500';
                  else if (status === 'none') props.bg = 'gray.400';

                  return (
                    <Box
                      key={index}
                      borderRadius="md"
                      width="full"
                      height={1}
                      {...props}
                    />
                  );
                })}
              </SimpleGrid>
              <Text fontSize="sm" fontStyle="italic" color="gray.700" ml={4}>
                {submissions.filter(({ status }) => status !== 'none').length ||
                  0}{' '}
                of {PROJECT_PART_SUBMISSIONS} attempts
              </Text>
            </Flex>
            {onlyFailedOrPassedSubmissions.length > 0 && (
              <Box mb={6}>
                {onlyFailedOrPassedSubmissions.map((submission, index) => (
                  <SubmissionInline
                    key={index}
                    part={_key}
                    index={index}
                    {...submission}
                    setSubmissionView={setSubmissionView}
                    setSubmissionViewAttempt={setSubmissionViewAttempt}
                  />
                ))}
              </Box>
            )}
            {reviewData && (
              <Box mb={6}>
                <Flex align="center" mb={3} color="gray.700">
                  <Text>
                    Submitted{' '}
                    {dayjs(attemptData.submitted_at.toDate()).fromNow()}
                  </Text>
                  <Text mx={4}>|</Text>
                  <Text>
                    Reviewed {dayjs(reviewData.reviewed_at.toDate()).fromNow()}
                  </Text>
                </Flex>
                <ReviewStatus status={reviewData.status} />
              </Box>
            )}
            <Tabs isFitted mb={8}>
              <TabList>
                <Tab {...tabProps}>1. Instructions</Tab>
                <Tab {...tabProps}>2. Rubric</Tab>
                <Tab {...tabProps}>3. Submission</Tab>
                {reviewData && <Tab {...tabProps}>4. Feedback</Tab>}
              </TabList>
              <TabPanels
                bg="white"
                border="1px solid"
                borderColor="gray.300"
                borderBottomRadius="md"
              >
                <TabPanel px={24} py={16}>
                  <Heading as="p" mb={2} size="lg">
                    Instructions
                  </Heading>
                  <Divider />
                  <Content content={part.instructions} />
                </TabPanel>
                <TabPanel px={24} py={16}>
                  <Heading as="p" mb={2} size="lg">
                    Rubric
                  </Heading>
                  <Divider />
                  <Content content={part.rubric} />
                </TabPanel>
                <TabPanel p={0} minHeight={400}>
                  {!attemptData && <RichTextEditor />}
                  {attemptData && (
                    <Box px={24} py={16}>
                      <Heading as="p" mb={2} size="lg">
                        Submission
                      </Heading>
                      <Divider />
                      <RichTextEditor
                        mt={8}
                        content={JSON.parse(attemptData.content)}
                        readOnly
                      />
                    </Box>
                  )}
                </TabPanel>
                {reviewData && (
                  <TabPanel px={24} py={16}>
                    <Heading as="p" mb={2} size="lg">
                      Feedback
                    </Heading>
                    <Divider />
                    <RichTextEditor
                      mt={8}
                      content={JSON.parse(reviewData.content)}
                      readOnly
                    />
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
            <Flex justify="space-between" align="center">
              <Button
                onClick={() => {
                  setSubmissionView(null);
                  setSubmissionViewAttempt(null);
                }}
                variant="outline"
                colorScheme="black"
              >
                Back to Project
              </Button>
              {!attemptData && (
                <Button
                  onClick={() => {
                    // Submit the attempt with the _key of the part and the content of the editor
                    onAttemptSubmission(
                      _key,
                      localStorage.getItem(EDITOR_STORAGE_STRING)
                    );

                    // And clear the editor's cache
                    localStorage.removeItem(EDITOR_STORAGE_STRING);
                  }}
                  colorScheme="black"
                >
                  Submit
                </Button>
              )}
            </Flex>
          </GridItem>
        </Grid>
      </GridContainer>
    </Box>
  );
};
