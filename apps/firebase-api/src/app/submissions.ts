import admin from 'firebase-admin';
import { logger } from 'firebase-functions';

import { sendEmail } from './email';

export const onCourseSubmissionUpdate = async (change, context) => {
  const oldData = change.before.data();
  const newData = change.after.data();

  if (
    !oldData.review_content &&
    !oldData.status &&
    newData.review_content &&
    newData.status
  ) {
    await admin
      .auth()
      .getUser(context.params.userId)
      .then(async (user) => {
        const dbUser = await admin
          .firestore()
          .collection('users')
          .doc(context.params.userId)
          .get();
        const dbUserData = dbUser.data();

        if (
          !dbUserData.notification_preferences ||
          (dbUserData.notification_preferences &&
            dbUserData.notification_preferences.includes('project_reviews'))
        ) {
          if (newData.status === 'passed') {
            return sendEmail('receivePassedReview', user.email, {
              data: newData,
            });
          } else if (newData.status === 'failed') {
            return sendEmail('receiveFailedReview', user.email, {
              data: newData,
            });
          }
        } else {
          return { status: 'Filter not met' };
        }
      });
  }

  return { status: 'Filter not met' };
};
