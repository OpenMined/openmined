import React from 'react';
import { Icon } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ChakraIcon = ({icon, ...iconProps}) => {
  return (
    <div>
      <ChakraIcon icon={icon} {...iconProps} />
    </div>
  )
}

export default ChakraIcon
