import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFirestore, useFirestoreDocDataOnce, useUser } from 'reactfire';
import Page from '@openmined/shared/util-page';
import { useSanity } from '@openmined/shared/data-access-sanity';
import { faBookOpen, faLink } from '@fortawesome/free-solid-svg-icons';

import {
  getLessonNumber,
  hasCompletedConcept,
  hasStartedConcept,
} from '../../../helpers';
import GridContainer from '../../../components/GridContainer';
import CourseHeader from '../../../components/CourseHeader';

export default () => {
  const { course, lesson, concept } = useParams();
  const { data, loading } = useSanity(
    `*[_type == "lesson" && _id == "${lesson}"] {
      title,
      resources,
      "concept": *[_type == "concept" && _id == "${concept}"][0],
      "concepts": concepts[] -> {
        _id,
        title
      },
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

  const serverTimestamp = useFirestore.FieldValue.serverTimestamp();

  if (loading) return null;

  const {
    concept: { title, content },
    concepts,
    course: { title: courseTitle, lessons },
    resources,
    title: lessonTitle,
  } = data;

  const lessonNum = getLessonNumber(lessons, lesson);

  const leftDrawerSections = [
    {
      title: 'Concepts',
      icon: faBookOpen,
      fields: concepts.map(({ _id, title }, index) => {
        let status = 'unavailable';

        if (hasStartedConcept(dbCourse, lesson, _id)) {
          if (hasCompletedConcept(dbCourse, lesson, _id)) status = 'completed';
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
      fields: resources ? resources : [],
    },
  ];

  // useEffect(() => {
  //   // TODO: Able to outsource this to a function now
  //   const hasStartedCourse = Object.keys(dbCourse).length !== 0;
  //   const hasStartedLesson =
  //     hasStartedCourse && dbCourse.lessons && dbCourse.lessons[lesson];
  //   const hasStartedConcept =
  //     hasStartedLesson &&
  //     dbCourse.lessons[lesson].concepts &&
  //     dbCourse.lessons[lesson].concepts[concept];

  //   // If we haven't started the course, lesson, or concept
  //   if (!hasStartedCourse || !hasStartedLesson || !hasStartedConcept) {
  //     const data = dbCourse;

  //     if (!hasStartedCourse) {
  //       data.started_at = serverTimestamp;
  //       data.lessons = {};
  //     }
  //     if (!hasStartedLesson) {
  //       data.lessons[lesson] = {
  //         started_at: serverTimestamp,
  //         concepts: {},
  //       };
  //     }
  //     if (!hasStartedConcept) {
  //       data.lessons[lesson].concepts[concept] = {
  //         started_at: serverTimestamp,
  //       };
  //     }

  //     db.collection('users')
  //       .doc(user.uid)
  //       .collection('courses')
  //       .doc(course)
  //       .set(data, { merge: true });
  //   }
  // }, [user.uid, db, dbCourse, serverTimestamp, course, lesson, concept]);

  // TODO: Begin the design of the concept page
  // TODO: Allow for videos to be made big if they're the first item in the content
  // TODO: Allow for inline quizzes
  // TODO: Make sure that they cannot begin a concept if they haven't completed the previous concepts (unless it's the first)
  // TODO: Make sure that they cannot begin a concept if they haven't completed the previous lessons (unless it's the first)

  return (
    <Page title={`${lessonTitle} - ${title}`}>
      <CourseHeader
        lessonNum={lessonNum}
        title={title}
        course={course}
        leftDrawerSections={leftDrawerSections}
      />
      <GridContainer isInitial pt={[8, null, null, 16]} pb={16}>
        <p>Course: {courseTitle}</p>
        <p>Lesson: {lessonTitle}</p>
        <p>Concept: {title}</p>
      </GridContainer>
    </Page>
  );
};
