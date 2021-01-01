import * as firebase from '@firebase/rules-unit-testing';

import { PROJECT_ID, getAuthedFirestore, updateUser } from './utils';

const ALICE_ID = 'alice';
const BOB_ID = 'bob';

describe('users/{{userID}}', () => {
  beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId: PROJECT_ID });
  });

  it('Anyone can read', async () => {
    // alice can read
    const aliceDb = getAuthedFirestore({ uid: ALICE_ID });
    const aliceProfile = aliceDb.collection('users').doc(ALICE_ID);
    await firebase.assertSucceeds(aliceProfile.get());

    // anyone can read
    const anyoneDb = getAuthedFirestore(null);
    await firebase.assertSucceeds(
      anyoneDb.collection('users').doc(ALICE_ID).get()
    );
  });

  it('Owner can only write except a few fields', async () => {
    // alice can write
    const aliceDb = getAuthedFirestore({ uid: ALICE_ID });
    const aliceProfile = aliceDb.collection('users').doc(ALICE_ID);
    const profileData = { first_name: 'Alice' };
    await firebase.assertSucceeds(
      aliceProfile.set(profileData, { merge: true })
    );

    // alice cannot write is_mentor field
    const forceIsMentorData = { is_mentor: true };
    await firebase.assertFails(
      aliceProfile.set(forceIsMentorData, { merge: true })
    );

    // alice cannot write mentorable_courses field
    const forceMentorableCoursesData = {
      mentorable_courses: ['some-course', 'some-other-course'],
    };
    await firebase.assertFails(
      aliceProfile.set(forceMentorableCoursesData, { merge: true })
    );

    // alice cannot write completed_courses field
    const forceCompletedCoursesData = {
      completed_courses: [
        {
          course: 'some-course',
          completed_at: 'some-date',
        },
      ],
    };
    await firebase.assertFails(
      aliceProfile.set(forceCompletedCoursesData, { merge: true })
    );

    // others cannnot write
    const anyoneDb = getAuthedFirestore(null);
    await firebase.assertFails(
      anyoneDb
        .collection('users')
        .doc(ALICE_ID)
        .set(profileData, { merge: true })
    );

    // bob cannnot write alice user doc
    const bobDb = getAuthedFirestore({ uid: BOB_ID });
    await firebase.assertFails(
      bobDb.collection('users').doc(ALICE_ID).set(profileData, { merge: true })
    );
  });

  it('As a mentor, an owner can only write certain fields', async () => {
    const aliceDb = getAuthedFirestore({ uid: ALICE_ID });

    // Make alice a mentor
    await updateUser(ALICE_ID, {
      is_mentor: true,
      mentorable_courses: ['hello-world'],
    });

    const aliceProfile = aliceDb.collection('users').doc(ALICE_ID);
    const profileData = { first_name: 'Alice' };
    await firebase.assertSucceeds(
      aliceProfile.set(profileData, { merge: true })
    );
  });

  describe('/private/{{userId}}', () => {
    it('Only owner can read/write', async () => {
      const getPrivateDocRef = (db, userId) =>
        db.collection('users').doc(userId).collection('private').doc(userId);

      // alice can read/write
      const aliceDb = getAuthedFirestore({ uid: ALICE_ID });
      const aliceProfile = getPrivateDocRef(aliceDb, ALICE_ID);
      const profileData = { github_id: 'token' };
      await firebase.assertSucceeds(
        aliceProfile.set(profileData, { merge: true })
      );
      await firebase.assertSucceeds(aliceProfile.get());

      // others cannot read/write
      const anyoneDb = getAuthedFirestore(null);
      await firebase.assertFails(getPrivateDocRef(anyoneDb, ALICE_ID).get());
      await firebase.assertFails(
        getPrivateDocRef(anyoneDb, ALICE_ID).set(profileData, { merge: true })
      );

      // bob cannot read/write alics private
      const bobDb = getAuthedFirestore({ uid: BOB_ID });
      await firebase.assertFails(getPrivateDocRef(bobDb, ALICE_ID).get());
      await firebase.assertFails(
        getPrivateDocRef(bobDb, ALICE_ID).set(profileData, { merge: true })
      );
    });
  });
});
