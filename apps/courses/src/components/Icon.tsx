import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/*
 * This component is to be used when you are passing a FontAwesome icon
 * to the Chakra UI Icon component. In the use cases, you will notice one
 * particularity: there are boxSize and size to each component (when needed).
 * This is the case because all FontAwesome icons, by default, come with a
 * fa-w-16 class that limits the width of the icon to 16px. The best use case,
 * in my opinion, so we don't end up writing and maintaining a dictionary
 * matching the list of sizes from FontAwesome to Chakra sizes is to allow the
 * components to have both `boxSize` and `size` props. `boxSize` will rule the
 * Chakra side of the Icon, setting the height, while `size` will correctly
 * scale the icon. The Chakra size should always "win" if you map it right.
 */
const IconWrapper = (props: IconProps) => (
  <Icon as={FontAwesomeIcon} {...props} />
);

export default IconWrapper;
