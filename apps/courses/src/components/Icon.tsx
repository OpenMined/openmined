import React from 'react';
import { Icon } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default ({icon, ...iconProps}) => {
  return (
    <Icon icon={icon} as={FontAwesomeIcon} {...iconProps} />
  )
}
