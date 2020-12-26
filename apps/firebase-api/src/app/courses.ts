import admin from 'firebase-admin';
import functions from 'firebase-functions';

import {
  hasCompletedProject,
  hasCompletedCourse,
} from '../../../courses/src/routes/courses/_helpers';

export const completeCourse = async (data, context) => {
  functions.logger.log('INIT', data);

  // Get the current user and the assignment
  const user = context.auth.uid;
  const course = data.course;

  functions.logger.log('ENTER', user, course);

  // If there isn't a user...
  if (!context.auth || !user) return { error: 'Sorry, you are not signed in' };

  functions.logger.log('LOGGED IN');

  try {
    functions.logger.log('GOT TO TRY');

    const dbCourseRef = admin
      .firestore()
      .collection('users')
      .doc(user.uid)
      .collection('courses')
      .doc(course);

    const dbCourse = await dbCourseRef.get();

    functions.logger.log('ABLE TO GET COURSE');

    if (!dbCourse.exists) {
      return { error: 'Sorry, that course record does not exist' };
    }

    const dbCourseData = dbCourse.data();

    functions.logger.log(
      1,
      hasCompletedProject(dbCourseData),
      hasCompletedCourse(dbCourseData)
    );

    if (
      !hasCompletedProject(dbCourseData) &&
      !hasCompletedCourse(dbCourseData)
    ) {
      functions.logger.log(2);

      // Get the submission in question
      await admin
        .firestore()
        .collection('users')
        .doc(user.uid)
        .set(
          {
            completed_courses: admin.firestore.FieldValue.arrayUnion({
              course,
              completed_at: admin.firestore.FieldValue.serverTimestamp(),
            }),
          },
          { merge: true }
        );

      functions.logger.log(3);

      await dbCourseRef.set(
        {
          completed_at: admin.firestore.FieldValue.serverTimestamp(),
          project: {
            status,
            completed_at: admin.firestore.FieldValue.serverTimestamp(),
          },
        },
        { merge: true }
      );

      functions.logger.log(4);
    }

    return { success: true };
  } catch (error) {
    functions.logger.log('ERRORING OUT', error);
    return { error };
  }
};
