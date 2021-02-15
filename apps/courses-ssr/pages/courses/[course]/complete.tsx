import React from 'react';
import RouteWrapper from '../../../routes/RouteWrapper';
import CoursePage from '../../../routes/courses';

export default () => {
  return (
    <RouteWrapper blackHeader>
      <CoursePage which="courseComplete"/>
    </RouteWrapper>
  );
};
