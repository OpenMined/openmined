import * as firebase from '@firebase/rules-unit-testing';

import {
  PROJECT_ID,
  getAuthedFirestore,
  loadFirebaseRules,
  afterAllTests,
  getCourseDocRef,
} from './utils';

const ALICE_ID = 'alice';
const BOB_ID = 'bob';
const RANDOM_COURSE_ID = 'random_course';

describe.only('users/{{userID}}/courses/{{courseId}}', () => {
  beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId: PROJECT_ID });
  });

  it('Only owner can read/write', async () => {
    // alice can read/write
    const aliceDb = getAuthedFirestore({ uid: ALICE_ID });
    const courseData = { started_at: new Date() };
    await firebase.assertSucceeds(
      getCourseDocRef(aliceDb, ALICE_ID, RANDOM_COURSE_ID).set(courseData)
    );
    await firebase.assertSucceeds(
      getCourseDocRef(aliceDb, ALICE_ID, RANDOM_COURSE_ID).get()
    );

    // others cannot read/write
    const anyoneDb = getAuthedFirestore(null);
    await firebase.assertFails(
      getCourseDocRef(anyoneDb, ALICE_ID, RANDOM_COURSE_ID).get()
    );
    await firebase.assertFails(
      getCourseDocRef(anyoneDb, ALICE_ID, RANDOM_COURSE_ID).set(courseData)
    );
  });
});
