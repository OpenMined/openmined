import React, { useRef, useEffect } from 'react';
import { Flex, Text } from '@chakra-ui/react';

export default ({ math, spacing }) => {
  const ref = useRef(null);

  useEffect(() => {
    // @ts-ignore We import this in the HTML file
    katex.render(String.raw`${math}`, ref.current, {
      throwOnError: false,
    });
  }, [math]);

  return (
    <Flex justify="center" my={spacing}>
      <Text ref={ref}>{math}</Text>
    </Flex>
  );
};
