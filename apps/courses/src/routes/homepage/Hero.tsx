import React from 'react';
import {
  Flex,
  Heading,
  Text,
  AspectRatio,
  Box,
  Image,
  SimpleGrid,
} from '@chakra-ui/core';

import GridContainer from '../../components/GridContainer';
import waveform from '../../assets/waveform/waveform-rainbow.png';

export default ({ title, description, video, partners, partnersText }) => (
  <>
    <Box
      position="relative"
      pb={[12, null, 24, 40, 48]}
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        backgroundImage: `url(${waveform})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0% 100%',
        backgroundSize: 'contain',
      }}
    >
      <GridContainer isInitial>
        <Flex
          pt={[8, null, null, 12, 16]}
          direction="column"
          align="center"
          textAlign="center"
        >
          <Heading as="h1" size="hero" mb={[4, 6, 10]}>
            {title}
          </Heading>
          <Text
            color="gray.700"
            fontSize="xl"
            width={['90%', null, null, '70%', '50%']}
            mb={[4, 6, 10]}
          >
            {description}
          </Text>
          <AspectRatio width="100%" maxW="760px" ratio={16 / 9}>
            <Box
              as="iframe"
              title="OpenMined Courses"
              src={`https://www.youtube.com/embed/${video}?modestbranding=1&rel=0`}
              allowFullScreen
            />
          </AspectRatio>
        </Flex>
      </GridContainer>
    </Box>
    <GridContainer pt={4} pb={[16, null, null, 24]}>
      <Flex
        direction={['column', null, 'row']}
        justify="space-between"
        align="center"
      >
        <Heading
          as="span"
          size="xl"
          display={{ base: 'none', md: 'block' }}
          color="gray.700"
          mr={8}
        >
          {partnersText}
        </Heading>
        <SimpleGrid columns={2} spacing={8}>
          {partners.map(({ title, link, image }, i) => (
            <Flex key={i} align="center" justify="center">
              <a target="_blank" rel="noopener noreferrer" href={link}>
                <Image
                  src={image}
                  alt={title}
                  maxWidth={{ base: '140px', lg: '200px', xl: '240px' }}
                  maxHeight={{ base: '100px', lg: '130px', xl: '150px' }}
                />
              </a>
            </Flex>
          ))}
        </SimpleGrid>
      </Flex>
    </GridContainer>
  </>
);
