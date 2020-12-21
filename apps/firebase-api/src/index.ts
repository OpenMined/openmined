// SEE TODO #14
// SEE TODO #15

import * as functions from 'firebase-functions';

// import ssr from './app/ssr';
import { assignReview, resignReview } from './app/review';
import sanity from './app/sanity';

// Pick review for assignment or resign from a review
exports.assignReview = functions
  .region('europe-west1')
  .https.onCall(assignReview);
exports.resignReview = functions
  .region('europe-west1')
  .https.onCall(resignReview);

// Set up Sanity API requests
exports.sanity = functions.region('europe-west1').https.onCall(sanity);

// SEE TODO #16
exports.createUser = functions
  .region('europe-west1')
  .firestore.document('users/{userId}')
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = snap.data();

    // access a particular field as you would any JS property
    const name = newValue.name + 1;

    // perform desired operations ...
  });

// SEE TODO #13
// exports.ssr = functions.region('europe-west1').https.onRequest(ssr);
