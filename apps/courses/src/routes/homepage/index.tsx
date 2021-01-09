import React from 'react';

import Page from '@openmined/shared/util-page';

import Hero from './Hero';
import Learn, { LearnSSR } from './Learn';
import Slides, { SlidesSSR } from './Slides';
// import SignUp from './SignUp';
import Footer from './Footer';

import FeaturesOrResources from '../../components/FeaturesOrResources';
import content from '../../content/homepage';

export default () => (
  <Page>
    <Hero {...content.hero} />
    <Learn {...content.learn} />
    <Slides {...content.slides} />
    <FeaturesOrResources which="features" />
    {/* <SignUp signup={content.signup} signedup={content.signedup} /> */}
    <Footer {...content.footer} />
  </Page>
);

export const HomepageSSR = ({ homepageCourses, teachers }) => (
  <Page>
    <Hero {...content.hero} />
    <LearnSSR {...content.learn} data={homepageCourses} />
    <SlidesSSR {...content.slides} data={teachers} />
    <FeaturesOrResources which="features" />
    {/* <SignUp signup={content.signup} signedup={content.signedup} /> */}
    <Footer {...content.footer} />
  </Page>
);
