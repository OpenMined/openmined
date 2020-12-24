import React, { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useUser } from 'reactfire';

import { Box } from '@chakra-ui/react';

import Header from '../components/Header';
import Footer from '../components/Footer';

const Homepage = lazy(() => import('./homepage'));
const Signup = lazy(() => import('./users/sign-up'));
const Signin = lazy(() => import('./users/sign-in'));
const Dashboard = lazy(() => import('./users/dashboard'));
const Settings = lazy(() => import('./users/settings'));
const Profile = lazy(() => import('./users/profile'));
const CoursePage = lazy(() => import('./courses'));
const PolicyAndTerms = lazy(() => import('./policy-and-terms'));
const NoMatch = lazy(() => import('./no-match'));

const AuthRoute = (props) => {
  const user = useUser();

  return user ? <Route {...props} /> : <Navigate to="/signin" />;
};

const UnauthRoute = (props) => {
  const user = useUser();

  return !user ? <Route {...props} /> : <Navigate to="/users/dashboard" />;
};

const RouteWrapper = ({
  noHeader = false,
  blackHeader = false,
  noFooter = false,
  children,
}) => (
  <>
    {!noHeader && <Header noScrolling={blackHeader} />}
    <Box
      minHeight="100vh"
      display="grid"
      gridTemplateRows={!noFooter ? '1fr' : '1fr auto'}
    >
      {children}
      {!noFooter && <Footer />}
    </Box>
  </>
);

export default () => (
  <Routes>
    <Route
      path="/"
      element={
        <RouteWrapper>
          <Homepage />
        </RouteWrapper>
      }
    />
    <UnauthRoute
      path="signup"
      element={
        <RouteWrapper>
          <Signup />
        </RouteWrapper>
      }
    />
    <UnauthRoute
      path="signin"
      element={
        <RouteWrapper>
          <Signin />
        </RouteWrapper>
      }
    />
    <Route path="users">
      <Route path="/" element={<Navigate to="/" />} />
      <AuthRoute
        path="dashboard"
        element={
          <RouteWrapper>
            <Dashboard />
          </RouteWrapper>
        }
      />
      <AuthRoute
        path="settings"
        element={
          <RouteWrapper>
            <Settings />
          </RouteWrapper>
        }
      />
      <Route
        path=":uid"
        element={
          <RouteWrapper>
            <Profile />
          </RouteWrapper>
        }
      />
    </Route>
    <Route path="courses">
      <Route
        path="/"
        element={
          <RouteWrapper>
            <CoursePage which="search" />
          </RouteWrapper>
        }
      />
      <Route path=":course">
        <Route
          path="/"
          element={
            <RouteWrapper>
              <CoursePage which="overview" />
            </RouteWrapper>
          }
        />
        <AuthRoute
          path="complete"
          element={
            <RouteWrapper blackHeader>
              <CoursePage which="courseComplete" />
            </RouteWrapper>
          }
        />
        <AuthRoute path="project">
          <AuthRoute
            path="/"
            element={
              <RouteWrapper noHeader>
                <CoursePage which="project" />
              </RouteWrapper>
            }
          />
          <AuthRoute
            path="complete"
            element={
              <RouteWrapper noHeader noFooter>
                <CoursePage which="projectComplete" />
              </RouteWrapper>
            }
          />
          <AuthRoute path=":part">
            <AuthRoute
              path="/"
              element={
                <RouteWrapper noHeader>
                  <CoursePage which="projectSubmission" />
                </RouteWrapper>
              }
            />
            <AuthRoute
              path=":attempt"
              element={
                <RouteWrapper noHeader>
                  <CoursePage which="projectSubmission" />
                </RouteWrapper>
              }
            />
          </AuthRoute>
        </AuthRoute>
        <AuthRoute path=":lesson">
          <AuthRoute
            path="/"
            element={
              <RouteWrapper noHeader>
                <CoursePage which="lesson" />
              </RouteWrapper>
            }
          />
          <AuthRoute
            path="complete"
            element={
              <RouteWrapper noHeader noFooter>
                <CoursePage which="lessonComplete" />
              </RouteWrapper>
            }
          />
          <AuthRoute
            path=":concept"
            element={
              <RouteWrapper noHeader noFooter>
                <CoursePage which="concept" />
              </RouteWrapper>
            }
          />
        </AuthRoute>
      </Route>
    </Route>
    <Route
      path="policy"
      element={
        <RouteWrapper>
          <PolicyAndTerms />
        </RouteWrapper>
      }
    />
    <Route
      path="terms"
      element={
        <RouteWrapper>
          <PolicyAndTerms />
        </RouteWrapper>
      }
    />
    <Route
      path="*"
      element={
        <RouteWrapper>
          <NoMatch />
        </RouteWrapper>
      }
    />
  </Routes>
);
