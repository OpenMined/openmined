import admin from 'firebase-admin';

import {
  hasCompletedProject,
  hasCompletedCourse,
  getProjectPartStatus,
} from '../../../courses/src/routes/courses/_helpers';

export const completeCourse = async (data, context) => {
  // Get the current user and the assignment
  const user = context.auth.uid;
  const course = data.course;

  // If there isn't a user...
  if (!context.auth || !user) return { error: 'Sorry, you are not signed in' };

  try {
    const dbCourseRef = admin
      .firestore()
      .collection('users')
      .doc(user)
      .collection('courses')
      .doc(course);

    const dbCourse = await dbCourseRef.get();

    if (!dbCourse.exists) {
      return { error: 'Sorry, that course record does not exist' };
    }

    const dbCourseData = dbCourse.data();

    if (
      !hasCompletedProject(dbCourseData) &&
      !hasCompletedCourse(dbCourseData)
    ) {
      // Apparently, you cannot use SererTimestamp (ts()) inside of arrayUnion, so this is needed
      // https://stackoverflow.com/questions/52324505/function-fieldvalue-arrayunion-called-with-invalid-data-fieldvalue-servertime
      const currentTime = admin.firestore.Timestamp.now;

      // Get the submission in question
      await admin
        .firestore()
        .collection('users')
        .doc(user)
        .set(
          {
            completed_courses: admin.firestore.FieldValue.arrayUnion({
              course,
              completed_at: currentTime(),
            }),
          },
          { merge: true }
        );

      let status = null;

      Object.keys(dbCourseData.project.parts).forEach((part) => {
        if (getProjectPartStatus(dbCourseData, part) !== 'passed') {
          status = 'failed';
        }
      });

      if (!status) status = 'passed';

      await dbCourseRef.set(
        {
          completed_at: currentTime(),
          project: {
            status,
            completed_at: currentTime(),
          },
        },
        { merge: true }
      );
    }

    return { success: true };
  } catch (error) {
    return { error };
  }
};
