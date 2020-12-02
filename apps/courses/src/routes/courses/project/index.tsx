import React from 'react';
import { useParams } from 'react-router-dom';
import Page from '@openmined/shared/util-page';

import GridContainer from '../../../components/GridContainer';

export default () => {
  const { course } = useParams();

  // TODO: Hericles - this is your page!!!

  return (
    <Page title={`${course} - Final Project`}>
      <GridContainer isInitial>
        <p>Course: {course}</p>
        <p>Final Project!</p>
      </GridContainer>
    </Page>
  );
};
