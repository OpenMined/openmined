import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Text, Flex, Heading, Progress, Image } from '@chakra-ui/react';
import dayjs from 'dayjs';

export default ({ content, ...props }) => {
  const {
    title,
    slug,
    description,
    visual: { full },
    progress: { completed_at },
  } = content;

  return (
    <Box
      width="full"
      borderRadius="md"
      bg="gray.800"
      color="white"
      overflow="hidden"
      as={Link}
      to={`/courses/${slug}`}
      {...props}
    >
      <Flex p={6} align="center">
        <Box mr={6}>
          <Text color="cyan.300" mb={2}>
            {dayjs(completed_at.toDate()).format('MMMM D, YYYY')}
          </Text>
          <Heading as="h3" size="md" mb={2}>
            {title}
          </Heading>
          <Text color="gray.400" mb={6}>
            {description.substring(0, 80)}...
          </Text>
          <Text color="cyan.300" textTransform="uppercase" fontFamily="mono">
            Complete
          </Text>
        </Box>
        <Image src={full} alt={title} boxSize={48} />
      </Flex>
      <Progress colorScheme="cyan" value={100} />
    </Box>
  );
};
