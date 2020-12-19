import React from 'react';
import { Box, Button, Icon, SimpleGrid, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faSlack } from '@fortawesome/free-brands-svg-icons';
import {
  faCommentAlt,
  faPencilAlt,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

import ProjectAccordion from '../../courses/project/ProjectAccordion';
import { hasCompletedCourse } from '../../courses/_helpers';
import CourseProgressCard from '../../../components/CourseProgressCard';
import ColoredTabs from '../../../components/ColoredTabs';

export const StudentContext = ({ courses, progress }) => {
  let incompleteCourses = progress.filter((c) => !hasCompletedCourse(c));

  if (incompleteCourses.length > 0) {
    incompleteCourses = incompleteCourses.map(({ uid, ...p }) => {
      const courseIndex = courses.findIndex(({ slug }) => uid === slug);

      if (courseIndex !== -1) return { progress: p, ...courses[courseIndex] };

      return p;
    });
  }

  if (incompleteCourses.length === 0) {
    return (
      <Box>
        <Text color="gray.700" mb={4}>
          Currently, you're not taking any courses. Perhaps you should add one!
        </Text>
        <Button as={Link} to="/courses" variant="outline" colorScheme="black">
          <Icon as={FontAwesomeIcon} icon={faSearch} mr={3} />
          <Text>Browse Courses</Text>
        </Button>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={1} spacing={4} width="full">
      {incompleteCourses.map((c) => (
        <CourseProgressCard key={c.title} content={c} />
      ))}
    </SimpleGrid>
  );
};

export const StudentTabs = ({ courses, progress }) => {
  const MyProjects = () => {
    return <div>Projects</div>;
    // return <ProjectAccordion
    //   content={content}
    //   setSubmissionView={setSubmissionView}
    //   setSubmissionViewAttempt={setSubmissionViewAttempt}
    //   onBeginProjectPart={onBeginProjectPart}
    // />;
  };

  const CourseHistory = () => {
    return <div>History</div>;
  };

  return (
    <ColoredTabs
      content={[
        {
          title: 'My Projects',
          panel: MyProjects,
        },
        {
          title: 'Course History',
          panel: CourseHistory,
        },
      ]}
    />
  );
};

export const studentResources = [
  {
    title: 'Discussion Board',
    icon: faCommentAlt,
    link: 'https://discussion.openmined.org',
  },
  {
    title: 'Slack',
    icon: faSlack,
    link: 'https://slack.openmined.org',
  },
  {
    title: 'Github',
    icon: faGithub,
    link: 'https://github.com/OpenMined',
  },
  {
    title: 'Blog',
    icon: faPencilAlt,
    link: 'https://blog.openmined.org',
  },
];
