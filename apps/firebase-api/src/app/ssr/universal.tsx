import path from 'path';
import fs from 'fs';
import * as firebase from 'firebase';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

import { Route, Routes } from 'react-router-dom';
// import { SuspenseWithPerf } from 'reactfire';
// import Loading from '';

import { FirebaseAppProvider } from 'reactfire';
import { HelmetProvider } from 'react-helmet-async';
import { ChakraProvider } from '@chakra-ui/react';
import { SEOProvider } from '@openmined/shared/util-page';

import theme from '../../../../courses/src/theme';

import seoMain from '../../../../courses/src/assets/seo-main.jpg';
import seoFacebook from '../../../../courses/src/assets/seo-facebook.jpg';
import seoTwitter from '../../../../courses/src/assets/seo-twitter.jpg';

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

import Homepage from '../../../../courses/src/routes/homepage';
import ErrorBoundaryWrapper from '../../../../courses/src/components/ErrorBoundaryWrapper';


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

export const WrappedApp = ({ children }) => (
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <HelmetProvider>
        <ChakraProvider theme={theme}>
          <SEOProvider metadata={metadata}>
            <ErrorBoundaryWrapper>{children}</ErrorBoundaryWrapper>
          </SEOProvider>
        </ChakraProvider>
      </HelmetProvider>
    </FirebaseAppProvider>
  </React.StrictMode>
);

const renderMarkup = (req) => {
  try {
    global.window = {
      location: {
        origin: ''
      }
    }
    const markup = renderToString(
      <WrappedApp>
        <StaticRouter location={req.url}>
          <Routes>
            <Route path="/" element={<Homepage />} />
          </Routes>
        </StaticRouter>
      </WrappedApp>
    );

    return markup;
  } catch (err) {
    console.log('error while rendering')
    console.log(err)
  }
};

export default (req, res) => {
  const filePath = path.join(__dirname, '../courses/index.html');
  try {
    const indexHtml = fs.readFileSync(filePath, { encoding: 'utf8' });

    const markup = renderMarkup(req);

    const finalHtml = indexHtml.replace('{{SSR}}', markup);
    res.send(finalHtml);
  } catch (err) {
    return res.status(404).end();
  }
};
