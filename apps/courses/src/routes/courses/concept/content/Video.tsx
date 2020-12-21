import React from 'react';
import { Flex, AspectRatio, Box } from '@chakra-ui/react';

// SEE TODO #12

export default ({ video, spacing = 0 }: any) => (
  <Flex justify="center" my={spacing}>
    <AspectRatio width="100%" ratio={16 / 9}>
      <Box
        as="iframe"
        title="OpenMined Courses"
        src={`https://www.youtube.com/embed/${video}?modestbranding=1&rel=0`}
        allowFullScreen
      />
    </AspectRatio>
  </Flex>
);
