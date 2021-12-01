import admin from 'firebase-admin';
import {
  getStatsDoc,
  getStatsDocDataByCourse,
  getStatsDocByCourse,
} from './utils';
import { logger } from 'firebase-functions';
import { getProjectPartStatus } from '../../../../courses/src/routes/courses/_helpers';

const getCourseProjectStatus = (course) => {
  if (course.project && course.project.parts) {
    const statues = [];
    for (const partId in course.project.parts) {
      statues.push(getProjectPartStatus(course, partId));
    }

    // if one of project part failed
    if (statues.indexOf('failed') !== -1) {
      return 'failed';
    }
    // if all project part passed
    const passedProjectParts = statues.filter((stat) => stat === 'passed')
      .length;
    if (passedProjectParts === statues.length) {
      return 'passed';
    }
  }
  return 'in-progress-or-not-started';
};

export const resetStatsCoursesByCourse = async (courseId) => {
  try {
    const dbCourses = await admin
      .firestore()
      // stats/{courseId} also exists so make sure that lessons is not null
      // to get only courses/{courseId}
      .collectionGroup(courseId)
      .where('lessons', '!=', null)
      .get();

    let numProjectPassed = 0;
    let numProjectFailed = 0;
    dbCourses.forEach((course) => {
      const status = getCourseProjectStatus(course);
      if (status === 'passed') {
        numProjectPassed++;
      } else if (status == 'failed') {
        numProjectFailed++;
      }
    });
    await admin.firestore().collection('stats').doc(courseId).set(
      {
        numProjectFailed,
        numProjectPassed,
      },
      { merge: true }
    );
  } catch (err) {
    return err;
  }
};

export const calStatsOnWriteCourses = async (change, context) => {
  try {
    const before = change.before ? change.before.data() : null;
    const after = change.after ? change.after.data() : null;

    const { courseId } = context.params;

    if (before && after) {
      // on update
      const beforeStatus = getCourseProjectStatus(before);
      const afterStatus = getCourseProjectStatus(after);

      console.log(beforeStatus, afterStatus);
      if (beforeStatus !== 'failed' && beforeStatus !== 'passed') {
        const statsCourse = await getStatsDocDataByCourse(courseId);

        if (afterStatus === 'failed') {
          statsCourse.numProjectFailed++;
          await getStatsDocByCourse(courseId).set(
            {
              numProjectFailed: statsCourse.numProjectFailed,
            },
            { merge: true }
          );
        } else if (afterStatus === 'passed') {
          statsCourse.numProjectPassed++;
          await getStatsDocByCourse(courseId).set(
            {
              numProjectPassed: statsCourse.numProjectPassed,
            },
            { merge: true }
          );
        }
      }
    }
  } catch (error) {
    logger.error('calStatsOnWriteSubmissions failed', error);
  }
};
