import path from 'path';
import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import * as dotenv from 'dotenv-flow';

const envs = [
  path.resolve(process.cwd(), '.secret.env'),
  path.resolve(process.cwd(), '.env'),
];

if (process.env.NODE_ENV === 'development') {
  envs.push(path.resolve(process.cwd(), '.local.env'));
}

dotenv.load(envs);
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
import { addUniqueNumberToUser } from './app/users';

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

// Add unique number to each user
exports.addUniqueNumberToUser = functions
  .region('europe-west1')
  .auth.user()
  .onCreate(addUniqueNumberToUser);

// Send the user an email when they sign up
exports.sendWelcomeEmail = functions
  .region('europe-west1')
  .auth.user()
  .onCreate((user) => sendEmail('createAccount', user.email, { user }));

// Send the user an email when they delete their account
exports.sendByeEmail = functions
  .region('europe-west1')
  .auth.user()
  .onDelete((user) => sendEmail('deleteAccount', user.email, { user }));

// Send the user an email when they start a course
exports.startCourse = functions
  .region('europe-west1')
  .firestore.document('users/{userId}/courses/{courseId}')
  .onCreate(async (snap, context) => {
    await admin
      .auth()
      .getUser(context.params.userId)
      .then((user) => {
        return sendEmail('startCourse', user.email, { data: snap.data() });
      });
  });

// Send the user an email when they receive a project review
exports.receiveReview = functions
  .region('europe-west1')
  .firestore.document(
    'users/{userId}/courses/{courseId}/submissions/{submissionId}'
  )
  .onUpdate(async (change, context) => {
    const oldData = change.before.data();
    const newData = change.after.data();

    if (
      !oldData.review_content &&
      !oldData.status &&
      newData.review_content &&
      newData.status
    ) {
      await admin
        .auth()
        .getUser(context.params.userId)
        .then(async (user) => {
          const dbUser = await admin
            .firestore()
            .collection('users')
            .doc(context.params.userId)
            .get();
          const dbUserData = dbUser.data();

          if (
            !dbUserData.notification_preferences ||
            (dbUserData.notification_preferences &&
              dbUserData.notification_preferences.includes('project_reviews'))
          ) {
            if (newData.status === 'passed') {
              return sendEmail('receivePassedReview', user.email, {
                data: newData,
              });
            } else if (newData.status === 'failed') {
              return sendEmail('receiveFailedReview', user.email, {
                data: newData,
              });
            }
          } else {
            return { status: 'Filter not met' };
          }
        });
    }

    return { status: 'Filter not met' };
  });

// Set up Sanity API requests
exports.sanity = functions.region('europe-west1').https.onCall(sanity);

// TODO: https://github.com/OpenMined/openmined/issues/52
// exports.ssr = functions.region('europe-west1').https.onRequest(ssr);
