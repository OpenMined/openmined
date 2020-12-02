import React from 'react';
import { useParams } from 'react-router-dom';
import Page from '@openmined/shared/util-page';

import GridContainer from '../../../components/GridContainer';

export default () => {
  const { course, lesson } = useParams();

  // TODO: Patrick, use this page to redirect the user to either their current concept if they have some progress
  // Or redirect them to the first concept if they've either completed all the concepts in this lesson, or haven't started it yet

  return (
    <Page title={lesson}>
      <GridContainer isInitial>
        <p>Course: {course}</p>
        <p>Lesson: {lesson}</p>
      </GridContainer>
    </Page>
  );
};
