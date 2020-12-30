import React from 'react';
import { Icon, Box } from '@chakra-ui/react';

export default ({ boxSize = 4, color = 'currentColor', icon, ...props }) => (
  <Box
    display="inline-flex"
    boxSize={boxSize}
    justifyContent="center"
    alignItems="center"
    {...props}
  >
    <Icon
      viewBox={`0 0 ${icon.icon[0]} ${icon.icon[1]}`}
      w="full"
      h="full"
      color={color}
    >
      <path d={icon.icon[4]} fill="currentColor" />
    </Icon>
  </Box>
);
