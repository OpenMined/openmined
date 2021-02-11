import {
  faBookOpen,
  faCube,
  faShapes,
} from '@fortawesome/free-solid-svg-icons';
import { CoursePagesProp } from '@openmined/shared/types';
import { getLessonNumber } from './_helpers';

export const search = () => ({
  page: {
    title: 'Courses',
  },
  header: false,
});

export const overview = ({ page }: CoursePagesProp) => ({
  page: {
    title: page.title,
    description: page.description,
  },
  header: false,
});

export const courseComplete = ({ page }: CoursePagesProp) => ({
  page: {
    title: `${page.title} - Complete`,
    description: page.description,
  },
  header: false,
});

export const project = ({
  page,
  course,
  lesson,
  progress,
}: CoursePagesProp) => ({
  page: {
    title: `${page.title} - Final Project`,
    description: page.description,
  },
  header: {
    icon: faShapes,
    title: page.project.title,
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

export const projectSubmission = project;

export const projectComplete = ({
  page,
  course,
  lesson,
  progress,
}: CoursePagesProp) => ({
  page: {
    title: `${page.title} - Complete`,
    description: page.description,
  },
  header: {
    icon: faShapes,
    title: page.title,
    subtitle: 'Final Project',
    course: course,
    lesson: lesson,
    sections: {
      type: 'lessons',
      data: page.lessons,
    },
    progress: progress,
    noShadow: true,
    noTitle: true,
  },
});

export const lesson = ({
  page,
  course,
  lesson,
  progress,
}: CoursePagesProp) => ({
  page: {
    title: `${page.course.title} - ${page.title}`,
    description: page.description,
  },
  header: {
    icon: faBookOpen,
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

export const lessonComplete = ({
  page,
  course,
  lesson,
  progress,
}: CoursePagesProp) => ({
  page: {
    title: `${page.title} - Complete`,
    description: page.description,
  },
  header: {
    icon: faBookOpen,
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

export const concept = ({
  page,
  course,
  lesson,
  concept,
  progress,
}: CoursePagesProp) => ({
  page: {
    title: `${page.title} - ${page.concept.title}`,
  },
  header: {
    icon: faCube,
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
