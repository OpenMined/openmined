import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default {
  about: {
    title: 'About OpenMined',
    description:
      'Located at the intersection of privacy & AI, we are an open-source community of over 10,000 researchers, engineers, mentors and enthusiasts committed to making a fairer more prosperous world.',
    button: {
      text: 'OpenMined.org',
      icon: faArrowRight,
      link: 'https://openmined.org',
    },
  },
  catalog: {
    title: 'Catalog',
    courses: [
      {
        title: 'Privacy and Society',
        link: 'https://courses.openmined.org/courses/privacy-and-society',
      },
      {
        title: 'Foundations of Private Computation',
        link:
          'https://courses.openmined.org/courses/foundations-of-private-computation',
      },
      {
        title: 'Federated Learning Across Enterprises',
        link:
          'https://courses.openmined.org/courses/federated-learning-across-enterprises',
      },
      {
        title: 'Federated Learning on Mobile',
        link:
          'https://courses.openmined.org/courses/federated-learning-on-mobile',
      },
    ],
  },
  resources: {
    title: 'Resources',
    links: [
      {
        title: 'Discussion Board',
        link: 'https://discussion.openmined.org/',
      },
      {
        title: 'Slack',
        link: 'https://slack.openmined.org/',
      },
      {
        title: 'GitHub',
        link: 'https://github.com/OpenMined',
      },
      {
        title: 'Careers',
        link: 'https://placements.openmined.org/',
      },
    ],
  },
  bottom: {
    copyright: `© Copyright ${new Date().getFullYear()} OpenMined`,
    terms_and_conditions: {
      title: 'Terms & Conditions',
      link: '/tos',
    },
    privacy_policy: {
      title: 'Privacy Policy',
      link: '/policy',
    },
  },
};
