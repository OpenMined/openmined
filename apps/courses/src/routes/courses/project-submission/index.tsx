import React from 'react';
import { Box } from '@chakra-ui/react';

import Student from './Student';
import Mentor from './Mentor';

import GridContainer from '../../../components/GridContainer';

export default (props) => {
  // TODO: Figure out which layout it should be
  const isStudentLayout = true;

  return (
    <Box bg="gray.50">
      <GridContainer isInitial pt={[8, null, null, 16]} pb={16}>
        {isStudentLayout && <Student {...props} />}
        {!isStudentLayout && <Mentor {...props} />}
      </GridContainer>
    </Box>
  );
};
