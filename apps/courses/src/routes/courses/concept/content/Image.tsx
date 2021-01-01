import React from 'react';
import { Flex, Image } from '@chakra-ui/react';
import { composeSanityImageUrl } from '@openmined/shared/data-access-sanity';

export default (image, spacing) => {
  return (
    <Flex justify="center" my={spacing}>
      <Image src={composeSanityImageUrl(image)} maxW={600} />
    </Flex>
  );
};
