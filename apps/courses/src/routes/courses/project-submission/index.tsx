import React from 'react';
import { Box } from '@chakra-ui/react';

import Student from './Student';
import Mentor from './Mentor';

import GridContainer from '../../../components/GridContainer';
import { OpenMinded } from '@openmined/shared/types';

export default (props: OpenMinded.CoursePagesProp) => {
  // TODO: Figure out which layout it should be
  const isStudentLayout = true;
  console.log(props)

  return (
    <Box bg="gray.50">
      <GridContainer isInitial pt={[8, null, null, 16]} pb={16}>
        {isStudentLayout && <Student {...props} />}
        {!isStudentLayout && <Mentor {...props} />}
      </GridContainer>
    </Box>
  );
};
