import React from 'react';
import { Icon, Flex } from '@chakra-ui/react';

const IconWrapper = ({
  boxSize = 4,
  color = 'currentColor',
  icon,
  ...props
}) => (
  <Flex {...props} boxSize={boxSize} justify="center" align="center">
    <Icon
      viewBox={`0 0 ${icon.icon[0]} ${icon.icon[1]}`}
      w="full"
      h="full"
      color={color}
    >
      <path d={icon.icon[4]} fill="currentColor" />
    </Icon>
  </Flex>
);

export default IconWrapper;
