import { useEffect, useState } from 'react';

// TODO: Make all of these tests written in the order in which they're supposed to appear
// TODO: And likewise, ensure that they must build on each other (i.e. to test the completion of a lesson, you must test the completion of all previous concepts and lessons)

// Course permissions
export const hasStartedCourse = (u) =>
  Object.keys(u).length !== 0 && !!u.started_at;
export const hasCompletedCourse = (u) =>
  hasStartedCourse(u) && !!u.completed_at;

// Lesson permissions
export const getLessonIndex = (ls, l) => ls.findIndex(({ _id }) => _id === l);
export const getLessonNumber = (ls, l) => getLessonIndex(ls, l) + 1;
export const doesLessonExist = (ls, l) => getLessonIndex(ls, l) !== -1;
export const hasStartedLesson = (u, l) =>
  hasStartedCourse(u) &&
  !!u.lessons &&
  !!u.lessons[l] &&
  !!u.lessons[l].started_at;
export const hasCompletedLesson = (u, l) =>
  hasStartedLesson(u, l) && !!u.lessons[l].completed_at;

// Concept permissions
export const getConceptIndex = (ls, l, c) =>
  ls[getLessonIndex(ls, l)].concepts.findIndex(({ _id }) => _id === c);
export const getConceptNumber = (ls, l, c) => getConceptIndex(ls, l, c) + 1;
export const doesConceptExist = (ls, l, c) =>
  doesLessonExist(ls, l) && getConceptIndex(ls, l, c) !== -1;
export const hasStartedConcept = (u, l, c) =>
  hasStartedLesson(u, l) &&
  !!u.lessons[l].concepts &&
  !!u.lessons[l].concepts[c] &&
  !!u.lessons[l].concepts[c].started_at;
export const hasCompletedConcept = (u, l, c) =>
  hasStartedConcept(u, l, c) && !!u.lessons[l].concepts[c].completed_at;

// Project permissions
export const hasStartedProject = (u) =>
  hasStartedCourse(u) && !!u.project && !!u.project.started_at;
export const hasCompletedProject = (u) =>
  hasStartedProject(u) && !!u.project.completed_at;

// Project part permissions
export const PROJECT_PART_SUBMISSIONS = 3;
export const getProjectPartIndex = (pjs, p) =>
  pjs.findIndex(({ _key }) => _key === p);
export const getProjectPartNumber = (pjs, p) => getProjectPartIndex(pjs, p) + 1;
export const doesProjectPartExist = (pjs, p) =>
  getProjectPartIndex(pjs, p) !== -1;
export const hasStartedProjectPart = (u, p) =>
  hasStartedProject(u) &&
  !!u.project.parts[p] &&
  !!u.project.parts[p].started_at;
export const hasCompletedProjectPart = (u, p) =>
  hasStartedProjectPart(u, p) && !!u.project.parts[p].completed_at;
export const hasAttemptedProjectPart = (u, p) =>
  hasStartedProjectPart(u, p) &&
  !!u.project.parts[p].attempts &&
  u.project.parts[p].attempts.length > 0;
export const hasReceivedProjectPartFeedback = (u, p) =>
  hasAttemptedProjectPart(u, p) &&
  !!u.project.parts[p].feedback &&
  u.project.parts[p].feedback.length > 0;
export const hasRemainingProjectPartAttempts = (u, p) =>
  hasReceivedProjectPartFeedback(u, p) &&
  u.project.parts[p].feedback.length < PROJECT_PART_SUBMISSIONS;
export const hasReceivedPassingProjectPartFeedback = (u, p) => {
  if (!hasReceivedProjectPartFeedback(u, p)) return false;

  for (let i = 0; i < u.project.parts[p].feedback.length; i++) {
    const currentFeedback = u.project.parts[p].feedback[i];

    if (currentFeedback.status === 'passed' && currentFeedback.passed_at) {
      return true;
    }
  }

  return false;
};
export const hasReceivedFailingProjectPartFeedback = (u, p) => {
  if (!hasReceivedProjectPartFeedback(u, p)) return false;

  for (let i = 0; i < u.project.parts[p].feedback.length; i++) {
    const currentFeedback = u.project.parts[p].feedback[i];

    if (currentFeedback.status === 'failed' && currentFeedback.failed_at) {
      return true;
    }
  }

  return false;
};
export const getProjectPartStatus = (u, p) => {
  // If they have received feedback on the project part, and they passed...
  if (hasReceivedPassingProjectPartFeedback(u, p)) {
    return 'passed';
  }

  // If they have received feedback on the project part, and they they failed, but have remaining attempts...
  else if (
    hasReceivedFailingProjectPartFeedback(u, p) &&
    hasRemainingProjectPartAttempts(u, p)
  ) {
    return 'failed-but-pending';
  }

  // If they have received feedback on the project part, and they they failed, and they don't have any remaining attempts...
  else if (
    hasReceivedFailingProjectPartFeedback(u, p) &&
    !hasRemainingProjectPartAttempts(u, p)
  ) {
    return 'failed';
  }

  // If they have attempted the project part, but haven't received feedback on it...
  else if (
    hasAttemptedProjectPart(u, p) &&
    !hasReceivedProjectPartFeedback(u, p)
  ) {
    return 'attempted';
  }

  // If they have started the project part, but they have not completed it...
  else if (hasStartedProjectPart(u, p) && !hasCompletedProjectPart(u, p)) {
    return 'in-progress';
  }

  return 'not-started';
};
export const getProjectStatus = (u, ps) => {
  const progress = [];

  for (let i = 0; i < ps.length; i++) {
    const status = getProjectPartStatus(u, ps[i]._key);

    if (status === 'passed') progress.push('passed');
    else if (status === 'failed') progress.push('failed');
    else if (status !== 'not-started') progress.push('in-progress');
    else progress.push('not-started');
  }

  if (progress.every((i) => i === 'passed')) {
    return 'passed';
  } else if (progress.every((i) => i === 'not-started')) {
    return 'not-started';
  } else if (progress.some((i) => i === 'failed')) {
    return 'failed';
  }

  return 'in-progress';
};

// Page change
export const getNextAvailablePage = (u, ls) => {
  // If we haven't started the course at all, send them to the first lesson initiation page
  if (!hasStartedCourse(u)) return { lesson: ls[0]._id, concept: null };

  for (let i = 0; i < ls.length; i++) {
    const currentLesson = ls[i];

    for (let j = 0; j < currentLesson.concepts.length; j++) {
      const currentConcept = currentLesson.concepts[j]._id;

      if (!hasCompletedConcept(u, currentLesson._id, currentConcept)) {
        return { lesson: currentLesson._id, concept: currentConcept };
      }
    }

    // If we got here, then all concepts in that lesson have been completed
    // However, we should quickly check if there's another lesson available - if there is...
    if (ls[i + 1]) {
      const nextLessonId = ls[i + 1]._id;

      // If they haven't completed this lesson and they also haven't started the next lesson
      // Send them to the completion page
      if (
        !hasCompletedLesson(u, currentLesson._id) &&
        !hasStartedLesson(u, nextLessonId)
      ) {
        return { lesson: currentLesson._id, concept: 'complete' };
      }

      // If they have completed this lesson, but they haven't started the next one
      // Send them to the next lesson
      else if (
        hasCompletedLesson(u, currentLesson._id) &&
        !hasStartedLesson(u, nextLessonId)
      ) {
        return { lesson: nextLessonId, concept: null };
      }
    }

    // Otherwise, there are no more remaining lessons...
    else {
      // Check to make sure they've marked the last lesson as complete
      if (!hasCompletedLesson(u, currentLesson._id)) {
        return { lesson: currentLesson._id, concept: 'complete' };
      }

      // If they have, send them to the project
      return { lesson: 'project', concept: null };
    }
  }

  // Something went wrong...
  return null;
};

const checkForPrevious = (user, ls, l, c) => {
  // Are we on a project page, and has the last lesson been completed?
  if (l === 'project' && hasCompletedLesson(user, ls[ls.length - 1]._id)) {
    return true;
  }

  // Or, we're not on a project page
  else if (l !== 'project') {
    // Are we on a lesson page, and has the current lesson been completed?
    if (c === null && hasCompletedLesson(user, l)) {
      return true;
    }

    const clc = ls[getLessonIndex(ls, l)].concepts; // "Current lesson concepts"
    const lastConceptComplete = hasCompletedConcept(
      user,
      l,
      clc[clc.length - 1]._id
    );

    // Are we on a lesson completion page, and has the last concept of the current lesson been completed?
    if (c === 'complete' && lastConceptComplete) {
      return true;
    }

    // Are we on a concept page, and has the concept been completed?
    if (c !== null && c !== 'complete' && hasCompletedConcept(user, l, c)) {
      return true;
    }
  }

  return false;
};

export const usePageAvailabilityRedirect = (user, ls, course, l, c = null) => {
  // Set up a status state variable
  const [status, setStatus] = useState(
    checkForPrevious(user, ls, l, c) ? 'previous' : 'loading'
  );

  useEffect(() => {
    // If we're still in the "loading" state
    if (status === 'loading') {
      // Get the suggested page
      const suggestedPage = getNextAvailablePage(user, ls);

      // If the suggested lesson and concept are same as the ones we passed, then we're right where we're supposed to be!
      if (suggestedPage.lesson === l && suggestedPage.concept === c) {
        setStatus('available');
      }

      // Otherwise, we need to redirect the user where they're supposed to be
      else {
        setStatus('redirecting');

        let url = `/courses/${course}/${suggestedPage.lesson}`;
        if (suggestedPage.concept) url = `${url}/${suggestedPage.concept}`;

        window.location.href = url;
      }
    }
  }, [user, ls, course, l, c, status]);

  return status;
};
