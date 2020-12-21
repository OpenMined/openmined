import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  faArrowRight,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import Icon from '../../../components/Icon';

dayjs.extend(relativeTime);

export default ({
  status,
  part,
  index,
  setSubmissionParams,
  ...submission
}) => {
  const passed = status === 'passed';

  const props = {
    key: index,
    p: 3,
    mt: 2,
    cursor: 'pointer',
    borderRadius: 'md',
    fontSize: 'sm',
    justify: 'space-between',
    align: 'center',
    bg: passed ? 'green.50' : 'magenta.50',
  };

  const iconColor = passed ? 'green.400' : 'magenta.400';

  return (
    <Flex
      {...props}
      onClick={() => {
        setSubmissionParams({
          part,
          attempt: index,
        });
      }}
    >
      <Flex align="center">
        <Icon
          icon={passed ? faCheckCircle : faTimesCircle}
          color={iconColor}
          size="lg"
          mr={4}
        />
        <Text fontWeight="bold" mr={2}>
          {passed ? 'Passed' : 'Failed'}
        </Text>
        <Text fontStyle="italic" color="gray.700">
          {dayjs(submission.reviewed_at.toDate()).fromNow()}
        </Text>
      </Flex>
      <Icon icon={faArrowRight} color={iconColor} />
    </Flex>
  );
};
