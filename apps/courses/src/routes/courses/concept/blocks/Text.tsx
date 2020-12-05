import React from 'react';
import { Box } from '@chakra-ui/core';
import { RichText } from '@openmined/shared/data-access-sanity';

export default ({ richText, spacing }) => (
  <Box my={spacing}>
    <RichText content={richText} />
  </Box>
);
