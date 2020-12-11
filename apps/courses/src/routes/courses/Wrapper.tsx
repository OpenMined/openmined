import React from 'react';
import { faBookOpen, faLink } from '@fortawesome/free-solid-svg-icons';
import Page from '@openmined/shared/util-page';

import CourseHeader from './Header';

import {
  hasCompletedConcept,
  hasCompletedLesson,
  hasStartedConcept,
  hasStartedLesson,
} from './_helpers';

const genDrawerSections = (
  { type, data },
  resources = [],
  progress,
  course,
  lesson
) => [
  {
    title: type === 'lessons' ? 'Lessons' : 'Concepts',
    icon: faBookOpen,
    fields: data.map(({ _id, title }, index) => {
      let status = 'unavailable';

      if (type === 'lessons') {
        if (hasCompletedLesson(progress, _id)) {
          status = 'completed';
        } else if (hasStartedLesson(progress, _id) || index === 0) {
          status = 'available';
        }
      } else if (type === 'concepts') {
        if (hasCompletedConcept(progress, lesson, _id)) {
          status = 'completed';
        } else if (hasStartedConcept(progress, lesson, _id) || index === 0) {
          status = 'available';
        }
      }

      const link =
        status !== 'unavailable'
          ? type === 'lessons'
            ? `/courses/${course}/${_id}`
            : `/courses/${course}/${lesson}/${_id}`
          : null;

      return { status, title, link };
    }),
  },
  {
    title: 'Resources',
    icon: faLink,
    fields: resources,
  },
];

export default ({ page, header, footer, children }) => {
  const leftDrawerSections =
    header &&
    genDrawerSections(
      header.sections,
      header.resources,
      header.progress,
      header.course,
      header.lesson
    );

  return (
    <Page title={page.title} description={page.description}>
      {header && (
        <CourseHeader
          subtitle={header.subtitle}
          title={header.title}
          course={header.course}
          leftDrawerSections={leftDrawerSections}
          noShadow={header.noShadow}
          noTitle={header.noTitle}
        />
      )}
      {children}
    </Page>
  );
};
