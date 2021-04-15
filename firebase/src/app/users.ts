import admin from 'firebase-admin';
import { logger } from 'firebase-functions';

const getUserRef = (userId) =>
  admin.firestore().collection('users').doc(userId);

export const getAllUsers = (): Promise<any[]> =>
  new Promise((resolve, reject) => {
    const allUsers = [];

    const iterateAllUsers = async (nextPageToken?) => {
      // List batch of users, 1000 at a time.
      try {
        const listUsersResult = await admin
          .auth()
          .listUsers(1000, nextPageToken);
        listUsersResult.users.forEach((userRecord) => {
          allUsers.push({
            uid: userRecord.uid,
            createdAt: userRecord.metadata.creationTime,
            email: userRecord.email,
          });
        });

        if (listUsersResult.pageToken) {
          // List next batch of users.
          iterateAllUsers(listUsersResult.pageToken);
        } else {
          resolve(allUsers);
        }
      } catch (error) {
        logger.error('Error listing users:', error);
        reject(error);
      }
    };

    iterateAllUsers();
  });

export const addUNumToAllUsers = async (req, res) => {
  try {
    const allUsers = await getAllUsers();

    const sortedUsers = allUsers.sort((u1, u2) => {
      return (
        new Date(u1.createdAt).getTime() - new Date(u2.createdAt).getTime()
      );
    });

    // 500 is limit
    const BATCH_SIZE = 300;
    let uNum = 1;
    for (let i = 0; i < sortedUsers.length; i += BATCH_SIZE) {
      const subUsers = sortedUsers.slice(
        i,
        Math.min(i + BATCH_SIZE, sortedUsers.length)
      );

      const batch = admin.firestore().batch();
      subUsers.forEach((user) => {
        batch.set(getUserRef(user.uid), { uNum }, { merge: true });
        uNum++;
      });
      await batch.commit();
    }

    res.json({
      success: true,
      msg: `${allUsers.length} user(s) were reordered`,
    });
  } catch (error) {
    res.json({ success: false, error });
  }
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
