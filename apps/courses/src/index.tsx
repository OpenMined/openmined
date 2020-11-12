import React from 'react';
// TODO: Fix the below
// @ts-ignore
import { unstable_createRoot } from 'react-dom';
import { FirebaseAppProvider } from 'reactfire';
import { HelmetProvider } from 'react-helmet-async';
import { ChakraProvider } from '@chakra-ui/core';
import { SEOProvider } from '@openmined/shared/util-page';

import theme from './theme';
import App from './App';

import seoMain from './assets/seo-main.jpg';
import seoFacebook from './assets/seo-facebook.jpg';
import seoTwitter from './assets/seo-twitter.jpg';

const firebaseConfig = {
  apiKey: process.env.NX_FIREBASE_API_KEY,
  authDomain: process.env.NX_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NX_FIREBASE_DATABASE_URL,
  projectId: process.env.NX_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NX_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NX_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NX_FIREBASE_APP_ID,
  measurementId: process.env.NX_FIREBASE_MEASUREMENT_ID,
};

const metadata = {
  name: process.env.NX_NAME,
  short_name: process.env.NX_SHORT_NAME,
  description: process.env.NX_DESCRIPTION,
  images: {
    main: seoMain,
    facebook: seoFacebook,
    twitter: seoTwitter,
  },
};

const root = document.getElementById('root');

export const WrappedApp = () => (
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <HelmetProvider>
        <ChakraProvider theme={theme}>
          <SEOProvider metadata={metadata}>
            <App />
          </SEOProvider>
        </ChakraProvider>
      </HelmetProvider>
    </FirebaseAppProvider>
  </React.StrictMode>
);

// Experimental concurrence mode in React
unstable_createRoot(root).render(<WrappedApp />);
