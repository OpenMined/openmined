import React from 'react';
import { Box, Text, Flex, Heading, Progress, Divider } from '@chakra-ui/react';
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

export default ({ content, ...props }) => {
  const { title, slug, level, length, lessons, project, progress } = content;

  const stats = getCourseProgress(progress, lessons, project.parts);
  const percentComplete =
    ((stats.completedConcepts + stats.completedProjectParts) /
      (stats.concepts + stats.projectParts)) *
    100;

  const nextAvailablePage = getNextAvailablePage(progress, lessons);
  let resumeLink = `/courses/${slug}/${nextAvailablePage.lesson}`;

  if (nextAvailablePage.concept) {
    resumeLink = `${resumeLink}/${nextAvailablePage.concept}`;
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
            {title}
          </Heading>
          <Text color="cyan.700" fontFamily="mono">
            {percentComplete.toFixed(1)}%
          </Text>
        </Flex>
        <Flex align="center" fontFamily="mono" color="gray.700" mb={3}>
          <Text>{level}</Text>
          <Divider orientation="vertical" height={4} mx={4} />
          <Text>{length}</Text>
        </Flex>
        <Box bg="cyan.50" p={4} borderRadius="md" mb={4}>
          {lessons.map((l, i) => {
            const iconProps = hasCompletedLesson(progress, l._id)
              ? {
                  icon: faCheckCircle,
                }
              : {
                  icon: faArrowRight,
                  color: 'gray.600',
                };

            return (
              <Flex align="center" mt={i === 0 ? 0 : 2} key={i}>
                <Icon {...iconProps} mr={3} boxSize={5} />
                <Text color="gray.700">{l.title}</Text>
              </Flex>
            );
          })}
          <Flex align="center" mt={2}>
            <Icon icon={faShapes} mr={3} color="gray.600" boxSize={5} />
            <Text color="gray.700">{project.title}</Text>
          </Flex>
        </Box>
        <Flex justify="flex-end">
          <Link to={resumeLink}>
            <Flex align="center">
              <Text fontWeight="bold" mr={3}>
                Resume
              </Text>
              <Icon icon={faArrowRight} />
            </Flex>
          </Link>
        </Flex>
      </Box>
      <Progress colorScheme="cyan" value={percentComplete} />
    </Box>
  );
};
