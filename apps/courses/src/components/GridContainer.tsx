import React from 'react';
import { Box } from '@chakra-ui/core';

export default ({ children, isInitial = false, ...props }) => (
  <Box
    {...props}
    width={['100%', null, null, 960, 1200]}
    px={[5, null, null, 0]}
    mx="auto"
    mt={isInitial ? 'header' : 0}
  >
    {children}
  </Box>
);
