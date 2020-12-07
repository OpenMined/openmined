import React from 'react';

export default () => {
  // Create a function that is triggered when the lesson is completed
  // This is triggered by clicking the "Next" button in the <ConceptFooter />
  // const onCompleteLesson = () =>
  //   new Promise((resolve, reject) => {
  //     // If we haven't already completed this lesson...
  //     if (!hasCompletedLesson(dbCourse, lesson)) {
  //       // Tell the DB we've done so
  //       db.collection('users')
  //         .doc(user.uid)
  //         .collection('courses')
  //         .doc(course)
  //         .set(
  //           {
  //             lessons: {
  //               [lesson]: {
  //                 completed_at: serverTimestamp,
  //               },
  //             },
  //           },
  //           { merge: true }
  //         )
  //         .then(resolve)
  //         .catch(reject);
  //     } else {
  //       resolve();
  //     }
  //   });

  return <div>LESSON COMPLETE</div>;
};
