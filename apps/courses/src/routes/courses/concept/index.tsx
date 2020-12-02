import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFirestore, useFirestoreDocDataOnce, useUser } from 'reactfire';
import Page from '@openmined/shared/util-page';

import GridContainer from '../../../components/GridContainer';

export default () => {
  const { course, lesson, concept } = useParams();

  const user = useUser();
  const db = useFirestore();
  const dbCourseRef = db
    .collection('users')
    .doc(user.uid)
    .collection('courses')
    .doc(course);
  const dbCourse = useFirestoreDocDataOnce(dbCourseRef);

  const serverTimestamp = useFirestore.FieldValue.serverTimestamp();

  useEffect(() => {
    const hasStartedCourse = Object.keys(dbCourse).length !== 0;
    const hasStartedLesson =
      hasStartedCourse && dbCourse.lessons && dbCourse.lessons[lesson];
    const hasStartedConcept =
      hasStartedLesson &&
      dbCourse.lessons[lesson].concepts &&
      dbCourse.lessons[lesson].concepts[concept];

    // If we haven't started the course, lesson, or concept
    if (!hasStartedCourse || !hasStartedLesson || !hasStartedConcept) {
      const data = dbCourse;

      if (!hasStartedCourse) {
        data.started_at = serverTimestamp;
        data.lessons = {};
      }
      if (!hasStartedLesson) {
        data.lessons[lesson] = {
          started_at: serverTimestamp,
          concepts: {},
        };
      }
      if (!hasStartedConcept) {
        data.lessons[lesson].concepts[concept] = {
          started_at: serverTimestamp,
        };
      }

      db.collection('users')
        .doc(user.uid)
        .collection('courses')
        .doc(course)
        .set(data, { merge: true });
    }
  }, [user.uid, db, dbCourse, serverTimestamp, course, lesson, concept]);

  // TODO: Begin the design of the concept page
  // TODO: Allow for videos to be made big if they're the first item in the content
  // TODO: Allow for inline quizzes
  // TODO: Make sure that they cannot begin a concept if they haven't completed the previous concepts (unless it's the first)

  return (
    <Page title={`${lesson} - ${concept}`}>
      <GridContainer isInitial>
        <p>Course: {course}</p>
        <p>Lesson: {lesson}</p>
        <p>Concept: {concept}</p>
      </GridContainer>
    </Page>
  );
};
