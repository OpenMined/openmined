import admin from 'firebase-admin';
import { logger } from 'firebase-functions';

const getUserRef = (userId) =>
  admin.firestore().collection('users').doc(userId);

export const addUNumToAllUsers = (req, res) => {
  let uNum = 1;

  const iterateAllUsers = async (nextPageToken?) => {
    // List batch of users, 1000 at a time.
    try {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      const batch = admin.firestore().batch();

      listUsersResult.users.forEach((userRecord) => {
        batch.set(getUserRef(userRecord.uid), { uNum }, { merge: true });
        uNum++;
      });

      await batch.commit();

      if (listUsersResult.pageToken) {
        // List next batch of users.
        iterateAllUsers(listUsersResult.pageToken);
      } else {
        res.json({ msg: 'Success' });
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
  }

  await admin
    .firestore()
    .collection('users')
    .doc(user.uid)
    .set({ uNum: currentNum }, { merge: true });
};
