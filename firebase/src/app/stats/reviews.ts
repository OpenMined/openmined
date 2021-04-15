import admin from 'firebase-admin';
import {
  getStatsDoc,
  getStatsDocDataByCourse,
  getStatsDocByCourse,
} from './utils';
import { logger } from 'firebase-functions';
import moment from 'moment';

export const resetStatsNumReviewsByCourse = async (courseId) => {
  try {
    const dbReviews = await admin
      .firestore()
      .collectionGroup('reviews')
      .where('course', '==', courseId)
      // .where('status', '==', 'reviewed')
      .get();

    const numTotalReviews = dbReviews.size;

    let numTotalReviewsReviewed = 0;
    let numTotalReviewedTime = 0;
    dbReviews.forEach((review) => {
      if (review.get('status') === 'reviewed') {
        numTotalReviewsReviewed++;
        numTotalReviewedTime += moment(
          review.get('completed_at').toDate()
        ).diff(review.get('started_at').toDate(), 'minutes');
      }
    });

    await admin
      .firestore()
      .collection('stats')
      .doc(courseId)
      .set(
        {
          numTotalReviews,
          numTotalReviewsReviewed,
          numTotalReviewedTime,
          numTotalReviewedAvgTime:
            numTotalReviewsReviewed !== 0
              ? numTotalReviewedTime / numTotalReviewsReviewed
              : 0,
        },
        { merge: true }
      );
  } catch (err) {
    return err;
  }
};

export const addStatsNumReviewsByCourse = async (courseId, amount) => {
  try {
    const statsCourse = await getStatsDocDataByCourse(courseId);

    await getStatsDocByCourse(courseId).set(
      {
        numTotalReviews: statsCourse.numTotalReviews + amount,
      },
      { merge: true }
    );
  } catch (err) {
    return err;
  }
};

export const calStatsOnWriteReviews = async (change, context) => {
  try {
    const before = change.before ? change.before.data() : null;
    const after = change.after ? change.after.data() : null;

    if (!before && after) {
      // on create
      const courseId = after.course;
      await addStatsNumReviewsByCourse(courseId, 1);
    } else if (before && !after) {
      // on delete
      const courseId = after.course;
      await addStatsNumReviewsByCourse(courseId, -1);
    } else if (before && after) {
      // on update
      if (before.status !== 'reviewed' && after.status === 'reviewed') {
        const courseId = after.course;
        const statsCourse = await getStatsDocDataByCourse(courseId);

        statsCourse.numTotalReviewsReviewed++;
        statsCourse.numTotalReviewedTime += moment(after.completed_at).diff(
          after.started_at,
          'minutes'
        );
        statsCourse.numTotalReviewedAvgTime =
          statsCourse.numTotalReviewsReviewed !== 0
            ? statsCourse.numTotalReviewedTime /
              statsCourse.numTotalReviewsReviewed
            : 0;
        await getStatsDocByCourse(courseId).set(
          {
            numTotalReviewsReviewed: statsCourse.numTotalReviewsReviewed,
            numTotalReviewedAvgTime: statsCourse.numTotalReviewedAvgTime,
            numTotalReviewedTime: statsCourse.numTotalReviewedTime,
          },
          { merge: true }
        );
      }
    }
  } catch (error) {
    logger.error('calStatsOnWriteReviews failed', error);
  }
};
