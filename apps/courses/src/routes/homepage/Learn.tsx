import React, { useState } from 'react';
import { Box, Heading, Text, Flex, Image, SimpleGrid } from '@chakra-ui/core';
import { Link } from 'react-router-dom';
import { useSanity } from '@openmined/shared/data-access-sanity';

import theme from '../../theme';
import { coursesProjection } from '../../helpers';
import GridContainer from '../../components/GridContainer';

const Course = ({
  title,
  slug,
  visual,
  cost,
  level,
  length,
  setIsHovered,
  isHovered,
  index,
  onClick,
}) => {
  const iAmHovered = isHovered === index;

  return (
    <Flex
      as={Link}
      to={`/courses/${slug}`}
      onClick={onClick}
      direction="column"
      justify="space-between"
      transform={
        iAmHovered ? 'scale(1.05)' : isHovered ? 'scale(0.95)' : 'none'
      }
      style={{
        filter:
          !isHovered || (isHovered && !iAmHovered) ? 'grayscale(1)' : 'none',
      }}
      transitionProperty="transform filter"
      transitionDuration="slow"
      transitionTimingFunction="ease-in-out"
      cursor="pointer"
      bg="gray.800"
      position="relative"
      overflow="hidden"
      borderRadius="md"
      boxShadow="lg"
      onMouseEnter={() => setIsHovered(index)}
      onMouseLeave={() => setIsHovered(null)}
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        zIndex={-1}
        transitionProperty="opacity"
        transitionDuration="slow"
        transitionTimingFunction="ease-in-out"
        opacity={iAmHovered ? 1 : 0}
        bg={`linear-gradient(to right, ${theme.colors.black}, ${theme.colors.gray[700]})`}
      />
      <Flex p={6} direction="column" justifyContent="space-between" flex={1}>
        <Box>
          <Text fontFamily="mono" color="gray.400" textAlign="right" mb={2}>
            {cost.toUpperCase()}
          </Text>
          <Heading as="h3" size="lg" mb={8}>
            {title}
          </Heading>
        </Box>
        <Box>
          <Box
            width="200px"
            height="200px"
            borderRadius="full"
            mx="auto"
            mb={8}
            position="relative"
          >
            <Image
              src={visual.default}
              alt={title}
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              transitionProperty="opacity"
              transitionDuration="slow"
              transitionTimingFunction="ease-in-out"
              opacity={iAmHovered ? 0 : 1}
            />
            <Image
              src={visual.full}
              alt={title}
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              transitionProperty="opacity"
              transitionDuration="slow"
              transitionTimingFunction="ease-in-out"
              opacity={iAmHovered ? 1 : 0}
            />
          </Box>
          <Flex justify="space-between">
            <Text fontFamily="mono" color="gray.400">
              {level}
            </Text>
            <Text fontFamily="mono" color="gray.400">
              {length}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};

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
                {...course}
                setIsHovered={setIsHovered}
                isHovered={isHovered}
                index={i + 1}
              />
            ))}
        </SimpleGrid>
      </GridContainer>
    </Box>
  );
};
