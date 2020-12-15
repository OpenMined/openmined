import React from 'react';
import { Box, Text, Flex, Image, Heading, ChakraProps } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import theme from '../theme';

export default ({ content, ...props }) => {
  const { title, visual, cost, level, length, slug } = content;

  const absoluteOpacityStyles: ChakraProps = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transitionProperty: 'opacity',
    transitionDuration: 'slow',
    transitionTimingFunction: 'ease-in-out',
  };

  return (
    <Flex
      role="group"
      as={Link}
      to={`/courses/${slug}`}
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
        {...absoluteOpacityStyles}
        zIndex={-1}
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
              {...absoluteOpacityStyles}
              src={visual.default}
              alt={title}
              _groupHover={{ opacity: 0 }}
            />
            <Image
              {...absoluteOpacityStyles}
              src={visual.full}
              alt={title}
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
