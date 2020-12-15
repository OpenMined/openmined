import React, { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useUser } from 'reactfire';

const Homepage = lazy(() => import('./homepage'));
const Signup = lazy(() => import('./users/sign-up'));
const Signin = lazy(() => import('./users/sign-in'));
const Settings = lazy(() => import('./users/settings'));
const Profile = lazy(() => import('./users/profile'));
const CoursePage = lazy(() => import('./courses'));
const PolicyAndTerms = lazy(() => import('./policy-and-terms'));
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
    <Route path="users">
      <Route path="/" element={<Navigate to="/" />} />
      <AuthRoute path="settings" element={<Settings />} />
      <Route path=":uid" element={<Profile />} />
    </Route>
    <Route path="courses">
      <Route path="/" element={<CoursePage which="search" />} />
      <Route path=":course">
        <Route path="/" element={<CoursePage which="overview" />} />
        <AuthRoute
          path="complete"
          element={<CoursePage which="courseComplete" />}
        />
        <AuthRoute path="project">
          <AuthRoute path="/" element={<CoursePage which="project" />} />
          <AuthRoute
            path="complete"
            element={<CoursePage which="projectComplete" />}
          />
        </AuthRoute>
        <AuthRoute path=":lesson">
          <AuthRoute path="/" element={<CoursePage which="lesson" />} />
          <AuthRoute
            path="complete"
            element={<CoursePage which="lessonComplete" />}
          />
          <AuthRoute path=":concept" element={<CoursePage which="concept" />} />
        </AuthRoute>
      </Route>
    </Route>
    <Route path="policy" element={<PolicyAndTerms />} />
    <Route path="terms" element={<PolicyAndTerms />} />
    <Route path="*" element={<NoMatch />} />
  </Routes>
);
