import admin from 'firebase-admin';
import { logger } from 'firebase-functions';

const getUserRef = (userId) =>
  admin.firestore().collection('users').doc(userId);

const addUNumToAllUsers = () => {
  let uNum = 1;

  const iterateAllUsers = async (nextPageToken?) => {
    // List batch of users, 1000 at a time.
    try {
      const listUsersResult = await admin.auth().listUsers(1, nextPageToken);
      const batch = admin.firestore().batch();

      listUsersResult.users.forEach((userRecord) => {
        uNum++;
        batch.set(getUserRef(userRecord.uid), { uNum }, { merge: true });
      });

      await batch.commit();

      if (listUsersResult.pageToken) {
        // List next batch of users.
        iterateAllUsers(listUsersResult.pageToken);
      }
    } catch (error) {
      logger.error('Error listing users:', error);
    }
  };

  iterateAllUsers();
};

export const addUniqueNumberToUser = async (user) => {
  const userWithMaxUNumSnapshot = await admin
    .firestore()
    .collection('users')
    .orderBy('uNum', 'desc')
    .limit(1)
    .get();

  let currentNum = 1;
  if (!userWithMaxUNumSnapshot.empty) {
    const userWithMaxUNum = userWithMaxUNumSnapshot.docs[0].data();
    currentNum = userWithMaxUNum.uNum + 1;

    await admin
      .firestore()
      .collection('users')
      .doc(user.uid)
      .set({ uNum: currentNum }, { merge: true });
  } else {
    await addUNumToAllUsers();
  }
};
