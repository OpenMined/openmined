import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import {
  discussionLink,
  githubLink,
  openminedLink,
  placementsLink,
  slackLink,
} from './links';

export default {
  about: {
    title: 'About OpenMined',
    description:
      'Located at the intersection of privacy & AI, we are an open-source community of over 10,000 researchers, engineers, mentors and enthusiasts committed to making a fairer more prosperous world.',
    button: {
      text: 'OpenMined.org',
      icon: faArrowRight,
      link: openminedLink,
    },
  },
  links: [
    {
      title: 'Courses',
      links: [
        {
          title: 'Our Privacy Opportunity',
          link: '/courses/our-privacy-opportunity',
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
          link: discussionLink,
        },
        {
          title: 'Slack',
          link: slackLink,
        },
        {
          title: 'Github',
          link: githubLink,
        },
        {
          title: 'Careers',
          link: placementsLink,
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
