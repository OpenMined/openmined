import * as firebase from '@firebase/rules-unit-testing';

import {
  PROJECT_ID,
  getAuthedFirestore,
  updateUser,
  getUserReviewRef,
} from './utils';

const ALICE_ID = 'alice';
const BOB_ID = 'bob';
const DAN_ID = 'dan';
const RANDOM_REVIEW_ID = 'random_review';
const COURSE_A = 'course_a';
const COURSE_B = 'course_b';

describe('users/{{userID}}/reviews/{{reviewId}}', () => {
  beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId: PROJECT_ID });
  });

  it('create, read', async () => {
    // bob is mentor of course_a
    await updateUser(BOB_ID, {
      is_mentor: true,
      mentorable_courses: [COURSE_A],
    });

    // bob can read/write
    const bobDb = getAuthedFirestore({ uid: BOB_ID });
    const reviewData = { course: COURSE_A };
    await firebase.assertSucceeds(
      getUserReviewRef(bobDb, BOB_ID, RANDOM_REVIEW_ID).set(reviewData)
    );
    await firebase.assertSucceeds(
      getUserReviewRef(bobDb, BOB_ID, RANDOM_REVIEW_ID).get()
    );

    // bob cannot review on COURSE_B
    const forceReviewCourseB = { course: COURSE_B };
    const ANOTHER_REVIEW_ID = 'another_review_id';
    await firebase.assertFails(
      getUserReviewRef(bobDb, BOB_ID, ANOTHER_REVIEW_ID).set(forceReviewCourseB)
    );

    // others cannot read/write
    const anyoneDb = getAuthedFirestore(null);
    await firebase.assertFails(
      getUserReviewRef(anyoneDb, ALICE_ID, RANDOM_REVIEW_ID).get()
    );
    await firebase.assertFails(
      getUserReviewRef(anyoneDb, ALICE_ID, RANDOM_REVIEW_ID).set(reviewData)
    );

    // dan cannot read/write bob course doc
    const danDb = getAuthedFirestore({ uid: DAN_ID });
    await firebase.assertFails(
      getUserReviewRef(danDb, BOB_ID, RANDOM_REVIEW_ID).get()
    );
    await firebase.assertFails(
      getUserReviewRef(danDb, BOB_ID, RANDOM_REVIEW_ID).set(reviewData)
    );
  });

  it("update: Students who are also mentors can update 'status' and 'completed_at'", async () => {
    // bob is mentor of course_a
    await updateUser(BOB_ID, {
      is_mentor: true,
      mentorable_courses: [COURSE_A],
    });

    // bob can read/write
    const bobDb = getAuthedFirestore({ uid: BOB_ID });
    const reviewData = { course: COURSE_A };
    await firebase.assertSucceeds(
      getUserReviewRef(bobDb, BOB_ID, RANDOM_REVIEW_ID).set(reviewData)
    );

    // bob can update status and completed_at
    await firebase.assertSucceeds(
      getUserReviewRef(bobDb, BOB_ID, RANDOM_REVIEW_ID).update(
        {
          status: 'passed',
          completed_at: new Date(),
        },
        { merge: true }
      )
    );

    // bob cannot update other fields
    await firebase.assertFails(
      getUserReviewRef(bobDb, BOB_ID, RANDOM_REVIEW_ID).update(
        {
          course: 'another_course',
        },
        { merge: true }
      )
    );
  });

  it('delete', async () => {
    // bob is mentor of course_a
    await updateUser(BOB_ID, {
      is_mentor: true,
      mentorable_courses: [COURSE_A],
    });

    // bob can read/write
    const bobDb = getAuthedFirestore({ uid: BOB_ID });
    const reviewData = { course: COURSE_A };
    await firebase.assertSucceeds(
      getUserReviewRef(bobDb, BOB_ID, RANDOM_REVIEW_ID).set(reviewData)
    );

    // bob cannot delete the review
    await firebase.assertFails(
      getUserReviewRef(bobDb, BOB_ID, RANDOM_REVIEW_ID).delete()
    );

    // others cannot delete
    const anyoneDb = getAuthedFirestore(null);
    await firebase.assertFails(
      getUserReviewRef(anyoneDb, BOB_ID, RANDOM_REVIEW_ID).delete()
    );

    // bob cannot delete
    const aliceDb = getAuthedFirestore({ uid: BOB_ID });
    await firebase.assertFails(
      getUserReviewRef(aliceDb, BOB_ID, RANDOM_REVIEW_ID).delete()
    );
  });
});
