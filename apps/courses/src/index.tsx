import React from 'react';
import { render } from 'react-dom';
import { FirebaseAppProvider } from 'reactfire';
import { SanityProvider } from '@openmined/shared/data-access-sanity';
import { HelmetProvider } from 'react-helmet-async';
import { ChakraProvider } from '@chakra-ui/react';
import { SEOProvider } from '@openmined/shared/util-page';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import ErrorBoundaryWrapper from './components/ErrorBoundaryWrapper';

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

const sanityConfig = {
  projectId: process.env.NX_SANITY_COURSES_PROJECT_ID,
  dataset: process.env.NX_SANITY_COURSES_DATASET,
  useCdn: true,
};

const metadata = {
  name: 'OpenMined Courses',
  short_name: 'OpenMined Courses',
  description:
    'OpenMined Courses is your home for free courses on privacy-preserving artificial intelligence.',
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
              <ErrorBoundaryWrapper>
                <App />
              </ErrorBoundaryWrapper>
            </SEOProvider>
          </ChakraProvider>
        </HelmetProvider>
      </SanityProvider>
    </FirebaseAppProvider>
  </React.StrictMode>
);

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn:
      'https://3a0a3cc70179428f8ecda14adc0bb149@o492939.ingest.sentry.io/5561166',
    autoSessionTracking: true,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
  });
}

if (process.env.NODE_ENV !== 'test') {
  render(<WrappedApp />, root);
}
