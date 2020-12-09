import React from 'react';
import { Box, Flex, Icon, Text } from '@chakra-ui/core';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default ({ title, value }) => (
  <Flex align="center" mb={4}>
    <Icon as={FontAwesomeIcon} icon={faCheckCircle} size="2x" />
    <Box ml={4}>
      <Text fontWeight="bold">{title}</Text>
      <Text color="gray.700">{value}</Text>
    </Box>
  </Flex>
);
