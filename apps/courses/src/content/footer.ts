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
  links: [
    {
      title: 'Courses',
      links: [
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
    {
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
  ],
  copyright: {
    title: `© Copyright ${new Date().getFullYear()} OpenMined`,
    links: [
      {
        title: 'Terms & Conditions',
        link: '/terms',
      },
      {
        title: 'Privacy Policy',
        link: '/policy',
      },
    ],
  },
};
