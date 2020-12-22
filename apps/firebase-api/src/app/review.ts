import admin from 'firebase-admin';

admin.initializeApp();

export const assignReview = async (data, context) => {
  // Get the current user and the course
  const user = context.auth.uid;
  const course = data.course;

  // If there isn't a user...
  if (!context.auth || !user) return { error: 'Not signed in' };

  try {
    // Try to get this user from the list of mentors
    const dbMentor = await admin
      .firestore()
      .collection('mentors')
      .doc(user)
      .get();

    // If they're not a mentor...
    if (!dbMentor.exists) return { error: 'Not a mentor' };

    // Otherwise, get their data
    const dbMentorData = dbMentor.data();

    // If they can't review the course they're asking to review...
    if (!dbMentorData.courses.includes(course)) {
      return { error: 'Cannot review this course' };
    }

    // Otherwise, this is a legitimate request
    else {
      // Get 1 submission that's ordered by oldest for this course that doesn't currently have a mentor assigned
      const dbSubmissions = await admin
        .firestore()
        .collectionGroup('submissions')
        .where('course', '==', course)
        .where('mentor', '==', null)
        .orderBy('submitted_at', 'asc')
        .limit(1)
        .get();

      // If we don't find anything...
      if (dbSubmissions.empty) {
        return { error: `No reviews available for "${course}" course` };
      }

      let assignment;

      // Otherwise, store the data and add the ID of the document
      dbSubmissions.forEach((snap) => {
        assignment = {
          ...snap.data(),
          id: snap.id,
        };
      });

      // Get the ID of the user who made the submission
      const studentId = assignment.student._path.segments[1];

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

      // Write the assignment to the mentor's reviews subcollection
      await admin.firestore().collection(`/users/${user}/reviews`).add({
        submission: submissionRef,
        student: assignment.student,
        course: assignment.course,
        part: assignment.part,
        attempt: assignment.attempt,
        status: 'pending',
        started_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Return it to the user
      return assignment;
    }
  } catch (error) {
    return { error };
  }
};

export const resignReview = async (data, context) => {
  // Get the current user and the course
  const user = context.auth.uid;
  const course = data.course;
  const part = data.part;
  const attempt = data.attempt;
  const mentor = data.mentor;
  const student = data.student;

  console.log(course, part, attempt, mentor, student);

  // If there isn't a user...
  if (!context.auth || !user) return { error: 'Not signed in' };

  console.log('HI', mentor._path.segments, mentor._path.segments[1]);

  try {
    // PATRICK: Pick up here tomorrow
    // 1. Check to make sure the mentor and the user (context.auth.uid) are the same user
    // 2. If so, then remove them from the mentor and review_started_at values on the submission
    // Unrelated, but just taking a note: maybe we don't need a reviews array on the user... instead, just update the submission array with the status since the submission ref itself will have the review embedded
  } catch (error) {
    return { error };
  }
};
