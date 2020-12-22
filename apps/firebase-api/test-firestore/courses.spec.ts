import * as firebase from '@firebase/rules-unit-testing';

import {
  PROJECT_ID,
  getAuthedFirestore,
} from './utils';

import { getCourseRef } from './utils';

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
      getCourseRef(aliceDb, ALICE_ID, RANDOM_COURSE_ID).set(courseData)
    );
    await firebase.assertSucceeds(
      getCourseRef(aliceDb, ALICE_ID, RANDOM_COURSE_ID).get()
    );

    // others cannot read/write
    const anyoneDb = getAuthedFirestore(null);
    await firebase.assertFails(
      getCourseRef(anyoneDb, ALICE_ID, RANDOM_COURSE_ID).get()
    );
    await firebase.assertFails(
      getCourseRef(anyoneDb, ALICE_ID, RANDOM_COURSE_ID).set(courseData)
    );

    // bob cannot read/write alice course doc
    const bobDb = getAuthedFirestore({ uid: BOB_ID });
    await firebase.assertFails(
      getCourseRef(bobDb, ALICE_ID, RANDOM_COURSE_ID).get()
    );
    await firebase.assertFails(
      getCourseRef(bobDb, ALICE_ID, RANDOM_COURSE_ID).set(courseData)
    );
  });
});
