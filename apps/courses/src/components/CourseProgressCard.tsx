import React from 'react';
import {
  Badge,
  Box,
  Text,
  Flex,
  Heading,
  Progress,
  Divider,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {
  faArrowRight,
  faCheckCircle,
  faShapes,
} from '@fortawesome/free-solid-svg-icons';
import {
  getCourseProgress,
  getNextAvailablePage,
  hasCompletedLesson,
} from '../routes/courses/_helpers';
import Icon from '../components/Icon';
import dayjs from 'dayjs';

export default ({ content, ...props }) => {
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
  const percentComplete =
    ((stats.completedConcepts + stats.completedProjectParts) /
      (stats.concepts + stats.projectParts)) *
    100;

  const nextAvailablePage = getNextAvailablePage(progress, lessons);
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
      boxShadow="lg"
      overflow="hidden"
      {...props}
    >
      <Box p={6}>
        <Flex justify="space-between" align="center" mb={2}>
          <Heading as="h3" size="md">
            <a href={`/courses/${slug}`} target="_self">
              {title}
            </a>
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
          {lessons.map((l, i) => {
            const shouldShowNextBadge =
              i > 0 && lessons[i - 1].concepts?.length > 0 && !l.concepts;

            const iconProps = hasCompletedLesson(progress, l._id)
              ? {
                  icon: faCheckCircle,
                }
              : {
                  icon: faArrowRight,
                  color: 'gray.600',
                };

            return (
              <Flex
                align="center"
                mt={i === 0 ? 0 : 2}
                key={i}
                justifyContent="space-between"
              >
                <Flex>
                  <Icon {...iconProps} mr={3} boxSize={5} />
                  <Text color="gray.700">{l.title}</Text>
                </Flex>
                {shouldShowNextBadge && (
                  <Badge color="white" bgColor="blue.700" justifySelf="end">
                    Next
                  </Badge>
                )}
              </Flex>
            );
          })}
          {project?.title && (
            <Flex align="center" mt={2} justifyContent="space-between">
              <Flex>
                <Icon icon={faShapes} mr={3} color="gray.600" boxSize={5} />
                <Text color="gray.700">{project.title}</Text>
              </Flex>
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
            <Link to={resumeLink}>
              <Flex align="center">
                <Text fontWeight="bold" mr={3}>
                  Resume
                </Text>
                <Icon icon={faArrowRight} />
              </Flex>
            </Link>
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
