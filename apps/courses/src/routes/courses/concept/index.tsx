import React from 'react';
import { useParams } from 'react-router-dom';
import Page from '@openmined/shared/util-page';

import GridContainer from '../../../components/GridContainer';

export default () => {
  const { course, lesson, concept } = useParams();

  return (
    <Page title={`${lesson} - ${concept}`}>
      <GridContainer isInitial>
        <p>Course: {course}</p>
        <p>Lesson: {lesson}</p>
        <p>Concept: {concept}</p>
      </GridContainer>
    </Page>
  );
};
