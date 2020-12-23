import * as firebase from '@firebase/rules-unit-testing';
import http from 'http';
import fs from 'fs';

import path from 'path';

export const PROJECT_ID = 'firestore-emulator-example';

export const COVERAGE_URL = `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}:ruleCoverage.html`;

export const getAuthedFirestore = (auth) => {
  return firebase
    .initializeTestApp({ projectId: PROJECT_ID, auth })
    .firestore();
};
export const getAdminFirestore = () => {
  return firebase.initializeAdminApp({ projectId: PROJECT_ID }).firestore();
};

export const loadFirebaseRules = async () => {
  const rules = fs.readFileSync(
    path.join(__dirname, '../firestore.rules'),
    'utf8'
  );
  await firebase.loadFirestoreRules({ projectId: PROJECT_ID, rules });
};

export const afterAllTests = async () => {
  await Promise.all(firebase.apps().map((app) => app.delete()));

  const coverageFile = path.join(__dirname, '../firestore-coverage.html');
  const fstream = fs.createWriteStream(coverageFile);
  await new Promise((resolve, reject) => {
    http.get(COVERAGE_URL, (res) => {
      res.pipe(fstream, { end: true });

      res.on('end', resolve);
      res.on('error', reject);
    });
  });

  console.log(`View firestore rule coverage information at ${coverageFile}\n`);
};

export const getUserRef = (db, userId) => db.collection('users').doc(userId);

export const getCourseRef = (db, userId, courseId) =>
  db.collection('users').doc(userId).collection('courses').doc(courseId);

export const getUserReviewRef = (db, userId, reviewId) =>
  db.collection('users').doc(userId).collection('reviews').doc(reviewId);

export const getUserSubmissionRef = (db, userId, courseId, submissionId) =>
  db
    .collection('users')
    .doc(userId)
    .collection('courses')
    .doc(courseId)
    .collection('submissions')
    .doc(submissionId);

export const updateUser = (userId, data) =>
  getUserRef(getAdminFirestore(), userId).update(data, { merge: true });
