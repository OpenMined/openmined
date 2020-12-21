import {
  hasCompletedConcept,
  hasCompletedCourse,
  hasCompletedLesson,
  hasCompletedProject,
  hasStartedConcept,
  hasStartedCourse,
  hasStartedLesson,
  hasStartedProject,
  PROJECT_PART_SUBMISSIONS,
} from './_helpers';

export const getUserRef = (db: firebase.firestore.Firestore, uId: string) =>
  db.collection('users').doc(uId);

export const getCourseRef = (
  db: firebase.firestore.Firestore,
  uId: string,
  courseId: string
) => db.collection('users').doc(uId).collection('courses').doc(courseId);

export const updateCourse = (
  db: firebase.firestore.Firestore,
  uId: string,
  courseId: string,
  data: any
) => getCourseRef(db, uId, courseId).set(data, { merge: true });

export const handleConceptStarted = async (
  db: firebase.firestore.Firestore,
  uId: string,
  courseId: string,
  ts,
  progress,
  lesson,
  concept
) => {
  if (!hasStartedConcept(progress, lesson, concept)) {
    const data = progress;

    // Then the concept data structure inside that
    data.lessons[lesson].concepts[concept] = {
      started_at: ts(),
    };

    // When the object is constructed, store it!
    return updateCourse(db, uId, courseId, data);
  }
};

export const handleConceptComplete = (
  db: firebase.firestore.Firestore,
  uId: string,
  courseId: string,
  ts,
  progress,
  lesson,
  concept
) =>
  new Promise((resolve, reject) => {
    // If we haven't already completed this concept...
    if (!hasCompletedConcept(progress, lesson, concept)) {
      // Tell the DB we've done so
      updateCourse(db, uId, courseId, {
        lessons: {
          [lesson]: {
            concepts: {
              [concept]: {
                completed_at: ts(),
              },
            },
          },
        },
      })
        .then(resolve)
        .catch(reject);
    } else {
      resolve(true);
    }
  });

export const handleQuizFinish = async (
  db: firebase.firestore.Firestore,
  uId: string,
  courseId: string,
  arrayUnion,
  progress,
  lesson,
  concept,
  numQuizzes,
  correctAnswers,
  quiz
) => {
  const numQuizzesInDb = progress.lessons[lesson].concepts[concept].quizzes
    ? progress.lessons[lesson].concepts[concept].quizzes.length
    : 0;

  if (numQuizzesInDb < numQuizzes) {
    const percentage = (correctAnswers / quiz.length) * 100;

    return updateCourse(db, uId, courseId, {
      lessons: {
        [lesson]: {
          concepts: {
            [concept]: {
              quizzes: arrayUnion({
                correct: correctAnswers,
                total: quiz.length,
                percentage,
              }),
            },
          },
        },
      },
    });
  }
};

export const handleLessonStart = async (
  db: firebase.firestore.Firestore,
  uId: string,
  courseId: string,
  ts,
  progress,
  lesson
) => {
  const isCourseStarted = hasStartedCourse(progress);
  const isLessonStarted = hasStartedLesson(progress, lesson);

  const data = progress;

  // Append the course data structure
  if (!isCourseStarted) {
    data.started_at = ts();
    data.lessons = {};
  }

  // Then the lesson data structure inside that
  if (!isLessonStarted) {
    data.lessons[lesson] = {
      started_at: ts(),
      concepts: {},
    };
  }

  // When the object is constructed, store it!
  return updateCourse(db, uId, courseId, data);
};

export const handleLessonComplete = (
  db: firebase.firestore.Firestore,
  uId: string,
  courseId: string,
  ts,
  progress,
  lesson
) =>
  new Promise((resolve, reject) => {
    // If we haven't already completed this lesson...
    if (!hasCompletedLesson(progress, lesson)) {
      // Tell the DB we've done so
      updateCourse(db, uId, courseId, {
        lessons: {
          [lesson]: {
            completed_at: ts(),
          },
        },
      })
        .then(resolve)
        .catch(reject);
    } else {
      resolve(true);
    }
  });

export const handleProjectPartBegin = (
  db: firebase.firestore.Firestore,
  uId: string,
  courseId: string,
  ts,
  progress,
  part
) => {
  const data = progress;

  // If they haven't begun the project at all
  if (!hasStartedProject(progress)) {
    data.project = {
      started_at: ts(),
      parts: {},
    };
  }

  // Add the project part to the object of parts
  data.project.parts[part] = {
    started_at: ts(),
    submissions: [], // Make sure to set the submissions array up
    reviews: [], // Make sure to also set the reviews array up
  };

  return updateCourse(db, uId, courseId, data);
};

export const getSubmissionsRef = (
  db: firebase.firestore.Firestore,
  uId: string,
  courseId: string
) =>
  db
    .collection('users')
    .doc(uId)
    .collection('courses')
    .doc(courseId)
    .collection('submissions');

export const addSubmission = (
  db: firebase.firestore.Firestore,
  uId: string,
  courseId: string,
  data: any
) => getSubmissionsRef(db, uId, courseId).add(data);

export const handleAttemptSubmission = async (
  db: firebase.firestore.Firestore,
  uId: string,
  courseId: string,
  arrayUnion,
  currentTime,
  progress,
  part,
  content
) => {
  // Get their current submissions
  const submissions = progress.project.parts[part].submissions;

  // If we have less than the total number of allowed submissions
  if (submissions.length < PROJECT_PART_SUBMISSIONS) {
    // Get the current time (see where this function is defined above)
    const time = currentTime();

    // First, submit the submissions to the submissions subcollection
    const submission = await addSubmission(db, uId, courseId, {
      course: courseId,
      part,
      attempt: submissions && submissions.length ? submissions.length + 1 : 1,
      student: db.collection('users').doc(uId),
      submitted_at: time,
      submission_content: content,
      mentor: null,
      status: null,
      review_content: null,
      review_started_at: null,
      review_ended_at: null,
    });

    // Once that's done, add the submissions to the submissions array on the user's course document
    // Note the use of the reference to the previous submission
    await updateCourse(db, uId, courseId, {
      project: {
        parts: {
          [part]: {
            submissions: arrayUnion({
              submitted_at: time,
              submission,
            }),
          },
        },
      },
    });

    return true;
  } else {
    return false;
  }
};

export const handleProjectComplete = async (
  db: firebase.firestore.Firestore,
  uId: string,
  courseId: string,
  ts,
  progress,
  status
) => {
  return new Promise((resolve, reject) => {
    // If we haven't already completed this project and course...
    if (!hasCompletedProject(progress) && !hasCompletedCourse(progress)) {
      // Tell the DB we've done so
      updateCourse(db, uId, courseId, {
        completed_at: ts(),
        project: {
          status,
          completed_at: ts(),
        },
      })
        .then(resolve)
        .catch(reject);
    } else {
      resolve(true);
    }
  });
};
export const getFeedbackRef = (
  db: firebase.firestore.Firestore,
  uId: string,
  courseId: string,
  feedbackId: string
) =>
  db
    .collection('users')
    .doc(uId)
    .collection('courses')
    .doc(courseId)
    .collection('feedback')
    .doc(feedbackId);

export const updateFeedback = (
  db: firebase.firestore.Firestore,
  uId: string,
  courseId: string,
  feedbackId: string,
  data: any
) => getFeedbackRef(db, uId, courseId, feedbackId).set(data, { merge: true });

export const handleProvideFeedback = async (
  db: firebase.firestore.Firestore,
  uId: string,
  courseId: string,
  feedbackId: string,
  value,
  feedback,
  type
) =>
  updateFeedback(db, uId, courseId, feedbackId, {
    value,
    feedback,
    type,
  });
