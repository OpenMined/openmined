import React from 'react';
import { Icon } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ChakraIcon = ({icon, ...iconProps}) => {
  return (
    <Icon icon={icon} as={FontAwesomeIcon} {...iconProps} />
  )
}

export default ChakraIcon
