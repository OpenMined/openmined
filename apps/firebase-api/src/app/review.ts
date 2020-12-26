import admin from 'firebase-admin';

export const assignReview = async (data, context) => {
  // Get the current user and the course
  const user = context.auth.uid;
  const course = data.course;

  // If there isn't a user...
  if (!context.auth || !user) return { error: 'Sorry, you are not signed in' };

  try {
    // Try to get this user from the list of users
    const dbUserRef = admin.firestore().collection('users').doc(user);
    const dbUser = await dbUserRef.get();

    // If they're not a user...
    if (!dbUser.exists) return { error: 'Sorry, you are not a user' };

    // Otherwise, get their data
    const dbUserData = dbUser.data();

    // If they're a user, but not a mentor
    if (!dbUserData.is_mentor) return { error: 'Sorry, you are not a mentor' };

    // If they can't review the course they're asking to review...
    if (!dbUserData.mentorable_courses.includes(course)) {
      return { error: 'Sorry, you are not allowed review this course' };
    }

    // Otherwise, this is a legitimate request
    else {
      // Get 1 submission that's ordered by oldest for this course
      // ... that doesn't currently have a mentor assigned
      // ... and the student isn't also the mentor
      // NOTE: Since we're using an inequality filter on student, Firebase requires the first "sort" statement to be on this field
      const dbSubmissions = await admin
        .firestore()
        .collectionGroup('submissions')
        .orderBy('student')
        .where('course', '==', course)
        .where('mentor', '==', null)
        .where('student', '!=', dbUserRef)
        .orderBy('submitted_at', 'asc')
        .limit(1)
        .get();

      // If we don't find anything...
      if (dbSubmissions.empty) {
        return {
          error: `There are no submissions available for "${course}" course`,
        };
      }

      // Get the assignment
      const assignment = dbSubmissions.docs[0].data();

      // Get the ID of the student from that assignment
      const studentId = assignment.student._path.segments[1];

      // Store a reference to the assignment
      const submissionRef = admin
        .firestore()
        .doc(
          `/users/${studentId}/courses/${course}/submissions/${assignment.id}`
        );

      // Write the assignment to the submission
      await submissionRef.set(
        {
          mentor: admin.firestore().doc(`/users/${user}`),
          review_started_at: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      // Write the assignment to the mentor's reviews subcollection with the same ID
      await admin
        .firestore()
        .collection(`/users/${user}/reviews`)
        .doc(assignment.id)
        .set({
          submission: submissionRef,
          id: assignment.id,
          student: assignment.student,
          course: assignment.course,
          part: assignment.part,
          attempt: assignment.attempt,
          status: 'pending',
          started_at: admin.firestore.FieldValue.serverTimestamp(),
          completed_at: null,
        });

      // Return it to the user
      return assignment;
    }
  } catch (error) {
    return { error };
  }
};

export const resignReview = async (data, context) => {
  // Get the current user and the assignment
  const user = context.auth.uid;
  const submission = data.submission;
  const mentor = data.mentor;

  // If there isn't a user...
  if (!context.auth || !user) return { error: 'Sorry, you are not signed in' };

  // If the user requestion isn't the mentor themselves...
  if (user !== mentor)
    return { error: 'Sorry, you are not the assigned mentor' };

  try {
    // Get the submission in question
    const dbSubmissions = await admin
      .firestore()
      .collectionGroup('submissions')
      .where('id', '==', submission)
      .where('mentor', '==', admin.firestore().doc(`/users/${user}`))
      .limit(1)
      .get();

    // If we don't find anything...
    if (dbSubmissions.empty) {
      return { error: 'Sorry, we could not find that submission' };
    }

    // Get the assignment reference
    const assignment = dbSubmissions.docs[0].ref;

    // Write the assignment to the submission
    await assignment.set(
      { mentor: null, review_started_at: null },
      { merge: true }
    );

    // Resign the review to the mentor's reviews collection
    const dbReview = await admin
      .firestore()
      .doc(`/users/${mentor}/reviews/${submission}`)
      .set(
        {
          status: 'resigned',
          completed_at: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

    // And update the statistics on the mentorship array
    // TODO: Perhaps keep two arrays of submission id's that the mentor completely reviews and resigns from
    // We can use this on their mentor activity list to get the number, but ALSO to make sure they can't be reassigned a submission they've previously resigned from
    // This may or may not be a needed feature, if not... just increment a counter on the users/[user]/private[user] document

    // Return the resigned review to the mentor
    return dbReview;
  } catch (error) {
    return { error };
  }
};
