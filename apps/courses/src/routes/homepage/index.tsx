import React from 'react';

import Hero from './Hero';
import Learn from './Learn';
import Slides from './Slides';
import Features from './Features';
import SignUp from './SignUp';
import Footer from './Footer';

import content from '../../content/homepage';
import Page from '@openmined/shared/util-page';
import { useSanity } from '@openmined/shared/data-access-sanity';

export default () => {
  const { data, loading } = useSanity(`*[_type == "teacher"] {
    ...,
    "image": image.asset -> url,
  }`);

  const order = [
    'Cynthia Dwork',
    'Helen Nissenbaum',
    'Pascal Paillier',
    'Ilya Mironov',
    'Dawn Song',
    'Ramesh Raskar',
  ];
  const slides = data
    ? data.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name))
    : null;

  return (
    <Page>
      <Hero {...content.hero} />
      <Learn {...content.learn} />
      {slides && <Slides {...content.slides} slides={slides} />}
      <Features {...content.features} />
      <SignUp signup={content.signup} signedup={content.signedup} />
      <Footer {...content.footer} />
    </Page>
  );
};
