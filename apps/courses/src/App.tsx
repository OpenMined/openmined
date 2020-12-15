import React, { Suspense, useEffect, useState, useLayoutEffect } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import {
  preloadAuth,
  preloadFirestore,
  useAnalytics,
  useFirebaseApp,
} from 'reactfire';

import Routes from './routes';

import Header from './components/Header';
import Loading from './components/Loading';
import Cookies from './components/Cookies';
import Footer from './components/Footer';
import { Box } from '@chakra-ui/react';

const Analytics = ({ location }) => {
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.logEvent('page-view', { path_name: location.pathname });
  }, [location.pathname, analytics]);

  return null;
};

const history = createBrowserHistory();

const preloadSDKs = (firebaseApp) => {
  return Promise.all([
    preloadFirestore({
      firebaseApp,
      setup: (firestore) => {
        const initalizedStore = firestore();
        initalizedStore.settings({ host: 'localhost:8080', ssl: false });
        firestore().enablePersistence();
      },
    }),
    // TODO:  Create a bucket for dev purposes only
    //
    // preloadStorage({
    //   firebaseApp,
    //   setup: (storage) => {
    //     storage('gs://put-a-bucket-here');
    //   },
    // }),
    preloadAuth({
      firebaseApp,
      setup: (auth) => {
        auth().useEmulator('http://localhost:9099/');
      },
    }),
  ]);
};

const App = () => {
  const [cookiePrefs, setCookiePrefs] = useState(
    window.localStorage.getItem('@openmined/cookie-preferences') || null
  );
  const [action, setAction] = useState(history.action);
  const [location, setLocation] = useState(history.location);

  useLayoutEffect(() => {
    history.listen(({ location, action }) => {
      setLocation(location);
      setAction(action);
    });
  }, []);

  const storeCookiePrefs = (preference) => {
    window.localStorage.setItem('@openmined/cookie-preferences', preference);
    setCookiePrefs(preference);
  };

  // If we're inside the course, don't show the <Header /> at all
  // Instead, we'll show the <CourseHeader />
  const isInsideCourse =
    location.pathname.includes('/courses') &&
    location.pathname.split('/').length > 3;

  // More specifically, if we're inside the concept, we don't render the default <Footer />
  // Instead, we'll show the <CourseFooter />
  const isInsideConcept =
    location.pathname.includes('/courses') &&
    location.pathname.split('/').length > 4;

  const firebaseApp = useFirebaseApp();

  if (process.env.NODE_ENV === 'development') {
    preloadSDKs(firebaseApp);
  }

  return (
    <Router action={action} location={location} navigator={history}>
      <Suspense fallback={<Loading />}>
        {cookiePrefs === 'all' && <Analytics location={location} />}
        {!isInsideCourse && <Header />}
        <Box
          minHeight="100vh"
          display="grid"
          gridTemplateRows={isInsideConcept ? '1fr' : '1fr auto'}
        >
          <Routes />
          {!isInsideConcept && <Footer />}
        </Box>
        {!cookiePrefs && <Cookies callback={storeCookiePrefs} />}
      </Suspense>
    </Router>
  );
};

export default App;
