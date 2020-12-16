import React from 'react';
import { Box, Heading, Text, SimpleGrid, Link } from '@chakra-ui/react';

import GridContainer from './GridContainer';

import { features, resources } from '../content/features-or-resources';

const Feature = ({ title, description, icon, link }) => (
  <Box>
    {typeof icon === 'string' && (
      <Box
        width={20}
        height={20}
        bgImage={`url(${icon})`}
        bgRepeat="no-repeat"
        bgSize="contain"
      />
    )}
    {typeof icon !== 'string' && icon}
    <Heading as="h3" size="md" mt={4} mb={2}>
      {title}
    </Heading>
    <Text color="gray.700">{description}</Text>
    {link && (
      <Link
        as="a"
        href={link.link}
        color="gray.700"
        _hover={{ color: 'gray.800' }}
        fontWeight="bold"
        textDecoration="underline"
        display="block"
        mt={4}
      >
        {link.title}
      </Link>
    )}
  </Box>
);

export default ({ which }) => {
  const { title, icon, list }: { title: string; icon: string; list: any[] } =
    which === 'features' ? features : resources;

  return (
    <GridContainer bg="gray.200">
      <SimpleGrid
        columns={[1, null, null, null, 2]}
        spacing={8}
        px={[0, null, 8, 16]}
        py={16}
      >
        <Box alignSelf="flex-end" mr={8}>
          <Box
            width={20}
            height={20}
            bgImage={`url(${icon})`}
            bgRepeat="no-repeat"
            bgSize="contain"
            display={['none', null, null, 'block']}
            mb={4}
          />
          <Heading as="h2" size="xl">
            {title}
          </Heading>
        </Box>
        <SimpleGrid columns={[1, null, 2]} spacing={[8, null, null, 16]}>
          {list.map((item, i) => (
            <Feature key={i} {...item} />
          ))}
        </SimpleGrid>
      </SimpleGrid>
    </GridContainer>
  );
};
