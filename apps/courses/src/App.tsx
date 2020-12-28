import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import {
  preloadAuth,
  preloadFirestore,
  preloadFunctions,
  useAnalytics,
  useFirebaseApp,
} from 'reactfire';

import Routes from './routes';

import Loading from './components/Loading';
import Cookies from './components/Cookies';

import { SuspenseWithPerf } from 'reactfire';

const history = createBrowserHistory();

const preloadSDKs = (firebaseApp) =>
  Promise.all([
    preloadAuth({
      firebaseApp,
      setup: (auth) => {
        auth().useEmulator('http://localhost:5500/');
      },
    }),
    preloadFunctions({
      firebaseApp,
      setup: (functions) => {
        functions().useFunctionsEmulator('http://localhost:5501');
      },
    }),
    preloadFirestore({
      firebaseApp,
      setup: (firestore) => {
        const initalizedStore = firestore();
        initalizedStore.settings({ host: 'localhost:5502', ssl: false, experimentalForceLongPolling: true });
        firestore().enablePersistence({ experimentalForceOwningTab: true });
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
  ]);

const Analytics = ({ cookiePrefs, location }) => {
  const analytics = useAnalytics();

  useEffect(() => {
    if (cookiePrefs === 'all') {
      analytics.setAnalyticsCollectionEnabled(true);
    } else {
      analytics.setAnalyticsCollectionEnabled(false);
    }
  }, [cookiePrefs, analytics]);

  useEffect(() => {
    if (cookiePrefs === 'all') {
      analytics.logEvent('page_view', { path_name: location.pathname });
    }
  }, [location, cookiePrefs, analytics]);

  return null;
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

  const firebaseApp = useFirebaseApp();

  // @ts-ignore
  if (window.Cypress) {
    preloadSDKs(firebaseApp);
  }

  return (
    <Router action={action} location={location} navigator={history}>
      <SuspenseWithPerf fallback={<Loading />} traceId={location.pathname}>
        <Analytics cookiePrefs={cookiePrefs} location={location} />
        <Routes />
        {!cookiePrefs && <Cookies callback={storeCookiePrefs} />}
      </SuspenseWithPerf>
    </Router>
  );
};

export default App;
