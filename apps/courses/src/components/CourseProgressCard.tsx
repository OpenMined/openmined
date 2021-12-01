import React from 'react';
import {
  Badge,
  Box,
  Text,
  Flex,
  Heading,
  Progress,
  Divider,
  Link,
} from '@chakra-ui/react';
import { Link as RRDLink } from 'react-router-dom';
import {
  faArrowRight,
  faCheckCircle,
  faShapes,
} from '@fortawesome/free-solid-svg-icons';
import {
  getCourseProgress,
  getNextAvailablePage,
  hasCompletedLesson,
  getLastCompletedAndInProgressConcepts,
} from '../routes/courses/_helpers';
import Icon from '../components/Icon';
import dayjs from 'dayjs';

export default ({ content, isMentor, ...props }) => {
  const {
    title,
    slug,
    level,
    length,
    lessons,
    project,
    progress,
    simulcast,
    simulcast_release_date,
  } = content;
  const stats = getCourseProgress(progress, lessons, project?.parts);

  let percentComplete =
    ((stats.completedConcepts + stats.completedProjectParts) /
      (stats.concepts + stats.projectParts)) *
    100;

  // don't require project completion values for mentors
  if (isMentor) {
    percentComplete = (stats.completedConcepts / stats.concepts) * 100;
  }

  const nextAvailablePage = getNextAvailablePage(progress, lessons);
  const { completedConcepts, inProgressConcepts } = getLastCompletedAndInProgressConcepts(progress, lessons, 2, 1)
  let resumeLink = `/courses/${slug}/${nextAvailablePage.lesson}`;

  if (nextAvailablePage.concept) {
    resumeLink = `${resumeLink}/${nextAvailablePage.concept}`;
  }

  if (simulcast && percentComplete === 100) {
    resumeLink = null;
  }

  return (
    <Box
      width="full"
      borderRadius="md"
      boxShadow="2xl"
      overflow="hidden"
      border="1px solid"
      borderColor="gray.200"
      {...props}
    >
      <Box p={6}>
        <Flex justify="space-between" align="center" mb={2}>
          <Heading as="h3" size="md">
            <Link
              as={RRDLink}
              to={`/courses/${slug}`}
              textDecoration="none"
              color="gray.900"
              _hover={{ textDecoration: 'underline' }}
            >
              {title}
            </Link>
          </Heading>
          <Text color="blue.700" fontFamily="mono">
            {percentComplete.toFixed(1)}%
          </Text>
        </Flex>
        <Flex align="center" fontFamily="mono" color="gray.700" mb={3}>
          <Text>{level}</Text>
          <Divider orientation="vertical" height={4} mx={4} />
          <Text>{length}</Text>
        </Flex>
        <Box bg="blue.50" p={4} borderRadius="md" mb={4}>
          {completedConcepts.map((c, i) => {
            return (
              <Flex
                align="center"
                mt={i === 0 ? 0 : 3}
                key={i}
                justifyContent="space-between"
              >
                <Flex>
                  <Icon icon={faCheckCircle} mr={3} boxSize={5} />
                  <Text color="gray.700">{c.title}</Text>
                </Flex>
              </Flex>
            );
          })}
          {inProgressConcepts.map((c, i) => {
            return (
              <Flex
                align="center"
                mt={completedConcepts.length == 0 ? 0 : 2}
                key={i}
                justifyContent="space-between"
              >
                <Flex>
                  <Icon icon={faArrowRight} color="gray.600" mr={3} boxSize={5} />
                  <Text color="gray.700">{c.title}</Text>
                </Flex>
              </Flex>
            );
          })}
          {nextAvailablePage.lesson === 'project' && project?.title && (
            <Flex align="center" mt={2} justifyContent="space-between">
              <Link
                as={RRDLink}
                to={`/courses/${slug}/project`}
                textDecoration="none"
                _hover={{ textDecoration: 'underline' }}
              >
                <Flex>
                  <Icon icon={faShapes} mr={3} color="gray.600" boxSize={5} />
                  <Text color="gray.700">{project.title}</Text>
                </Flex>
              </Link>
              {simulcast &&
                !project.parts &&
                lessons[lessons.length - 1].concepts?.length > 0 && (
                  <Badge color="white" bgColor="blue.700" justifySelf="end">
                    Next
                  </Badge>
                )}
            </Flex>
          )}
        </Box>
        <Flex justify="flex-end">
          {resumeLink && (
            <RRDLink to={resumeLink}>
              <Flex align="center">
                <Text fontWeight="bold" mr={3}>
                  Resume
                </Text>
                <Icon icon={faArrowRight} />
              </Flex>
            </RRDLink>
          )}
          {!resumeLink && (
            <Flex align="center" color="GrayText">
              <Text fontWeight="bold" mr={3}>
                Coming{' '}
                {simulcast_release_date
                  ? dayjs(simulcast_release_date).fromNow()
                  : 'soon'}
              </Text>
            </Flex>
          )}
        </Flex>
      </Box>
      <Progress colorScheme="blue" value={percentComplete} />
    </Box>
  );
};
