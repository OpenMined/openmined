import React, { useRef, useEffect } from 'react';
import { Flex, Text } from '@chakra-ui/react';
declare const katex: any;

export default ({ math, spacing }: any) => {
  const ref = useRef(null);

  useEffect(() => {
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
