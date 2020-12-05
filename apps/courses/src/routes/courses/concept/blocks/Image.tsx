import React from 'react';
import { Flex, Image } from '@chakra-ui/core';
import { useSanityImage } from '@openmined/shared/data-access-sanity';

export default (image, spacing) => {
  const img = useSanityImage(image);

  return (
    <Flex justify="center" my={spacing}>
      <Image src={img.url()} maxW={600} />
    </Flex>
  );
};
