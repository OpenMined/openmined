import React, { useEffect } from 'react';
import {
  preloadAuth,
  preloadFirestore,
  preloadFunctions,
  useFirebaseApp,
  useFirestore,
} from 'reactfire';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

import Loading from './components/Loading';

import { SuspenseWithPerf } from 'reactfire';
import useToast, { toastConfig } from './components/Toast';


export const Firebase = () => {
  const firestore = useFirestore();
  const toast = useToast();

  useEffect(() => {
    try {
      firestore.enablePersistence({ synchronizeTabs: true }).catch((error) => {
        if (error.code === 'failed-precondition') {
          toast({
            ...toastConfig,
            title: 'Error',
            description: error.message,
            status: 'error',
          });
        } else if (error.code === 'unimplemented') {
          toast({
            ...toastConfig,
            title: 'Error',
            description:
              'This browser is not fully compatible with offline mode. While you do not have to, we suggest you use a different browser.',
            status: 'error',
          });
        } else {
          toast({
            ...toastConfig,
            title: 'Error',
            description: error.message,
            status: 'error',
          });
        }
      });
    } catch (error) {
      toast({
        ...toastConfig,
        title: 'Error',
        description: error.message,
        status: 'error',
      });
    }
  }, []);

  return null;
};

// const preloadSDKs = (firebaseApp) => {
//   Promise.all([
//     preloadAuth({
//       firebaseApp,
//       setup: (auth) => {
//         auth().useEmulator('http://localhost:5500/');
//       },
//     }),
//     preloadFunctions({
//       firebaseApp,
//       setup: (functions) => {
//         functions().useFunctionsEmulator('http://localhost:5501');
//       },
//     }),
//     preloadFirestore({
//       firebaseApp,
//       setup: (firestore) => {
//         const initalizedStore = firestore();
//         initalizedStore.settings({
//           host: 'localhost:5502',
//           ssl: false,
//           experimentalForceLongPolling: true,
//         });
//         firestore().enablePersistence({ experimentalForceOwningTab: true });
//       },
//     }),
//     // TODO: Create a bucket for dev purposes only
//     //
//     // preloadStorage({
//     //   firebaseApp,
//     //   setup: (storage) => {
//     //     storage('gs://put-a-bucket-here');
//     //   },
//     // }),
//   ]);
// };

// const App = () => {
//   const [action, setAction] = useState(history.action);
//   const [location, setLocation] = useState(history.location);

//   useLayoutEffect(() => {
//     history.listen(({ location, action }) => {
//       setLocation(location);
//       setAction(action);
//     });
//   }, []);

//   const firebaseApp = useFirebaseApp();

//   // @ts-ignore
//   if (window.Cypress) {
//     preloadSDKs(firebaseApp);
//   }

//   return (
//     <Router action={action} location={location} navigator={history}>
//       <SuspenseWithPerf fallback={<Loading />} traceId={location.pathname}>
//         <Firebase />
//         <Routes />
//       </SuspenseWithPerf>
//     </Router>
//   );
// };

// export default App;
