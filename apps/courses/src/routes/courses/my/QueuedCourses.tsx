import React from 'react';
import { Box, Text, SimpleGrid, Button } from '@chakra-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import CourseCard from '../../../components/CourseCard';
import theme from '../../../theme';

export default ({ queuedCourses, ...rest }) => {
  return (
    <Box {...rest}>
      <Text fontWeight="bold" fontSize="xl" py={8}>
        Courses in the queue
      </Text>
      <SimpleGrid pb={8} color="white" columns={[1, 1, 2, 3]} spacing={2}>
        {queuedCourses.map((course, i) => (
          <CourseCard key={i} content={course} />
        ))}
      </SimpleGrid>
      <Button
        colorScheme="gray.800"
        _hover={{
          color: 'white',
          backgroundColor: theme.colors.gray[800],
        }}
        variant="outline"
      >
        <FontAwesomeIcon icon={faPlus} />
        <Text pl={4} as="span">
          Add Course
        </Text>
      </Button>
    </Box>
  );
};
