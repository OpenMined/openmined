import React, { useState, useLayoutEffect } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import {
  preloadAuth,
  preloadFirestore,
  preloadFunctions,
  useFirebaseApp,
} from 'reactfire';

import Routes from './routes';

import Loading from './components/Loading';

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
        initalizedStore.settings({ host: 'localhost:5502', ssl: false });
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

const App = () => {
  const [action, setAction] = useState(history.action);
  const [location, setLocation] = useState(history.location);

  useLayoutEffect(() => {
    history.listen(({ location, action }) => {
      setLocation(location);
      setAction(action);
    });
  }, []);

  // const firebaseApp = useFirebaseApp();

  // if (process.env.NODE_ENV === 'development') {
  //   preloadSDKs(firebaseApp);
  // }

  return (
    <Router action={action} location={location} navigator={history}>
      <SuspenseWithPerf fallback={<Loading />} traceId={location.pathname}>
        <Routes />
      </SuspenseWithPerf>
    </Router>
  );
};

export default App;
