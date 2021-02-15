import React from 'react';
import RouteWrapper from '../routes/RouteWrapper';
import Signin from '../routes/users/sign-in';

export default () => {
  return (
    <RouteWrapper>
      <Signin />
    </RouteWrapper>
  );
};
