import React from 'react';
import { Box, Heading, Text, SimpleGrid } from '@chakra-ui/core';

import GridContainer from '../../components/GridContainer';

const Feature = ({ title, description, icon }) => (
  <Box>
    <Box
      width={20}
      height={20}
      bgImage={`url(${icon})`}
      bgRepeat="no-repeat"
      bgSize="contain"
      mb={4}
    />
    <Heading as="h3" size="md" mb={2}>
      {title}
    </Heading>
    <Text color="gray.700">{description}</Text>
  </Box>
);

export default ({ title, icon, list }) => (
  <GridContainer bg="gray.200">
    <SimpleGrid
      columns={[1, null, null, null, 2]}
      spacing={8}
      px={[0, null, 8, 16]}
      py={16}
    >
      <Box alignSelf="flex-end" mr={8}>
        <Box
          width={20}
          height={20}
          bgImage={`url(${icon})`}
          bgRepeat="no-repeat"
          bgSize="contain"
          display={['none', null, null, 'block']}
          mb={4}
        />
        <Heading as="h2" size="xl">
          {title}
        </Heading>
      </Box>
      <SimpleGrid columns={[1, null, 2]} spacing={[8, null, null, 16]}>
        {list.map((item, i) => (
          <Feature key={i} {...item} />
        ))}
      </SimpleGrid>
    </SimpleGrid>
  </GridContainer>
);
