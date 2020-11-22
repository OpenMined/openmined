import React from 'react';
import Page from '@openmined/shared/util-page';

import Footer from './Footer';

import content from '../../content/searchpage';
import GridContainer from '../../components/GridContainer';

export default () => {
  return (
    <Page title="Search">
        <GridContainer isInitial pt={{ lg: 16 }} pb={[16, null, null, 32]}>

        </GridContainer>
        <Footer {...content.footer} />
    </Page> 
  );
};
