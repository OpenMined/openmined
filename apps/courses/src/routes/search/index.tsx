import React from 'react';
import { Box, Flex } from "@chakra-ui/core";
import Page from '@openmined/shared/util-page';

import Filter from './Filter';
import Footer from './Footer';

import content from '../../content/searchpage';
import GridContainer from '../../components/GridContainer';

export default () => {
  return (
    <Page title="Search">
      <GridContainer isInitial pt={{ lg: 16 }} pb={[16, null, null, 32]}>
        <Flex>
          <Box flex={[null, null, null, '0 0 20%']} width="100%" >
            <Filter  {...content.filters}/>
          </Box>
        </Flex>
      </GridContainer>
      <Footer {...content.footer} />
    </Page> 
  );
};
