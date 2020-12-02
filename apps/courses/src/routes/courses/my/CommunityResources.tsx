import React from 'react';
import { Box, Link, SimpleGrid, Text } from '@chakra-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import theme from '../../../theme';

export default ({ resources }) => {
  const headingStyle = {
    content: '""',
    flex: '1 1',
    borderBottom: `2px solid ${theme.colors.gray[500]}`,
    margin: 'auto',
  };
  return (
    <Box>
      <Text
        display="flex"
        flexDirection="row"
        _after={headingStyle}
        _before={headingStyle}
      >
        <Text color="gray.500" fontWeight="bold" fontSize="xl" px={4}>
          Community Resources
        </Text>
      </Text>
      <SimpleGrid
        pt={8}
        columns={[1, 1, 2, 2]}
        spacing={8}
        justifyContent="center"
      >
        {resources.map((resource, index) => (
          <Box textAlign="center" maxW="350px" mx="auto" my={8}>
            <FontAwesomeIcon
              style={{ transform: 'scale(2)', color: theme.colors.pink[700] }}
              icon={resource.icon}
            />
            <Text fontSize="xl" fontWeight="bold" mt={4}>
              {resource.title}
            </Text>
            <Text my={4}>{resource.description}</Text>
            <Link
              color="gray.800"
              textDecoration="underline"
              href={resource.link}
            >
              {resource.linkText}
            </Link>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};
