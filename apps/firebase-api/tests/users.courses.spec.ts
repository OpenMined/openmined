import * as firebase from '@firebase/rules-unit-testing';
import * as firebaseApp from 'firebase/app';

import { Project } from '@openmined/shared/types';

import {
  PROJECT_ID,
  getAuthedFirestore,
  updateUser,
  getCourseRef,
} from './utils';

const ALICE_ID = 'alice';
const BOB_ID = 'bob';
const RANDOM_COURSE_ID = 'random_course';

describe('users/{{userID}}/courses/{{courseId}}', () => {
  beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId: PROJECT_ID });
  });

  it('Only owner can read/write', async () => {
    // alice can read/write
    const aliceDb = getAuthedFirestore({ uid: ALICE_ID });
    const courseData = { started_at: new Date() };
    await firebase.assertSucceeds(
      getCourseRef(aliceDb, ALICE_ID, RANDOM_COURSE_ID).set(courseData, {
        merge: true,
      })
    );
    await firebase.assertSucceeds(
      getCourseRef(aliceDb, ALICE_ID, RANDOM_COURSE_ID).get()
    );

    // others cannot read/write
    const anyoneDb = getAuthedFirestore(null);
    await firebase.assertFails(
      getCourseRef(anyoneDb, ALICE_ID, RANDOM_COURSE_ID).set(courseData, {
        merge: true,
      })
    );

    // bob cannot read/write alice course doc
    const bobDb = getAuthedFirestore({ uid: BOB_ID });
    await firebase.assertFails(
      getCourseRef(bobDb, ALICE_ID, RANDOM_COURSE_ID).get()
    );
    await firebase.assertFails(
      getCourseRef(bobDb, ALICE_ID, RANDOM_COURSE_ID).set(courseData, {
        merge: true,
      })
    );
  });

  it("Mentor will need to be able to edit the submissions array of any user's course object with the status and reviewed_at time (course->project->part->submissions)", async () => {
    const aliceDb = getAuthedFirestore({ uid: ALICE_ID });
    const courseData = { started_at: new Date() };
    // alice can create course
    await firebase.assertSucceeds(
      getCourseRef(aliceDb, ALICE_ID, RANDOM_COURSE_ID).set(courseData, {
        merge: true,
      })
    );

    // bob: mentor of alice's course can update alice's course
    await updateUser(BOB_ID, {
      is_mentor: true,
      mentorable_courses: [RANDOM_COURSE_ID],
    });
    const bobDb = getAuthedFirestore({ uid: BOB_ID });

    // bob can update users/alice/courses/{RANDOM_COURSE_ID}
    const updatedProject: Project = {
      parts: {
        any_part: {
          submissions: [
            {
              status: 'passed',
              reviewed_at: (new Date() as any) as firebaseApp.firestore.Timestamp,
            },
          ],
        },
      },
    };
    await firebase.assertSucceeds(
      getCourseRef(bobDb, ALICE_ID, RANDOM_COURSE_ID).update(
        { project: updatedProject },
        { merge: true }
      )
    );

    // bob: mentor cannot update any other fields except project
    await firebase.assertFails(
      getCourseRef(bobDb, ALICE_ID, RANDOM_COURSE_ID).update(
        { other_field: true },
        { merge: true }
      )
    );
  });

  it("Mentors should always be able to read any user's course object that they are assigned to review", async () => {
    const aliceDb = getAuthedFirestore({ uid: ALICE_ID });
    const courseData = { started_at: new Date() };
    // alice can create course
    await firebase.assertSucceeds(
      getCourseRef(aliceDb, ALICE_ID, RANDOM_COURSE_ID).set(courseData, {
        merge: true,
      })
    );

    // bob: mentor of alice's course can read alice's course
    await updateUser(BOB_ID, {
      is_mentor: true,
      mentorable_courses: [RANDOM_COURSE_ID],
    });
    const bobDb = getAuthedFirestore({ uid: BOB_ID });
    await firebase.assertSucceeds(
      getCourseRef(bobDb, ALICE_ID, RANDOM_COURSE_ID).get()
    );
  });
});
