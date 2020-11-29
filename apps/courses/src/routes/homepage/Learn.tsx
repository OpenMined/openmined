import React, { useState } from 'react';
import { Box, Heading, Text, SimpleGrid } from '@chakra-ui/core';
import { useSanity } from '@openmined/shared/data-access-sanity';

import { coursesProjection } from '../../helpers';
import GridContainer from '../../components/GridContainer';
import Course from '../../components/CourseCard';

export default ({ title, description }) => {
  const { data, loading } = useSanity(
    `*[_type == "course"] ${coursesProjection}`
  );

  const order = [
    'Privacy and Society',
    'Foundations of Private Computation',
    'Federated Learning Across Enterprises',
    'Federated Learning on Mobile',
  ];
  const courses = data
    ? data.sort((a, b) => order.indexOf(a.title) - order.indexOf(b.title))
    : null;

  const [isHovered, setIsHovered] = useState(null);

  return (
    <Box bg="gray.900" color="white" py={[16, null, null, 32]}>
      <GridContainer>
        <Heading as="h2" size="2xl" mb={4}>
          {title}
        </Heading>
        <Text
          color="gray.400"
          fontSize="lg"
          width={{ md: '60%', xl: '40%' }}
          mb={12}
        >
          {description}
        </Text>
        <SimpleGrid columns={[1, null, 2, null, 4]} spacing={[4, null, 6]}>
          {!loading &&
            courses &&
            courses.map((course, i) => (
              <Course
                key={i}
                content={course}
                onMouseEnter={() => setIsHovered(i)}
                onMouseLeave={() => setIsHovered(null)}
                transform={
                  isHovered === i
                    ? 'scale(1.05)'
                    : isHovered !== null
                    ? 'scale(0.95)'
                    : 'none'
                }
                style={{
                  filter:
                    isHovered === null || (isHovered && !(isHovered === i))
                      ? 'grayscale(1)'
                      : 'none',
                }}
                onClick={console.log}
              />
            ))}
        </SimpleGrid>
      </GridContainer>
    </Box>
  );
};
