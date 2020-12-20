import React from 'react';
import { faGithub, faSlack } from '@fortawesome/free-brands-svg-icons';
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons';

export const MentorContext = ({ uid }) => {
  return <div>Mentorship Dashboard</div>;
};

export const MentorTabs = ({ uid }) => {
  return <div>Mentorship Tabs</div>;
};

export const mentorResources = [
  {
    title: 'Discussion Board',
    icon: faCommentAlt,
    link: 'https://discussion.openmined.org',
  },
  {
    title: 'Slack',
    icon: faSlack,
    link: 'https://slack.openmined.org',
  },
  {
    title: 'Code of Conduct',
    icon: faGithub,
    link: 'https://github.com/OpenMined/.github/blob/master/CODE_OF_CONDUCT.md',
  },
];
