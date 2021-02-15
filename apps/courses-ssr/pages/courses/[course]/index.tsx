import React from 'react';
import RouteWrapper from '../../../routes/RouteWrapper';
import CoursePage from '../../../routes/courses';

export default () => {
  return (
    <RouteWrapper>
      <CoursePage which="overview"/>
    </RouteWrapper>
  );
};
