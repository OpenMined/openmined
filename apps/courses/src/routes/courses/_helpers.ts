import { faBookOpen, faLink } from '@fortawesome/free-solid-svg-icons';

// Permissions functions
export const hasStartedCourse = (userCourseObj) =>
  Object.keys(userCourseObj).length !== 0 && userCourseObj.started_at;
export const hasCompletedCourse = (userCourseObj) =>
  hasStartedCourse(userCourseObj) && userCourseObj.completed_at;

export const getLessonIndex = (lessons, lesson) =>
  lessons.findIndex(({ _id }) => _id === lesson);
export const getLessonNumber = (lessons, lesson) =>
  getLessonIndex(lessons, lesson) + 1;
export const hasStartedLesson = (userCourseObj, lesson) =>
  hasStartedCourse(userCourseObj) &&
  userCourseObj.lessons &&
  userCourseObj.lessons[lesson] &&
  userCourseObj.lessons[lesson].started_at;
export const hasCompletedLesson = (userCourseObj, lesson) =>
  hasStartedLesson(userCourseObj, lesson) &&
  userCourseObj.lessons[lesson].completed_at;
export const doesLessonExist = (lessons, lesson) =>
  getLessonIndex(lessons, lesson) !== -1;
export const isLessonAvailable = (userCourseObj, lessons, lesson) => {
  if (!doesLessonExist(lessons, lesson)) return false;

  const indexOfLesson = getLessonIndex(lessons, lesson);

  let hasCompletedPreviousLessons = true;

  for (let i = 0; i < indexOfLesson; i++) {
    const currentLesson = lessons[i]._id;

    if (!hasCompletedLesson(userCourseObj, currentLesson)) {
      hasCompletedPreviousLessons = false;
      break;
    }
  }

  return hasCompletedPreviousLessons;
};
export const getLastCompletedLesson = (userCourseObj, lessons) => {
  let lastCompletedLesson;

  for (let i = 0; i < lessons.length; i++) {
    const currentLesson = lessons[i]._id;

    if (hasCompletedLesson(userCourseObj, currentLesson)) {
      lastCompletedLesson = currentLesson;
    } else {
      break;
    }
  }

  if (!lastCompletedLesson) return { lesson: lessons[0]._id };

  return { lesson: lastCompletedLesson };
};

export const getConceptIndex = (lessons, lesson, concept) =>
  lessons[getLessonIndex(lessons, lesson)].concepts.findIndex(
    ({ _id }) => _id === concept
  );
export const getConceptNumber = (lessons, lesson, concept) =>
  getConceptIndex(lessons, lesson, concept) + 1;
export const hasStartedConcept = (userCourseObj, lesson, concept) =>
  hasStartedLesson(userCourseObj, lesson) &&
  userCourseObj.lessons[lesson].concepts &&
  userCourseObj.lessons[lesson].concepts[concept] &&
  userCourseObj.lessons[lesson].concepts[concept].started_at;
export const hasCompletedConcept = (userCourseObj, lesson, concept) =>
  hasStartedConcept(userCourseObj, lesson, concept) &&
  userCourseObj.lessons[lesson].concepts[concept].completed_at;
export const doesConceptExist = (lessons, lesson, concept) =>
  doesLessonExist(lessons, lesson) &&
  getConceptIndex(lessons, lesson, concept) !== -1;
export const isConceptAvailable = (userCourseObj, lessons, lesson, concept) => {
  if (!doesConceptExist(lessons, lesson, concept)) return false;
  if (!isLessonAvailable(userCourseObj, lessons, lesson)) return false;

  const indexOfLesson = getLessonIndex(lessons, lesson);
  const indexOfConcept = getConceptIndex(lessons, lesson, concept);
  const currentLesson = lessons[indexOfLesson];

  let hasCompletedPreviousConcepts = true;

  for (let i = 0; i < indexOfConcept; i++) {
    const currentConcept = currentLesson.concepts[i]._id;

    if (!hasCompletedConcept(userCourseObj, lesson, currentConcept)) {
      hasCompletedPreviousConcepts = false;
      break;
    }
  }

  return hasCompletedPreviousConcepts;
};
export const getLastCompletedConcept = (userCourseObj, lessons) => {
  let lastCompletedLesson, lastCompletedConcept;

  for (let i = 0; i < lessons.length; i++) {
    const currentLesson = lessons[i];

    for (let j = 0; j < Object.keys(currentLesson).length; j++) {
      const currentConcept = currentLesson.concepts[j]._id;

      if (
        hasCompletedConcept(userCourseObj, currentLesson._id, currentConcept)
      ) {
        lastCompletedLesson = currentLesson._id;
        lastCompletedConcept = currentConcept;
      } else {
        break;
      }
    }
  }

  if (lastCompletedLesson && !lastCompletedConcept) {
    return {
      lesson: lastCompletedLesson,
      concept: lessons[lastCompletedLesson].concepts[0]._id,
    };
  } else if (!lastCompletedLesson && !lastCompletedConcept) {
    return { lesson: lessons[0]._id, concept: lessons[0].concepts[0]._id };
  }

  return { lesson: lastCompletedLesson, concept: lastCompletedConcept };
};
