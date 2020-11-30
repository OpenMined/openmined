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
  courses: {
    title: 'Courses',
    courses: [
      {
        title: 'Privacy and Society',
        link: '/courses/privacy-and-society',
      },
      {
        title: 'Foundations of Private Computation',
        link: '/courses/foundations-of-private-computation',
      },
      {
        title: 'Federated Learning Across Enterprises',
        link: '/courses/federated-learning-across-enterprises',
      },
      {
        title: 'Federated Learning on Mobile',
        link: '/courses/federated-learning-on-mobile',
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
        title: 'Github',
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
