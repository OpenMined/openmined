import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  faArrowRight,
  faCheckCircle,
  faPaperPlane,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Icon from './Icon';

dayjs.extend(relativeTime);

export default ({ status, link, ...submission }) => {
  if (status === 'none') return null;

  const props = {
    p: 3,
    mt: 2,
    cursor: 'pointer',
    borderRadius: 'md',
    fontSize: 'sm',
    justify: 'space-between',
    align: 'center',
  };

  let icon, iconColor, text;

  if (status === 'passed') {
    props.bg = 'green.50';
    icon = faCheckCircle;
    iconColor = 'green.400';
    text = 'Passed';
  } else if (status === 'pending') {
    props.bg = 'gray.200';
    icon = faPaperPlane;
    iconColor = 'gray.800';
    text = 'Submitted';
  } else {
    props.bg = 'magenta.50';
    icon = faTimesCircle;
    iconColor = 'magenta.400';
    text = 'Failed';
  }

  return (
    <Flex as={Link} to={link} {...props}>
      <Flex align="center">
        <Icon icon={icon} color={iconColor} boxSize={5} size="lg" mr={4} />
        <Text fontWeight="bold" mr={2}>
          {text}
        </Text>
        <Text fontStyle="italic" color="gray.700">
          {submission.reviewed_at &&
            `Reviewed ${dayjs(submission.reviewed_at.toDate()).fromNow()}`}
          {!submission.reviewed_at &&
            `Submitted ${dayjs(submission.submitted_at.toDate()).fromNow()}`}
        </Text>
      </Flex>
      <Icon icon={faArrowRight} color={iconColor} />
    </Flex>
  );
};
