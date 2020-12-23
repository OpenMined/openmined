import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IconWrapper = (props: IconProps) => (
  <Icon as={FontAwesomeIcon} {...props} />
);

export default IconWrapper;
