import React from 'react';
import { Box, Text, Flex, Image, Heading } from '@chakra-ui/core';
import { Link } from 'react-router-dom';

import theme from '../theme';

export default ({ content, onClick, ...props }) => {
  const { title, visual, cost, level, length, slug } = content;
  return (
    <Flex
      role="group"
      as={Link}
      to={`/courses/${slug}`}
      onClick={onClick}
      direction="column"
      justify="space-between"
      transitionProperty="transform filter"
      transitionDuration="slow"
      transitionTimingFunction="ease-in-out"
      cursor="pointer"
      bg="gray.800"
      position="relative"
      overflow="hidden"
      borderRadius="md"
      boxShadow="lg"
      {...props}
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        zIndex={-1}
        transitionProperty="opacity"
        transitionDuration="slow"
        transitionTimingFunction="ease-in-out"
        opacity={0}
        _groupHover={{ opacity: 1 }}
        bg={`linear-gradient(to right, ${theme.colors.black}, ${theme.colors.gray[700]})`}
      />
      <Flex p={6} direction="column" justifyContent="space-between" flex={1}>
        <Box>
          <Text fontFamily="mono" color="gray.400" textAlign="right" mb={2}>
            {cost.toUpperCase()}
          </Text>
          <Heading as="h3" size="lg" mb={8}>
            {title}
          </Heading>
        </Box>
        <Box>
          <Box
            width="200px"
            height="200px"
            borderRadius="full"
            mx="auto"
            mb={8}
            position="relative"
          >
            <Image
              src={visual.default}
              alt={title}
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              transitionProperty="opacity"
              transitionDuration="slow"
              transitionTimingFunction="ease-in-out"
              _groupHover={{
                opacity: 0,
              }}
            />
            <Image
              src={visual.full}
              alt={title}
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              transitionProperty="opacity"
              transitionDuration="slow"
              transitionTimingFunction="ease-in-out"
              opacity={0}
              _groupHover={{ opacity: 1 }}
            />
          </Box>
          <Flex justify="space-between">
            <Text fontFamily="mono" color="gray.400">
              {level}
            </Text>
            <Text fontFamily="mono" color="gray.400">
              {length}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};
