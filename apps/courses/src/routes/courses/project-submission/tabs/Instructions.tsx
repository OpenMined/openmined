import React from 'react';

import { Divider, Heading } from '@chakra-ui/react';
import { Content } from '../../concept/content';

export default ({ content }) => (
  <>
    <Heading as="p" mb={2} size="lg">
      Instructions
    </Heading>
    <Divider />
    <Content content={content.instructions} />
  </>
);
