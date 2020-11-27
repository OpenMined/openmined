import React from 'react';
import { Circle, Box } from '@chakra-ui/core';

const CircledNumber = ({ active = false, text, ...props }) => (
  <Circle
    {...props}
    backgroundColor={active ? 'gray.800' : props.backgroundColor}
    borderColor={active ? 'gray.800' : props.borderColor}
    color={active ? 'gray.50' : props.color}
  >
    <Box as="span" fontFamily="heading" fontWeight="500" fontSize="lg">
      {text}
    </Box>
  </Circle>
);

export default CircledNumber;
