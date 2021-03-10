import admin from 'firebase-admin';

export const STATS_DOC_ID = 'stats';

export const getStatsDoc = () => {
  return admin.firestore().collection('stats').doc(STATS_DOC_ID);
};

export const getStatsDocData = async () => {
  const doc = await getStatsDoc().get();

  return doc.data();
};

export const getStatsDocByCourse = (courseId) => {
  return admin.firestore().collection('stats').doc(courseId);
};

export const getStatsDocDataByCourse = async (courseId) => {
  const doc = await admin.firestore().collection('stats').doc(courseId).get();
  return doc.data();
};
