import React from 'react';
import { Flex, Heading, Text, AspectRatio, Box, Image } from '@chakra-ui/core';

import GridContainer from '../../components/GridContainer';
import waveform from '../../assets/waveform.jpg';

export default ({ title, description, video, partners }) => (
  <>
    <Box
      position="relative"
      pb={[32, null, null, 40, 48]}
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
        backgroundPosition: ['0% 90%', null, '0% 100%'],
        backgroundSize: 'contain',
      }}
    >
      <GridContainer isInitial>
        <Flex
          pt={[5, null, 8, 12, 16]}
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
              src={`https://www.youtube.com/embed/${video}?controls=0&modestbranding=1&rel=0`}
              allowFullScreen
            />
          </AspectRatio>
        </Flex>
      </GridContainer>
    </Box>
    <Flex
      mt={[-16, null, null, -24, -32]}
      mb={[16, null, null, 24, 32]}
      direction={['column', null, 'row']}
      justify="space-around"
      align="center"
    >
      {partners.map(({ title, link, image, extra }, i) => (
        <a
          key={i}
          target="_blank"
          rel="noopener noreferrer"
          href={link}
          style={{ position: 'relative' }}
        >
          <Image
            width={['180px', null, '140px', null, extra ? '240px' : '160px']}
            mt={i === 0 ? 0 : [4, null, 0]}
            src={image}
            alt={title}
          />
        </a>
      ))}
    </Flex>
  </>
);
