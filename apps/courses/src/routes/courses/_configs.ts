import { getLessonNumber } from './_helpers';

// TODO: Check with designs to see if we HAVE to have a gray.50 background for this page
// <Page body={{ style: `background: ${gray50};` }} />
export const search = () => ({
  page: {
    title: 'Courses',
  },
  header: false,
});

export const overview = ({ page }) => ({
  page: {
    title: page.title,
    description: page.description,
  },
  header: false,
});

export const project = ({ page, course, lesson, progress }) => ({
  page: {
    title: `${page.title} - Final Project`,
    description: page.description,
  },
  header: {
    title: page.title,
    subtitle: 'Final Project',
    course: course,
    lesson: lesson,
    sections: {
      type: 'lessons',
      data: page.lessons,
    },
    progress: progress,
  },
});

export const lesson = ({ page, course, lesson, progress }) => ({
  page: {
    title: `${page.course.title} - ${page.title}`,
    description: page.description,
  },
  header: {
    title: page.title,
    subtitle: `Lesson ${getLessonNumber(page.course.lessons, lesson)}`,
    course: course,
    lesson: lesson,
    sections: {
      type: 'lessons',
      data: page.course.lessons,
    },
    resources: page.resources,
    progress: progress,
  },
});

export const lessonComplete = ({ page, course, lesson, progress }) => ({
  page: {
    title: `${page.title} - Complete`,
    description: page.description,
  },
  header: {
    title: page.title,
    subtitle: `Lesson ${getLessonNumber(page.course.lessons, lesson)}`,
    course: course,
    lesson: lesson,
    sections: {
      type: 'lessons',
      data: page.course.lessons,
    },
    resources: page.resources,
    progress: progress,
    noShadow: true,
    noTitle: true,
  },
});

export const concept = ({ page, course, lesson, concept, progress }) => ({
  page: {
    title: `${page.title} - ${page.concept.title}`,
  },
  header: {
    title: page.concept.title,
    subtitle: `Lesson ${getLessonNumber(page.course.lessons, lesson)}`,
    course: course,
    lesson: lesson,
    sections: {
      type: 'concepts',
      data: page.concepts,
    },
    resources: page.resources,
    progress: progress,
  },
});
