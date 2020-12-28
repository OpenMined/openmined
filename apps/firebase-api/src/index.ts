// SEE TODO (#14)
// SEE TODO (#15)

import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

admin.initializeApp();

// import ssr from './app/ssr';
import {
  assignReview,
  resignReview,
  checkForUnreviewedSubmissions,
} from './app/review';
import { completeCourse } from './app/courses';
import { sendEmail } from './app/email';
import sanity from './app/sanity';

// Pick review for assignment or resign from a review
exports.assignReview = functions
  .region('europe-west1')
  .https.onCall(assignReview);
exports.resignReview = functions
  .region('europe-west1')
  .https.onCall(resignReview);

// Check for all unreviewed (and late) submissions and reassign them
exports.checkForUnreviewedSubmissions = functions
  .region('europe-west1')
  .pubsub.schedule('every 30 minutes')
  .onRun(checkForUnreviewedSubmissions);

// Complete a course
exports.completeCourse = functions
  .region('europe-west1')
  .https.onCall(completeCourse);

// Send the user an email when they sign up
exports.sendWelcomeEmail = functions
  .region('europe-west1')
  .auth.user()
  .onCreate((user) => {
    sendEmail('createAccount', user.email, { user });
  });

// Send the user an email when they delete their account
exports.sendByeEmail = functions
  .region('europe-west1')
  .auth.user()
  .onDelete((user) => {
    sendEmail('deleteAccount', user.email, { user });
  });

// Send the user an email when they start a course
exports.startCourse = functions
  .region('europe-west1')
  .firestore.document('users/{userId}/courses/{courseId}')
  .onCreate((snap, context) => {
    admin
      .auth()
      .getUser(context.params.userId)
      .then((user) => {
        sendEmail('startCourse', user.email, { data: snap.data() });
      });
  });

// Send the user an email when they receive a project review
exports.receiveReview = functions
  .region('europe-west1')
  .firestore.document(
    'users/{userId}/courses/{courseId}/submissions/{submissionId}'
  )
  .onUpdate((change, context) => {
    const newData = change.after.data();

    if (newData.review_content && newData.status) {
      admin
        .auth()
        .getUser(context.params.userId)
        .then((user) => {
          if (newData.status === 'passed') {
            sendEmail('receivePassedReview', user.email, { data: newData });
          } else if (newData.status === 'failed') {
            sendEmail('receiveFailedReview', user.email, { data: newData });
          }
        });
    }
  });

// Set up Sanity API requests
exports.sanity = functions.region('europe-west1').https.onCall(sanity);

// SEE TODO (#16)
// exports.createUser = functions
//   .region('europe-west1')
//   .firestore.document('users/{userId}')
//   .onCreate((snap, context) => {
//     // Get an object representing the document
//     // e.g. {'name': 'Marie', 'age': 66}
//     const newValue = snap.data();

//     // access a particular field as you would any JS property
//     const name = newValue.name + 1;

//     // perform desired operations ...
//   });

// SEE TODO (#13)
// exports.ssr = functions.region('europe-west1').https.onRequest(ssr);
