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
export const isLessonAvailable = (u, ls, l) => {
  if (!doesLessonExist(ls, l)) return false;

  const indexOfLesson = getLessonIndex(ls, l);

  let hasCompletedPreviousLessons = true;

  for (let i = 0; i < indexOfLesson; i++) {
    const currentLesson = ls[i]._id;

    if (!hasCompletedLesson(u, currentLesson)) {
      hasCompletedPreviousLessons = false;
      break;
    }
  }

  return hasCompletedPreviousLessons;
};
export const getLastCompletedLesson = (u, ls) => {
  let lastCompletedLesson;

  for (let i = 0; i < ls.length; i++) {
    const currentLesson = ls[i]._id;

    if (hasCompletedLesson(u, currentLesson)) {
      lastCompletedLesson = currentLesson;
    } else {
      break;
    }
  }

  if (!lastCompletedLesson) return { lesson: ls[0]._id };

  return { lesson: lastCompletedLesson };
};

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
export const isConceptAvailable = (u, ls, l, c) => {
  if (!doesConceptExist(ls, l, c)) return false;
  if (!isLessonAvailable(u, ls, l)) return false;

  const indexOfLesson = getLessonIndex(ls, l);
  const indexOfConcept = getConceptIndex(ls, l, c);
  const currentLesson = ls[indexOfLesson];

  let hasCompletedPreviousConcepts = true;

  for (let i = 0; i < indexOfConcept; i++) {
    const currentConcept = currentLesson.concepts[i]._id;

    if (!hasCompletedConcept(u, l, currentConcept)) {
      hasCompletedPreviousConcepts = false;
      break;
    }
  }

  return hasCompletedPreviousConcepts;
};
export const getLastCompletedConcept = (u, ls) => {
  let lastCompletedLesson, lastCompletedConcept;

  lessonLoop: for (let i = 0; i < ls.length; i++) {
    const currentLesson = ls[i];

    for (let j = 0; j < Object.keys(currentLesson).length; j++) {
      const currentConcept = currentLesson.concepts[j]._id;

      if (hasCompletedConcept(u, currentLesson._id, currentConcept)) {
        lastCompletedLesson = currentLesson._id;
        lastCompletedConcept = currentConcept;
      } else {
        break lessonLoop;
      }
    }
  }

  if (lastCompletedLesson && !lastCompletedConcept) {
    return {
      lesson: lastCompletedLesson,
      concept: ls[lastCompletedLesson].concepts[0]._id,
    };
  } else if (!lastCompletedLesson && !lastCompletedConcept) {
    return { lesson: ls[0]._id, concept: ls[0].concepts[0]._id };
  }

  return { lesson: lastCompletedLesson, concept: lastCompletedConcept };
};
