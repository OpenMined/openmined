import React from 'react';
import {
  faCommentAlt,
  faPencilAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { faSlack } from '@fortawesome/free-brands-svg-icons';

import { blogLink, discussionLink, slackLink } from './links';

import Icon from '../components/Icon';
import star from '../assets/homepage/star.svg';
import realWorld from '../assets/homepage/real-world.svg';
import instructors from '../assets/homepage/instructors.svg';
import like from '../assets/homepage/like.svg';
import technicalMentor from '../assets/homepage/technical-mentor.svg';

export const features = {
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
};

export const resources = {
  title: 'Community Resources',
  icon: star,
  list: [
    {
      title: 'Discussion Board',
      description:
        'Take your learning to the next level and discuss it with the community!',
      icon: <Icon icon={faCommentAlt} boxSize={8} color="blue.500" />,
      link: {
        title: 'Check it Out',
        link: discussionLink,
      },
    },
    {
      title: 'Slack Community',
      description:
        'Join the conversation with over 10,000 others in Slack community!',
      icon: <Icon icon={faSlack} boxSize={8} color="blue.500" />,
      link: {
        title: 'Join Slack',
        link: slackLink,
      },
    },
    {
      title: 'Blog',
      description:
        'For the latest news and info on the OpenMined community, visit our blog!',
      icon: <Icon icon={faPencilAlt} boxSize={8} color="blue.500" />,
      link: {
        title: 'Check it Out',
        link: blogLink,
      },
    },
    {
      title: 'Mentors',
      description:
        'Our mentors provide feedback on your projects and help you at every step!',
      icon: <Icon icon={faUser} boxSize={8} color="blue.500" />,
    },
  ],
};
