import { faSlack } from '@fortawesome/free-brands-svg-icons';
import { faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';

import pytorch from '../assets/homepage/pytorch.png';
import facebookAI from '../assets/homepage/facebook-ai.svg';
import oxford from '../assets/homepage/oxford.png';
import futureHumanity from '../assets/homepage/future-humanity.png';
import unGlobal from '../assets/homepage/un-global.png';
import openmined from '../assets/homepage/openmined.png';

import star from '../assets/homepage/star.svg';
import realWorld from '../assets/homepage/real-world.svg';
import instructors from '../assets/homepage/instructors.svg';
import like from '../assets/homepage/like.svg';
import technicalMentor from '../assets/homepage/technical-mentor.svg';

import cynthia from '../assets/homepage/cynthia-dwork.png';
import helen from '../assets/homepage/helen-nissenbaum.png';
import pascal from '../assets/homepage/pascal-paillier.png';
import ilya from '../assets/homepage/ilya-mironov.png';
import dawn from '../assets/homepage/dawn-song.png';
import ramesh from '../assets/homepage/ramesh-raskar.png';

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
        link: 'https://openmined.org',
      },
    ],
  },
  learn: {
    title: "What You'll Learn",
    description:
      "In this series of courses, you'll learn how privacy is impacting every industry and how to build real-world products with privacy-preserving AI technology.",
  },
  slides: {
    title: 'Learn from the Best Minds in the Industry',
    description:
      "Throughout your journey, you'll hear from a number of interviewed guests including:",
    slides: [
      {
        image: cynthia,
        author: 'Cynthia Dwork',
        credentials: 'Author of Differential Privacy - Harvard',
      },
      {
        image: helen,
        author: 'Helen Nissenbaum',
        credentials:
          'Professor at Cornell Tech - Author of Contextual Integrity',
      },
      {
        image: pascal,
        author: 'Pascal Paillier',
        credentials: 'Author of Paillier Encryption - Zama',
      },
      {
        image: ilya,
        author: 'Ilya Mironov',
        credentials: 'Author of Renyi Differential Privacy - FAIR',
      },
      {
        image: dawn,
        author: 'Dawn Song',
        credentials: 'Leader of Keystone - UC Berkeley',
      },
      {
        image: ramesh,
        author: 'Ramesh Raskar',
        credentials: 'Co-Author of SplitNN - MIT',
      },
    ],
  },
  features: {
    title: 'Course Features',
    icon: star,
    list: [
      {
        title: 'Real-world Projects',
        description:
          'Our projects are designed to test your new skills and show them off to employers',
        icon: realWorld,
      },
      {
        title: 'Expert Instructors',
        description:
          'Our courses are taught by the people building private AI technology',
        icon: instructors,
      },
      {
        title: 'Supportive Community',
        description:
          "You'll join a community of thousands who will support your learning journey",
        icon: like,
      },
      {
        title: 'Technical Mentorship',
        description:
          'Our mentors provide feedback on your projects and help you at every step',
        icon: technicalMentor,
      },
    ],
  },
  signup: {
    title: 'Sign Up Today',
    description:
      'Sign up today to reserve your spot in the first class, starting on January 2nd, 2021.',
  },
  signedup: {
    title: 'Thanks for Signing Up!',
    // TODO: This isn't official copy!
    description:
      'Your spot has been reserved in the first class, starting on January 2nd, 2021.',
  },
  signin: {
    title: 'Welcome back!',
    // TODO: This isn't official copy!
    description: `"Tell me and I forget, teach me and I may remember, involve me and I learn." - Benjamin Franklin`,
  },
  footer: {
    title: 'Join the Community',
    description:
      'OpenMined is a community of thousands devoted to building a new world on privacy, join us!',
    buttons: [
      {
        title: 'Join Slack',
        icon: faSlack,
        link: 'https://slack.openmined.org',
      },
      {
        title: 'Donate',
        icon: faHandHoldingUsd,
        link: 'https://opencollective.com/openmined',
      },
    ],
    links: [
      {
        title: 'OpenMined.org',
        link: 'https://openmined.org',
      },
    ],
  },
};
