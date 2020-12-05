import React from 'react';
import { Flex, AspectRatio, Box } from '@chakra-ui/core';

// TODO: Consider doing a skinned version of the video player (including in the Hero on the homepage)

export default ({ video, spacing }) => (
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
