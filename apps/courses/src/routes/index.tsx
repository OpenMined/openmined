import React, { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useUser } from 'reactfire';

const Homepage = lazy(() => import('./homepage'));
const Signup = lazy(() => import('./users/sign-up'));
const Signin = lazy(() => import('./users/sign-in'));
const Settings = lazy(() => import('./users/settings'));
const Profile = lazy(() => import('./users/profile'));
const CoursesSearch = lazy(() => import('./courses/search'));
const CourseOverview = lazy(() => import('./courses/overview'));
const CourseProject = lazy(() => import('./courses/project'));
const CourseLesson = lazy(() => import('./courses/lesson'));
const CourseLessonComplete = lazy(() => import('./courses/lesson-complete'));
const CourseConcept = lazy(() => import('./courses/concept'));
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
      <Route path="/" element={<CoursesSearch />} />
      <Route path=":course">
        <Route path="/" element={<CourseOverview />} />
        <AuthRoute path="project" element={<CourseProject />} />
        <AuthRoute path=":lesson">
          <AuthRoute path="/" element={<CourseLesson />} />
          <AuthRoute path="complete" element={<CourseLessonComplete />} />
          <AuthRoute path=":concept" element={<CourseConcept />} />
        </AuthRoute>
      </Route>
    </Route>
    <Route path="policy" element={<PolicyAndTerms />} />
    <Route path="terms" element={<PolicyAndTerms />} />
    <Route path="*" element={<NoMatch />} />
  </Routes>
);
