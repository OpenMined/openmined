import * as firebase from '@firebase/rules-unit-testing';

import {
  PROJECT_ID,
  getAuthedFirestore,
  updateUser,
} from './utils';

import { getUserReviewRef } from './utils';

const ALICE_ID = 'alice';
const BOB_ID = 'bob';
const RANDOM_REVIEW_ID = 'random_review';
const COURSE_A = 'course_a';
const COURSE_B = 'course_b';

describe('users/{{userID}}/reviews/{{reviewId}}', () => {
  beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId: PROJECT_ID });
  });

  it('create, read', async () => {
    // alice is mentor of course_a
    await updateUser(ALICE_ID, {
      is_mentor: true,
      mentorable_courses: [COURSE_A],
    });

    // alice can read/write
    const aliceDb = getAuthedFirestore({ uid: ALICE_ID });
    const reviewData = { course: COURSE_A };
    await firebase.assertSucceeds(
      getUserReviewRef(aliceDb, ALICE_ID, RANDOM_REVIEW_ID).set(reviewData)
    );
    await firebase.assertSucceeds(
      getUserReviewRef(aliceDb, ALICE_ID, RANDOM_REVIEW_ID).get()
    );

    // alice cannot review on COURSE_B
    const forceReviewCourseB = { course: COURSE_B }
    const ANOTHER_REVIEW_ID = 'another_review_id'
    await firebase.assertFails(
      getUserReviewRef(aliceDb, ALICE_ID, ANOTHER_REVIEW_ID).set(forceReviewCourseB)
    );

    // others cannot read/write
    const anyoneDb = getAuthedFirestore(null);
    await firebase.assertFails(
      getUserReviewRef(anyoneDb, ALICE_ID, RANDOM_REVIEW_ID).get()
    );
    await firebase.assertFails(
      getUserReviewRef(anyoneDb, ALICE_ID, RANDOM_REVIEW_ID).set(reviewData)
    );

    // bob cannot read/write alice course doc
    const bobDb = getAuthedFirestore({ uid: BOB_ID });
    await firebase.assertFails(
      getUserReviewRef(bobDb, ALICE_ID, RANDOM_REVIEW_ID).get()
    );
    await firebase.assertFails(
      getUserReviewRef(bobDb, ALICE_ID, RANDOM_REVIEW_ID).set(reviewData)
    );
  });


  it('update: Students who are also mentors can update \'status\' and \'completed_at\'', async () => {
    // alice is mentor of course_a
    await updateUser(ALICE_ID, {
      is_mentor: true,
      mentorable_courses: [COURSE_A],
    });

    // alice can read/write
    const aliceDb = getAuthedFirestore({ uid: ALICE_ID });
    const reviewData = { course: COURSE_A };
    await firebase.assertSucceeds(
      getUserReviewRef(aliceDb, ALICE_ID, RANDOM_REVIEW_ID).set(reviewData)
    );

    // alice can update status and completed_at
    await firebase.assertSucceeds(
      getUserReviewRef(aliceDb, ALICE_ID, RANDOM_REVIEW_ID).update({
        status: 'passed',
        completed_at: new Date(),
      }, { merge: true })
    );

    // alice cannot update other fields
    await firebase.assertFails(
      getUserReviewRef(aliceDb, ALICE_ID, RANDOM_REVIEW_ID).update({
        course: 'another_course',
      }, { merge: true })
    );
  });

  it('delete', async () => {
    // alice is mentor of course_a
    await updateUser(ALICE_ID, {
      is_mentor: true,
      mentorable_courses: [COURSE_A],
    });

    // alice can read/write
    const aliceDb = getAuthedFirestore({ uid: ALICE_ID });
    const reviewData = { course: COURSE_A };
    await firebase.assertSucceeds(
      getUserReviewRef(aliceDb, ALICE_ID, RANDOM_REVIEW_ID).set(reviewData)
    );

    // alice cannot delete the review
    await firebase.assertFails(
      getUserReviewRef(aliceDb, ALICE_ID, RANDOM_REVIEW_ID).delete()
    );

    // others cannot delete
    const anyoneDb = getAuthedFirestore(null);
    await firebase.assertFails(
      getUserReviewRef(anyoneDb, ALICE_ID, RANDOM_REVIEW_ID).delete()
    );

    // bob cannot delete
    const bobDb = getAuthedFirestore({ uid: BOB_ID });
    await firebase.assertFails(
      getUserReviewRef(bobDb, ALICE_ID, RANDOM_REVIEW_ID).delete()
    );
  });
});
