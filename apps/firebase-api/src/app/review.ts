import admin from 'firebase-admin';
admin.initializeApp();

export default (data, context) => {
  // 1. Check that the user is signed in AND they're a mentor AND they can mentor the course they're requesting
  // 2. Get all the oldest submissions for that course
  // 3. Return the first one

  return admin
    .firestore()
    .collectionGroup('submissions')
    .get()
    .then((snapshot) => {
      const temp = [];

      snapshot.forEach((doc) => {
        temp.push(doc.data());
      });

      return temp;
    });
};
