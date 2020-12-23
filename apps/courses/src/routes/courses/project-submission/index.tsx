import React from 'react';
import { Box } from '@chakra-ui/react';
import { OpenMined } from '@openmined/shared/types';
import { useFirestoreDocDataOnce } from 'reactfire';

import Student from './Student';
import Mentor from './Mentor';

import { prepAccordionAndStatus } from '../project';
import { MENTOR_STUDENT_TOKEN } from '../../users/dashboard/Mentor';
import GridContainer from '../../../components/GridContainer';

export default (props: OpenMined.CoursePagesProp) => {
  const isMentorLayout = !!localStorage.getItem(MENTOR_STUDENT_TOKEN);

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
  const attemptData: OpenMined.CourseProjectSubmission = attemptRef
    ? useFirestoreDocDataOnce(attemptRef)
    : null;

  return (
    <Box bg="gray.50">
      <GridContainer isInitial pt={[8, null, null, 16]} pb={16}>
        {!isMentorLayout && (
          <Student {...props} content={content} attemptData={attemptData} />
        )}
        {isMentorLayout && (
          <Mentor {...props} content={content} attemptData={attemptData} />
        )}
      </GridContainer>
    </Box>
  );
};
