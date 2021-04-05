import { faSlack } from '@fortawesome/free-brands-svg-icons';
import { faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';

import { opencollectiveLink, openminedLink, slackLink } from './links';

import pytorch from '../assets/homepage/pytorch.png';
import facebookAI from '../assets/homepage/facebook-ai.svg';
import oxford from '../assets/homepage/oxford.png';
import futureHumanity from '../assets/homepage/future-humanity.png';
import unGlobal from '../assets/homepage/un-global.png';
import openmined from '../assets/homepage/openmined.png';

export default {
  hero: {
    title: 'The Private AI Series',
    description:
      'Learn how privacy technology is changing our world and how you can lead the charge.',
    video: '-b0CQFr6xyA',
    partnersText: 'Course content developed in partnership with...',
    partners: [
      {
        title: 'PyTorch',
        image: pytorch,
        link: 'https://pytorch.org',
      },
      {
        title: 'Facebook AI',
        image: facebookAI,
        link: 'https://ai.facebook.com',
      },
      {
        title: 'University of Oxford',
        image: oxford,
        link: 'https://www.ox.ac.uk/',
      },
      {
        title: 'Future of Humanity Institute',
        image: futureHumanity,
        link: 'https://www.fhi.ox.ac.uk/',
      },
      {
        title: 'United Nations',
        image: unGlobal,
        link: 'https://unstats.un.org/bigdata/',
      },
      {
        title: 'OpenMined',
        image: openmined,
        link: openminedLink,
      },
    ],
  },
  learn: {
    title: "Course Set",
    description:
      "When you signup for this series of courses, you'll learn how privacy is impacting every industry and how to build real-world products with privacy-preserving AI technology.",
  },
  slides: {
    title: 'Learn from the Best Minds in the Industry',
    description:
      "Throughout your journey, you'll hear from a number of interviewed guests including:",
  },
  signup: {
    title: 'Sign Up Today',
    description:
      'Sign up for the Private AI Series today and begin your learning journey.',
  },
  signedup: {
    title: 'Thanks for Signing Up!',
    description:
      'Your spot has been reserved in the first class, starting on January 2nd, 2021.',
  },
  footer: {
    title: 'Join the Community',
    description:
      'OpenMined is a community of thousands devoted to building a new world on privacy, join us!',
    buttons: [
      {
        title: 'Join Slack',
        icon: faSlack,
        link: slackLink,
      },
      {
        title: 'Donate',
        icon: faHandHoldingUsd,
        link: opencollectiveLink,
      },
    ],
  },
};
