import React from 'react';
import { Button, Heading, Image, Text, Flex } from '@chakra-ui/react';
import Page from '@openmined/shared/util-page';
import { Link as RRDLink } from 'react-router-dom';

import FourOhFour from '../../assets/404.png';
import GridContainer from '../../components/GridContainer';

export default () => (
  <Page title="Page Not Found" noIndex>
    <GridContainer isInitial pt={8} pb={16}>
      <Flex direction="column" align="center" textAlign="center">
        <Image src={FourOhFour} alt="Page Not Found" width={320} mb={8} />
        <Heading as="h1" size="xl" mb={4}>
          We could not find that page...
        </Heading>
        <Text color="gray.700" fontSize="lg" mb={8}>
          There is an empty set between the page you're requesting and the pages
          we have.
        </Text>
        <Button as={RRDLink} to="/">
          Go home
        </Button>
      </Flex>
    </GridContainer>
  </Page>
);
