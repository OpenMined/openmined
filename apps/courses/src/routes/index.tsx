import React, { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useUser } from 'reactfire';

const Homepage = lazy(() => import('./homepage'));
const Signup = lazy(() => import('./sign-up'));
const Signin = lazy(() => import('./sign-in'));
const AccountSettings = lazy(() => import('./account-settings'));
const Profile = lazy(() => import('./profile'));
const NoMatch = lazy(() => import('./no-match'));

const AuthRoute = (props) => {
  const user = useUser();

  return user ? <Route {...props} /> : <Navigate to="/" />;
};

const UnauthRoute = (props) => {
  const user = useUser();

  return !user ? <Route {...props} /> : <Navigate to="/" />;
};

export default () => (
  <Routes>
    <Route path="/" element={<Homepage />} />
    <UnauthRoute path="signup" element={<Signup />} />
    <UnauthRoute path="signin" element={<Signin />} />
    <AuthRoute path="settings" element={<AccountSettings />} />
    <Route path="users/:uid" element={<Profile />} />
    {/* <Route path="users">
      <Route path=":uid" element={<Profile />} />
    </Route> */}
    <Route path="*" element={<NoMatch />} />
  </Routes>
);
