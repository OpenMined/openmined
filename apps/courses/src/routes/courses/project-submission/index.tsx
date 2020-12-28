import React from 'react';
import { Box } from '@chakra-ui/react';
import {
  CoursePagesProp,
  CourseProjectSubmission,
} from '@openmined/shared/types';
import { useFirestoreDocDataOnce } from 'reactfire';

import Student from './Student';
import Mentor from './Mentor';

import { prepAccordionAndStatus } from '../project';
import GridContainer from '../../../components/GridContainer';
import { useSearchParams } from 'react-router-dom';

export default (props: CoursePagesProp) => {
  const [searchParams] = useSearchParams();
  const studentParam = searchParams.get('student');
  const isMentorLayout = !!studentParam;

  const {
    progress,
    part,
    attempt,
    page: {
      project: { parts },
    },
  } = props;

  // Make sure to get the content for each of the parts
  const { content: allCombinedContent } = prepAccordionAndStatus(
    progress,
    parts
  );
  const content =
    allCombinedContent[allCombinedContent.findIndex((p) => p._key === part)];

  // If we've been asked to load an attempt for this page
  const attemptRef = attempt
    ? content.submissions[+attempt - 1].submission
    : null;
  const attemptData: CourseProjectSubmission = attemptRef
    ? useFirestoreDocDataOnce(attemptRef)
    : null;

  return (
    <Box bg="gray.50">
      <GridContainer isInitial py={16}>
        {!isMentorLayout && (
          <Student {...props} content={content} attemptData={attemptData} />
        )}
        {isMentorLayout && (
          <Mentor
            {...props}
            content={content}
            attemptData={attemptData}
            student={studentParam}
          />
        )}
      </GridContainer>
    </Box>
  );
};
