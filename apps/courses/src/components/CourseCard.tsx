import React, { useState } from 'react';
import { Box, Text, Flex, Image, Heading } from '@chakra-ui/core';

import theme from '../theme';

export default ({
  title,
  visual,
  cost,
  level,
  length,
  setIsHovered,
  isHovered,
  index,
  onClick,
}) => {
  const iAmHovered = isHovered === index;

  return (
    <Flex
      onClick={onClick}
      direction="column"
      justify="space-between"
      transform={
        iAmHovered ? 'scale(1.05)' : isHovered ? 'scale(0.95)' : 'none'
      }
      style={{
        filter:
          !isHovered || (isHovered && !iAmHovered) ? 'grayscale(1)' : 'none',
      }}
      transitionProperty="transform filter"
      transitionDuration="slow"
      transitionTimingFunction="ease-in-out"
      cursor="pointer"
      bg="gray.800"
      position="relative"
      overflow="hidden"
      borderRadius="md"
      boxShadow="lg"
      onMouseEnter={() => setIsHovered(index)}
      onMouseLeave={() => setIsHovered(null)}
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
        opacity={iAmHovered ? 1 : 0}
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
              opacity={iAmHovered ? 0 : 1}
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
              opacity={iAmHovered ? 1 : 0}
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
