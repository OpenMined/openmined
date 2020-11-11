// TODO: Find some sort of way of getting cloud functions working locally and deployable without main field in package.json
// TODO: Find some sort of way to serve Firebase functions and run them in the shell locally: https://medium.com/mean-fire/nx-nrwl-firebase-functions-98f96f514055

import * as functions from 'firebase-functions';

exports.createUser = functions
  .region('europe-west1')
  .firestore.document('users/{userId}')
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = snap.data();

    // access a particular field as you would any JS property
    const name = newValue.name + 1;

    // perform desired operations ...
  });
