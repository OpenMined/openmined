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
  Link,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faCommentAlt } from '@fortawesome/free-solid-svg-icons';

import { PROJECT_PART_SUBMISSIONS } from '../_helpers';
import { Content } from '../concept/content';
import GridContainer from '../../../components/GridContainer';
import RichTextEditor, {
  EDITOR_STORAGE_STRING,
} from '../../../components/RichTextEditor';

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

  // If we have a submission still pending a review
  const hasSubmissionPending =
    submissions.length > 0 &&
    !!submissions.filter(({ status }) => status === 'pending');

  return (
    <Box bg="gray.50">
      <GridContainer isInitial pt={[8, null, null, 16]} pb={16}>
        <Flex justify="space-between" align="center">
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
            <Tabs isFitted mb={8}>
              <TabList>
                <Tab {...tabProps}>1. Instructions</Tab>
                <Tab {...tabProps}>2. Rubric</Tab>
                <Tab {...tabProps}>3. Submission</Tab>
                {submissionViewAttempt && <Tab {...tabProps}>4. Feedback</Tab>}
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
                  {!hasSubmissionPending && <RichTextEditor />}
                  {/* TODO: Patrick, add the last known submission here */}
                </TabPanel>
                {submissionViewAttempt && (
                  <TabPanel px={24} py={16}>
                    <p>four!</p>
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
            </Flex>
          </GridItem>
        </Grid>
      </GridContainer>
    </Box>
  );
};
