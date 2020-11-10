import React from 'react';
import { Box, Heading, Text, SimpleGrid } from '@chakra-ui/core';

import GridContainer from '../../components/GridContainer';
import Signup from '../../components/forms/SignUp';

export default ({ title, description }) => (
  <GridContainer py={[16, null, null, 32]}>
    <SimpleGrid columns={[1, null, null, 2]} spacing={[4, null, 8]}>
      <Box alignSelf="center" mr={8}>
        <Heading as="h2" size="2xl" mb={4}>
          {title}
        </Heading>
        <Text color="gray.700" fontSize="lg">
          {description}
        </Text>
      </Box>
      <Signup />
    </SimpleGrid>
  </GridContainer>
);
