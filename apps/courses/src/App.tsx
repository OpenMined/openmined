import React, { useState, useLayoutEffect, useEffect } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import {
  preloadAuth,
  preloadFirestore,
  preloadFunctions,
  useFirebaseApp,
  useFirestore,
} from 'reactfire';

import Routes from './routes';

import Loading from './components/Loading';

import { SuspenseWithPerf } from 'reactfire';

const history = createBrowserHistory();

const Firebase = () => {
  const firebaseApp = useFirebaseApp();
  const firestore = useFirestore();

  // @ts-ignore
  if (window.Cypress) {
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
          initalizedStore.settings({
            host: 'localhost:5502',
            ssl: false,
            experimentalForceLongPolling: true,
          });
          firestore().enablePersistence({ experimentalForceOwningTab: true });
        },
      }),
      // TODO: Create a bucket for dev purposes only
      //
      // preloadStorage({
      //   firebaseApp,
      //   setup: (storage) => {
      //     storage('gs://put-a-bucket-here');
      //   },
      // }),
    ]);
  }

  useEffect(() => {
    firestore.enablePersistence();
  }, []);

  return null;
};

const App = () => {
  const [action, setAction] = useState(history.action);
  const [location, setLocation] = useState(history.location);

  useLayoutEffect(() => {
    history.listen(({ location, action }) => {
      setLocation(location);
      setAction(action);
    });
  }, []);

  return (
    <Router action={action} location={location} navigator={history}>
      <SuspenseWithPerf fallback={<Loading />} traceId={location.pathname}>
        <Firebase />
        <Routes />
      </SuspenseWithPerf>
    </Router>
  );
};

export default App;
