import React from 'react';
import { Box, Heading, Text, SimpleGrid } from '@chakra-ui/react';
import Page from '@openmined/shared/util-page';

import content from '../../../content/sign-up';
import GridContainer from '../../../components/GridContainer';
import Signup from '../../../components/forms/users/SignUp';
import waveform from '../../../assets/waveform/waveform-rainbow.png';

export default () => {
  const { title, description } = content;

  return (
    <Page title="Sign Up">
      <Box
        position="relative"
        pt={8}
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
        <GridContainer isInitial pt={{ lg: 16 }} pb={[16, null, null, 32]}>
          <SimpleGrid columns={[1, null, null, 2]} spacing={[4, null, 8]}>
            <Box mr={8}>
              <Heading as="h1" size="3xl" mb={4}>
                {title}
              </Heading>
              <Text color="gray.700" fontSize="lg">
                {description}
              </Text>
            </Box>
            <Box bg="whiteAlpha.800" boxShadow="lg" p={6} borderRadius="md">
              <Signup />
            </Box>
          </SimpleGrid>
        </GridContainer>
      </Box>
    </Page>
  );
};
