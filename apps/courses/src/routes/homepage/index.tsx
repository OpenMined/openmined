import React from 'react';

import Page from '@openmined/shared/util-page';

import Hero from './Hero';
import Learn from './Learn';
// import Slides from './Slides';
// import SignUp from './SignUp';
import Footer from './Footer';

import FeaturesOrResources from '../../components/FeaturesOrResources';
import content from '../../content/homepage';

export default () => (
  <Page>
    <Hero {...content.hero} />
    {/* <Learn {...content.learn} /> */}
    {/* <Slides {...content.slides} /> */}
    <FeaturesOrResources which="features" />
    {/* <SignUp signup={content.signup} signedup={content.signedup} /> */}
    <Footer {...content.footer} /> */}
  </Page>
);
