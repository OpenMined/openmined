import { faSlack } from '@fortawesome/free-brands-svg-icons';
import { faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';

import facebookAI from '../assets/homepage/facebook-ai.svg';
import oxford from '../assets/homepage/oxford.png';
import pytorch from '../assets/homepage/pytorch.png';
import unGlobal from '../assets/homepage/un-global.png';
import openmined from '../assets/homepage/openmined.png';

import pasDefault from '../assets/homepage/privacy-and-society-default.svg';
import pasFull from '../assets/homepage/privacy-and-society-full.svg';
import pcDefault from '../assets/homepage/private-computation-default.svg';
import pcFull from '../assets/homepage/private-computation-full.svg';
import elDefault from '../assets/homepage/enterprise-learning-default.svg';
import elFull from '../assets/homepage/enterprise-learning-full.svg';
import mlDefault from '../assets/homepage/mobile-learning-default.svg';
import mlFull from '../assets/homepage/mobile-learning-full.svg';

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
    video: 'DppXfA6C8L8',
    partners: [
      {
        title: 'Facebook AI',
        image: facebookAI,
        link: 'https://ai.facebook.com',
      },
      {
        title: 'PyTorch',
        image: pytorch,
        link: 'https://pytorch.org',
      },
      {
        title: 'OpenMined',
        image: openmined,
        link: 'https://openmined.org',
        extra: true,
      },
      {
        title: 'University of Oxford',
        image: oxford,
        link: 'https://www.ox.ac.uk/',
      },
      {
        title: 'United Nations',
        image: unGlobal,
        link: 'https://unstats.un.org/bigdata/',
      },
    ],
  },
  learn: {
    title: "What You'll Learn",
    description:
      "In this series of courses, you'll learn how privacy is impacting every industry and how to build real-world products with privacy-preserving AI technology.",
    courses: [
      {
        title: 'Privacy and Society',
        description:
          "Privacy infrastructure is changing how information is managed in society. In this course, you'll learn how it creates both opportunity and disruption within nearly every corner of society and how you can join this next great wave of innovation.",
        prerequisites: ['None'],
        forWhom: [
          'Understand how privacy is transforming the world',
          'Learn how privacy-preserving AI can be used in products and services',
        ],
        project:
          'Develop a business proposal or product spec using private AI technology.',
        color: 'cyan.500',
        visual: {
          default: pasDefault,
          full: pasFull,
        },
        cost: 'Free',
        level: 'Beginner',
        length: '6 hours',
      },
      {
        title: 'Foundations of Private Computation',
        description:
          'Become a data scientist and statistician capable of studying data you do not own and cannot see. Learn every major privacy-preserving technique to an intermediate level, understand how they work together, and how you can use them to safely study data owned by another organization (such as another university, enterprise, or government) without ever seeing the underlying data yourself.',
        prerequisites: [
          'Beginner Python, or other programming languages',
          'Experience with Numpy is helpful',
        ],
        forWhom: [
          'Build privacy-preserving technologies from scratch',
          'Use federated learning to work with protected data on remote devices',
          'Understand the math behind encrypted computations',
          'Use differential privacy budgeting with PyTorch models',
        ],
        project:
          'Train a machine learning model on private data in a one-on-one session with the data owner.',
        color: 'green.500',
        visual: {
          default: pcDefault,
          full: pcFull,
        },
        cost: 'Free',
        level: 'Intermediate',
        length: '60 hours',
      },
      {
        title: 'Federated Learning Across Enterprises',
        description:
          'Learn how to stand up a private data warehouse for facilitating private data analysis, and learn how to be a user of such a system to analyze sensitive data from multiple institutions at once.',
        prerequisites: [
          'Complete the Foundations of Private Computation Course',
        ],
        forWhom: [
          'Share data in a private data warehouse',
          'Access private data for statistical analysis or training machine learning models',
        ],
        project:
          'Set up a private data warehouse, then train models on private data provided by other students.',
        color: 'blue.500',
        visual: {
          default: elDefault,
          full: elFull,
        },
        cost: 'Free',
        level: 'Intermediate',
        length: '40 hours',
      },
      {
        title: 'Federated Learning on Mobile',
        description:
          'Learn how to build mobile apps that can train models across millions of devices using federated learning.',
        prerequisites: [
          'Complete the Foundations of Private Computation Course',
        ],
        forWhom: [
          'Train AI models across multiple mobile devices using federated learning',
        ],
        project:
          'Build a mobile app that uses federated learning to train a model across devices.',
        color: 'orange.500',
        visual: {
          default: mlDefault,
          full: mlFull,
        },
        cost: 'Free',
        level: 'Intermediate',
        length: '40 hours',
      },
    ],
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
