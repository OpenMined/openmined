import admin from 'firebase-admin';
import {
  getStatsDoc,
  getStatsDocDataByCourse,
  getStatsDocByCourse,
} from './utils';
import { logger } from 'firebase-functions';
import moment from 'moment';

export const resetStatsNumSubmissionsByCourse = async (courseId) => {
  try {
    const dbSubmissions = await admin
      .firestore()
      .collectionGroup('submissions')
      .where('course', '==', courseId)
      // .where('status', '==', 'reviewed')
      .get();

    let numSubmissionsPending = 0;
    dbSubmissions.forEach((submission) => {
      if (!submission.get('mentor')) {
        numSubmissionsPending++;
      }
    });

    const numTotalSubmissions = dbSubmissions.size;

    let numSubmissionsPassed = 0;
    dbSubmissions.forEach((submission) => {
      if (submission.get('status') === 'passed') {
        numSubmissionsPassed++;
      }
    });
    await admin
      .firestore()
      .collection('stats')
      .doc(courseId)
      .set(
        {
          numSubmissionsPending,
          numTotalSubmissions,
          numSubmissionsPassed,
          acceptanceRate:
            numTotalSubmissions !== 0
              ? (numSubmissionsPassed / numTotalSubmissions) * 100
              : 0,
        },
        { merge: true }
      );
  } catch (err) {
    return err;
  }
};

export const addStatsNumSubmissionsByCourse = async (courseId, amount) => {
  try {
    console.log('statsCourse.numTotalSubmissions');
    const statsCourse = await getStatsDocDataByCourse(courseId);
    statsCourse.numTotalSubmissions += amount;
    await getStatsDocByCourse(courseId).set(
      {
        numTotalSubmissions: statsCourse.numTotalSubmissions + amount,
        acceptanceRate:
          statsCourse.numTotalSubmissions !== 0
            ? (statsCourse.numSubmissionsPassed /
                statsCourse.numTotalSubmissions) *
              100
            : 0,
      },
      { merge: true }
    );
  } catch (err) {
    return err;
  }
};
export const addStatsNumSubmissionsPendingByCourse = async (
  courseId,
  amount
) => {
  try {
    const statsCourse = await getStatsDocDataByCourse(courseId);

    await getStatsDocByCourse(courseId).set(
      {
        numSubmissionsPending: statsCourse.numSubmissionsPending + amount,
      },
      { merge: true }
    );
  } catch (err) {
    return err;
  }
};

export const calStatsOnWriteSubmissions = async (change, context) => {
  try {
    const before = change.before ? change.before.data() : null;
    const after = change.after ? change.after.data() : null;

    if (!before && after) {
      // on create
      const courseId = after.course;
      await addStatsNumSubmissionsByCourse(courseId, 1);

      if (!after.mentor) {
        await addStatsNumSubmissionsPendingByCourse(courseId, 1);
      }
    } else if (before && !after) {
      // on delete
      const courseId = after.course;
      await addStatsNumSubmissionsByCourse(courseId, -1);

      if (!before.mentor) {
        await addStatsNumSubmissionsPendingByCourse(courseId, -1);
      }
    } else if (before && after) {
      // on update
      const courseId = after.course;
      if (before.mentor && !after.mentor) {
        await addStatsNumSubmissionsPendingByCourse(courseId, 1);
      } else if (!before.mentor && after.mentor) {
        await addStatsNumSubmissionsPendingByCourse(courseId, -1);
      }

      if (before.status !== 'passed' && after.status === 'passed') {
        // new passed  arrived
        const statsCourse = await getStatsDocDataByCourse(courseId);
        statsCourse.numSubmissionsPassed++;

        await getStatsDocByCourse(courseId).set(
          {
            numSubmissionsPassed: statsCourse.numSubmissionsPassed,
            acceptanceRate:
              statsCourse.numTotalSubmissions !== 0
                ? (statsCourse.numSubmissionsPassed /
                    statsCourse.numTotalSubmissions) *
                  100
                : 0,
          },
          { merge: true }
        );
      }
    }
  } catch (error) {
    logger.error('calStatsOnWriteSubmissions failed', error);
  }
};
