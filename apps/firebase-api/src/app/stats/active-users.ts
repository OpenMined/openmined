import admin from 'firebase-admin';
import { getAllUsers } from '../users';
import { getStatsDoc, getStatsDocData } from './utils';

export const resetStatsNumActiveUsers = async () => {
  try {
    const allUsers = await getAllUsers();

    await getStatsDoc().set(
      { numActiveUsers: allUsers.length },
      { merge: true }
    );
    return true;
  } catch (error) {
    return error;
  }
};

export const getNumActiveUsers = async () => {
  const statsDoc = await getStatsDocData();

  return statsDoc.numActiveUsers;
};

export const setNumActiveUser = async (num) => {
  await getStatsDoc().set({ numActiveUsers: num }, { merge: true });
};

export const statsActiveUserIncrease = async (user) => {
  const currentNum = await getNumActiveUsers();
  await setNumActiveUser(currentNum + 1);
};

export const statsActiveUserDecrease = async (user) => {
  const currentNum = await getNumActiveUsers();
  await setNumActiveUser(currentNum - 1);
};
