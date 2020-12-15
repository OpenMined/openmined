import React from 'react';
// TODO: Fix the below
// @ts-ignore
import { unstable_createRoot } from 'react-dom';
import { FirebaseAppProvider } from 'reactfire';
import { SanityProvider } from '@openmined/shared/data-access-sanity';
import { HelmetProvider } from 'react-helmet-async';
import { ChakraProvider } from '@chakra-ui/react';
import { SEOProvider } from '@openmined/shared/util-page';

import theme from './theme';
import App from './App';

import seoMain from './assets/seo-main.jpg';
import seoFacebook from './assets/seo-facebook.jpg';
import seoTwitter from './assets/seo-twitter.jpg';

// HIGH-LEVEL ISSUES GO HERE
// TODO: We need to fix ALL Typescript issues. There's a PR for that, but I don't think it's very good. Could maybe use some of it and then fix the remaining issues manually: https://github.com/OpenMined/openmined/pull/15
// TODO: We need to fix ALL instances where we're using @ts-ignore
// TODO: Make sure all Firebase calls (which you can find by project searching for "db.") have appropriate error handling, only some of the original logic I wrote does... not all calls will properly toast the error
// TODO: Set up remote logging and bug reporting in Firebase so that we can track the errors that users are getting (we should make sure to also do this for all Firebase and Sanity CMS calls)
// TODO: Add error boundaries to React app to catch errors, handle them gracefully, and report them to the appropriate service (see last todo item above)
// TODO: Create a link props method to determine internal vs. external links (make sure to replace this everywhere sitewide)
// TODO: Go through each page and test them for responsiveness, fixing any issues along the way. We KNOW that there will be problems on the following pages: project, project-complete, course-complete
// TODO: Refactor all of the "complete" pages to share a bunch of logic, because they all basically look the same
// TODO: We need to set up better Firebase performance logging to see what calls and page loads are taking the most time
// TODO: Let's get the deployment working on the dev branch again... because of Typescript errors this hasn't been working in a while because our CI/CD won't pass
// TODO: Make the feedback a subcollection under the course, not at the same level as "courses". Likewise, be sure to store the ID of the thing they're talking about!
// TODO: Create a sidebar component for use on a few pages (ask Patrick)
// TODO: Add a ton of security rules (work with Patrick on an exhaustive list of rules to write)
// TODO: Write tests for all security rules (make sure to use the emulator!)
// TODO: Research ways to tighten security for Sanity API, ensuring that users cannot use it to cheat or view unreleased course materials
// TODO: Hericles - Add a ton of Cypress tests
// TODO: Patrick - Remember to revisit the header title and such once you get the CMS plugged in
// TODO: Patrick - Add the submission alert dialogs to the project page
// TODO: Patrick - build the My Courses page (maybe don't even worry about the existing PR) and rename it Dashboard everywhere
// TODO: Patrick - build the notifications drawer and mentorship dashboard toggle
// TODO: Patrick - build the mentorship dashboard
// TODO: Patrick - go back to relevant pages and add in functionality retroactively for course project, lesson completion, overview, profile, my courses, and search pages
// TODO: Patrick - place all Firebase calls related to courses in the same file and then use them throughout the various pages... this will make this logic more testable in conjunction with the helpers file
// TODO: Patrick - build Typescript interfaces for the course and use them throughout the various Firebase API calls file (see above), helpers file, and various views
// TODO: Patrick - make an "intro to the CMS" video to give to Mat, Andrew, and Emma (and make sure to explain that filling in EVERY field is critical - if they can't fill in some, tell them to ask Patrick what to do)
// TODO: Patrick - go back through the designs and make sure things are as accurate as possible, get final approval from Kyoko

/*
NOTE ABOUT FIREBASE DATA MODEL
The following is the theoretical, and incomplete, data structure for the user's model in Firestore as it pertains to submissions and reviews:

STUDENT:
- C: courses
  - D: [course]
    - C: submissions
      - D: [submission]
        - course
        - part
        - attempt
        - content (submission content)
        - submitted_at
        - REF: student
    - started_at
    - completed_at
    - project
      - started_at
      - completed_at
      - status
      - parts
        - [part]
          - started_at
          - completed_at
          - status
          - submissions: [
            - submitted_at
            - REF: submission
          ]
          - reviews: [
            - reviewed_at
            - status
            - REF: review
          ]

REVIEWER:
- C: courses
  - D: [course]
    - C: reviews
      - D: [review]
        - course
        - part
        - status
        - content (review content)
        - submitted_at (submission creation time)
        - started_at (review started time)
        - ended_at (review ended time)
        - REF: student
        - REF: submission
*/

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
  projectId: process.env.NX_SANITY_COURSES_PROJECT_ID,
  dataset: process.env.NX_SANITY_COURSES_DATASET,
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
