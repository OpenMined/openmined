import React from 'react';
import { useParams } from 'react-router-dom';
import { useFirestore, useFirestoreDocDataOnce, useUser } from 'reactfire';
import { useSanity } from '@openmined/shared/data-access-sanity';
import Page from '@openmined/shared/util-page';

import GridContainer from '../../../components/GridContainer';
import CourseHeader from '../../../components/CourseHeader';
import { faBookOpen, faLink } from '@fortawesome/free-solid-svg-icons';

export default () => {
  const { course, lesson } = useParams();

  const { data, loading } = useSanity(
    `*[_type == "lesson" && slug._id == "${lesson}"] {
      ...,
      "firstConcept": concepts[0]._ref,
      "concepts": count(concepts),
      "course": *[_type == "course" && references(^._id) ][0] {
        title,
        "lessons": lessons[] -> {
          _id,
          title
        }
      }
    }[0]`
  );

  console.log(data);

  const user = useUser();
  const db = useFirestore();
  const dbCourseRef = db
    .collection('users')
    .doc(user.uid)
    .collection('courses')
    .doc(course);
  const dbCourse = useFirestoreDocDataOnce(dbCourseRef);

  const hasStartedCourse = Object.keys(dbCourse).length !== 0;

  if (loading) return null;

  const {
    course: { title: courseTitle, lessons },
    title,
    description,
    resources,
  } = data;
  const lessonNum = lessons.findIndex(({ _id }) => _id === lesson) + 1;

  const leftDrawerSections = [
    {
      title: 'Lessons',
      icon: faBookOpen,
      fields: lessons.map(({ _id, title }, index) => {
        let status = 'unavailable';

        if (hasStartedCourse && dbCourse.lessons && dbCourse.lessons[_id]) {
          if (dbCourse.lessons[_id].completed_at) status = 'completed';
          else status = 'available';
        } else if (index === 0) status = 'available';

        return {
          status,
          title,
          link: status !== 'unavailable' ? `/courses/${course}/${_id}` : null,
        };
      }),
    },
    {
      title: 'Resources',
      icon: faLink,
      fields: resources,
    },
  ];

  // TODO: Begin the design of the lesson page
  // TODO: Make sure that they cannot begin a lesson if they haven't completed the previous lessons (unless it's the first)

  return (
    <Page title={`${courseTitle} - ${title}`} description={description}>
      <CourseHeader
        lessonNum={lessonNum}
        title={title}
        course={course}
        leftDrawerSections={leftDrawerSections}
      />
      <GridContainer isInitial>
        <p>Course: {courseTitle}</p>
        <p>Lesson: {title}</p>
      </GridContainer>
    </Page>
  );
};
