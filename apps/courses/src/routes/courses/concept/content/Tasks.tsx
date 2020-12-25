import React from 'react';
import { Flex, Stack, Text, Checkbox } from '@chakra-ui/react';

export default ({ tasks, spacing }: any) => (
  <Flex justify="center" my={spacing}>
    <Stack spacing={4}>
      {tasks.map((t, i) => (
        <Checkbox
          key={i}
          spacing={4}
          colorScheme="magenta"
          alignItems="baseline"
        >
          <Flex>
            <Text mr={4}>{i + 1}.</Text>
            <Text>{t}</Text>
          </Flex>
        </Checkbox>
      ))}
    </Stack>
  </Flex>
);
