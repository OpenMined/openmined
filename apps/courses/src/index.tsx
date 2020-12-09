import React from 'react';
// TODO: Fix the below
// @ts-ignore
import { unstable_createRoot } from 'react-dom';
import { FirebaseAppProvider } from 'reactfire';
import { SanityProvider } from '@openmined/shared/data-access-sanity';
import { HelmetProvider } from 'react-helmet-async';
import { ChakraProvider } from '@chakra-ui/core';
import { SEOProvider } from '@openmined/shared/util-page';

import theme from './theme';
import App from './App';

import seoMain from './assets/seo-main.jpg';
import seoFacebook from './assets/seo-facebook.jpg';
import seoTwitter from './assets/seo-twitter.jpg';

const firebaseConfig =
  process.env.NODE_ENV === 'production'
    ? {
        apiKey: process.env.NX_FIREBASE_PROD_API_KEY,
        authDomain: process.env.NX_FIREBASE_PROD_AUTH_DOMAIN,
        databaseURL: process.env.NX_FIREBASE_PROD_DATABASE_URL,
        projectId: process.env.NX_FIREBASE_PROD_PROJECT_ID,
        storageBucket: process.env.NX_FIREBASE_PROD_STORAGE_BUCKET,
        messagingSenderId: process.env.NX_FIREBASE_PROD_MESSAGING_SENDER_ID,
        appId: process.env.NX_FIREBASE_PROD_APP_ID,
        measurementId: process.env.NX_FIREBASE_PROD_MEASUREMENT_ID,
      }
    : {
        apiKey: process.env.NX_FIREBASE_DEV_API_KEY,
        authDomain: process.env.NX_FIREBASE_DEV_AUTH_DOMAIN,
        databaseURL: process.env.NX_FIREBASE_DEV_DATABASE_URL,
        projectId: process.env.NX_FIREBASE_DEV_PROJECT_ID,
        storageBucket: process.env.NX_FIREBASE_DEV_STORAGE_BUCKET,
        messagingSenderId: process.env.NX_FIREBASE_DEV_MESSAGING_SENDER_ID,
        appId: process.env.NX_FIREBASE_DEV_APP_ID,
        measurementId: process.env.NX_FIREBASE_DEV_MEASUREMENT_ID,
      };

const sanityConfig = {
  projectId: process.env.NX_SANITY_PROJECT_ID,
  dataset: process.env.NX_SANITY_DATASET,
  useCdn: true,
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
      <SanityProvider sanityConfig={sanityConfig}>
        <HelmetProvider>
          <ChakraProvider theme={theme}>
            <SEOProvider metadata={metadata}>
              <App />
            </SEOProvider>
          </ChakraProvider>
        </HelmetProvider>
      </SanityProvider>
    </FirebaseAppProvider>
  </React.StrictMode>
);

if (process.env.NODE_ENV !== 'test') {
  // Experimental concurrence mode in React
  unstable_createRoot(root).render(<WrappedApp />);
}
