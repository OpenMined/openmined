import * as firebase from '@firebase/rules-unit-testing';

import {
  PROJECT_ID,
  getAuthedFirestore,
  updateUser,
  getUserRef,
} from './utils';

import { getUserSubmissionRef } from './utils';

const ALICE_ID = 'alice';
const BOB_ID = 'bob';
const DAN_ID = 'dan';
const RANDOM_SUBMISSION_ID = 'random_review';
const COURSE_A = 'course_a';
const COURSE_B = 'course_b';

describe('users/{{userID}}/courses/{{courseId}}/submissions/{{submissionId}}', () => {
  beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId: PROJECT_ID });
  });

  it('create', async () => {
    // bob is mentor of course_a
    await updateUser(BOB_ID, {
      is_mentor: true,
      mentorable_courses: [COURSE_A],
    });

    // alice can create
    const aliceDb = getAuthedFirestore({ uid: ALICE_ID });
    await firebase.assertSucceeds(
      getUserSubmissionRef(aliceDb, ALICE_ID, COURSE_A, RANDOM_SUBMISSION_ID).set({ new: true })
    );

    // others cannot create
    const anyoneDb = getAuthedFirestore(null);
    await firebase.assertFails(
      getUserSubmissionRef(anyoneDb, ALICE_ID, COURSE_A, RANDOM_SUBMISSION_ID).set({ new: false })
    );

    // bob cannot create
    const bobDb = getAuthedFirestore({ uid: BOB_ID });
    await firebase.assertFails(
      getUserSubmissionRef(bobDb, ALICE_ID, COURSE_A, RANDOM_SUBMISSION_ID).set({ new: false })
    );
  });

  it('read: mentors or owner can read', async () => {
    // bob is mentor of course_a
    await updateUser(BOB_ID, {
      is_mentor: true,
      mentorable_courses: [COURSE_A],
    });
    // dan is mentor of course_b
    await updateUser(DAN_ID, {
      is_mentor: true,
      mentorable_courses: [COURSE_B],
    });

    // alice can get
    const aliceDb = getAuthedFirestore({ uid: ALICE_ID });
    await firebase.assertSucceeds(
      getUserSubmissionRef(aliceDb, ALICE_ID, COURSE_A, RANDOM_SUBMISSION_ID).set({
        new: true,
        mentor: getUserRef(aliceDb, BOB_ID),
      })
    );
    await firebase.assertSucceeds(
      getUserSubmissionRef(aliceDb, ALICE_ID, COURSE_A, RANDOM_SUBMISSION_ID).get()
    );

    // others cannot get
    const anyoneDb = getAuthedFirestore(null);
    await firebase.assertFails(
      getUserSubmissionRef(anyoneDb, ALICE_ID, COURSE_A, RANDOM_SUBMISSION_ID).get()
    );

    // bob can get: since he is mentor of RANDOM_SUBMISSION_ID
    const bobDb = getAuthedFirestore({ uid: BOB_ID });
    await firebase.assertSucceeds(
      getUserSubmissionRef(bobDb, ALICE_ID, COURSE_A, RANDOM_SUBMISSION_ID).get()
    );

    // but dan who is mentor but he cannot get it
    const danDb = getAuthedFirestore({ uid: DAN_ID });
    await firebase.assertFails(
      getUserSubmissionRef(danDb, ALICE_ID, COURSE_A, RANDOM_SUBMISSION_ID).get()
    );
  });

  it('update: only mentors can update', async () => {
    // bob is mentor of course_a
    await updateUser(BOB_ID, {
      is_mentor: true,
      mentorable_courses: [COURSE_A],
    });
    // dan is mentor of course_b
    await updateUser(DAN_ID, {
      is_mentor: true,
      mentorable_courses: [COURSE_B],
    });

    // alice cannot update
    const aliceDb = getAuthedFirestore({ uid: ALICE_ID });
    await firebase.assertSucceeds(
      getUserSubmissionRef(aliceDb, ALICE_ID, COURSE_A, RANDOM_SUBMISSION_ID).set({
        new: true,
        mentor: getUserRef(aliceDb, BOB_ID),
      })
    );
    await firebase.assertFails(
      getUserSubmissionRef(aliceDb, ALICE_ID, COURSE_A, RANDOM_SUBMISSION_ID).update({ update: 'new' }, { merge: true })
    );

    // others cannot update
    const anyoneDb = getAuthedFirestore(null);
    await firebase.assertFails(
      getUserSubmissionRef(anyoneDb, ALICE_ID, COURSE_A, RANDOM_SUBMISSION_ID).update({ update: 'new' }, { merge: true })
    );

    // bob can update: since he is mentor of RANDOM_SUBMISSION_ID
    const bobDb = getAuthedFirestore({ uid: BOB_ID });
    await firebase.assertSucceeds(
      getUserSubmissionRef(bobDb, ALICE_ID, COURSE_A, RANDOM_SUBMISSION_ID).update({ update: 'new' }, { merge: true })
    );

    // but dan who is mentor but he cannot update it
    const danDb = getAuthedFirestore({ uid: DAN_ID });
    await firebase.assertFails(
      getUserSubmissionRef(danDb, ALICE_ID, COURSE_A, RANDOM_SUBMISSION_ID).update({ update: 'new' }, { merge: true })
    );
  });

  it('delete: nobody can delete', async () => {
    // bob is mentor of course_a
    await updateUser(BOB_ID, {
      is_mentor: true,
      mentorable_courses: [COURSE_A],
    });
    // dan is mentor of course_b
    await updateUser(DAN_ID, {
      is_mentor: true,
      mentorable_courses: [COURSE_B],
    });

    // alice cannot delete
    const aliceDb = getAuthedFirestore({ uid: ALICE_ID });
    await firebase.assertSucceeds(
      getUserSubmissionRef(aliceDb, ALICE_ID, COURSE_A, RANDOM_SUBMISSION_ID).set({
        new: true,
        mentor: getUserRef(aliceDb, BOB_ID),
      })
    );
    await firebase.assertFails(
      getUserSubmissionRef(aliceDb, ALICE_ID, COURSE_A, RANDOM_SUBMISSION_ID).delete()
    );

    // others cannot delete
    const anyoneDb = getAuthedFirestore(null);
    await firebase.assertFails(
      getUserSubmissionRef(anyoneDb, ALICE_ID, COURSE_A, RANDOM_SUBMISSION_ID).delete()
    );

    // bob cannot delete
    const bobDb = getAuthedFirestore({ uid: BOB_ID });
    await firebase.assertFails(
      getUserSubmissionRef(bobDb, ALICE_ID, COURSE_A, RANDOM_SUBMISSION_ID).delete()
    );

    // dan cannot update it
    const danDb = getAuthedFirestore({ uid: DAN_ID });
    await firebase.assertFails(
      getUserSubmissionRef(danDb, ALICE_ID, COURSE_A, RANDOM_SUBMISSION_ID).delete()
    );
  });
});
