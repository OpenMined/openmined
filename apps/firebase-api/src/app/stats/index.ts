import admin from 'firebase-admin';
import { resetStatsNumActiveUsers } from './active-users';
import { resetStatsNumReviewsByCourse } from './reviews';
import { resetStatsNumSubmissionsByCourse } from './submissions';
import { resetStatsCoursesByCourse } from './courses';

const allCourses = ['our-privacy-opportunity', 'privacy-and-society'];

export const initStatsCollection = async (req, res) => {
  try {
    await resetStatsNumActiveUsers();
    for (let i = 0; i < allCourses.length; i++) {
      await resetStatsNumReviewsByCourse(allCourses[i]);
      await resetStatsNumSubmissionsByCourse(allCourses[i]);
      await resetStatsCoursesByCourse(allCourses[i]);
    }

    res.json({
      success: true,
    });
  } catch (error) {
    res.json({ success: false, error });
  }
};
