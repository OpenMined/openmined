import { useEffect, useState } from 'react';

// Course permissions
export const hasStartedCourse = (u) =>
  Object.keys(u).length !== 0 && !!u.started_at;
export const hasCompletedCourse = (u) =>
  hasStartedCourse(u) && !!u.completed_at;

// Lesson permissions
export const getLessonIndex = (ls, l) => ls.findIndex(({ _id }) => _id === l);
export const getLessonNumber = (ls, l) => getLessonIndex(ls, l) + 1;
export const hasStartedLesson = (u, l) =>
  hasStartedCourse(u) &&
  !!u.lessons &&
  !!u.lessons[l] &&
  !!u.lessons[l].started_at;
export const hasCompletedLesson = (u, l) =>
  hasStartedLesson(u, l) && !!u.lessons[l].completed_at;
export const doesLessonExist = (ls, l) => getLessonIndex(ls, l) !== -1;

// Concept permissions
export const getConceptIndex = (ls, l, c) =>
  ls[getLessonIndex(ls, l)].concepts.findIndex(({ _id }) => _id === c);
export const getConceptNumber = (ls, l, c) => getConceptIndex(ls, l, c) + 1;
export const hasStartedConcept = (u, l, c) =>
  hasStartedLesson(u, l) &&
  !!u.lessons[l].concepts &&
  !!u.lessons[l].concepts[c] &&
  !!u.lessons[l].concepts[c].started_at;
export const hasCompletedConcept = (u, l, c) =>
  hasStartedConcept(u, l, c) && !!u.lessons[l].concepts[c].completed_at;
export const doesConceptExist = (ls, l, c) =>
  doesLessonExist(ls, l) && getConceptIndex(ls, l, c) !== -1;

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
    checkForPrevious(user, ls, l, c) ? 'available' : 'loading'
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

        // window.location.href = url;
      }
    }
  }, [user, ls, course, l, c, status]);

  return status;
};
