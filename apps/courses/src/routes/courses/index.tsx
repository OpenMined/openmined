import React, { lazy, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirestore, useFirestoreDocDataOnce, useUser } from 'reactfire';
import { useSanity } from '@openmined/shared/data-access-sanity';
import { OpenMined } from '@openmined/shared/types';

import { usePageAvailabilityRedirect } from './_helpers';
import * as queries from './_queries';
import * as configs from './_configs';
import CourseWrap from './Wrapper';
import { getCourseRef } from './_firebase';

import { MENTOR_STUDENT_TOKEN } from '../users/dashboard/Mentor';
import Loading from '../../components/Loading';

// SEE TODO (#11)

// SEE TODO (#20)

const CourseSearch = lazy(() => import('./search'));
const CourseOverview = lazy(() => import('./overview'));
const CourseComplete = lazy(() => import('./course-complete'));
const CourseProject = lazy(() => import('./project'));
const CourseProjectSubmission = lazy(() => import('./project-submission'));
const CourseProjectComplete = lazy(() => import('./project-complete'));
const CourseLesson = lazy(() => import('./lesson'));
const CourseLessonComplete = lazy(() => import('./lesson-complete'));
const CourseConcept = lazy(() => import('./concept'));

// What component do we render given what page is specified in the main routes file?
const pages = {
  search: CourseSearch,
  overview: CourseOverview,
  courseComplete: CourseComplete,
  project: CourseProject,
  projectSubmission: CourseProjectSubmission,
  projectComplete: CourseProjectComplete,
  lesson: CourseLesson,
  lessonComplete: CourseLessonComplete,
  concept: CourseConcept,
};

const PermissionsGate = ({ children, progress, which, page, ...params }) => {
  // Check whether or not we're able to see this page
  const status = usePageAvailabilityRedirect(
    progress || {}, // The user's progress
    page.lessons || page.course.lessons, // The CMS's list of lessons and concepts
    params.course, // The current course
    params.lesson || 'project', // The current lesson (or the "project" lesson)
    params.concept ? params.concept : which === 'lesson' ? null : 'complete' // The current concept, if it exists, or the appropriate lesson/project/course complete "concept"
  );

  // If we're loading or going to redirect, render the loader
  if (status === 'loading' || status === 'redirecting') return <Loading />;

  // Otherwise, render the component itself
  return children;
};

type PropType = {
  which: OpenMined.CoursePageWhich;
};

export default ({ which }: PropType) => {
  // Get all the URL params
  const params: any = useParams();

  // The mentor/student token is created when a mentor wants to view the submission page of a student
  // Since they will have different ID's, we need to ensure that IF we're a mentor trying to leave a review
  // That the "dbCourseRef" is referencing the right user
  // If we're not a mentor in the process of a review, we can assume it's a student trying to get their own "dbCourseRef"
  const mentorStudentToken = localStorage.getItem(MENTOR_STUDENT_TOKEN);

  // Get the user's current progress on their courses
  const user: firebase.User = useUser();
  const db = useFirestore();
  const dbCourseRef =
    params.course && user
      ? getCourseRef(db, mentorStudentToken || user.uid, params.course)
      : null;

  const firestore = useFirestore();
  // const dbCourse = dbCourseRef
  //  ? useFirestoreDocDataOnce(dbCourseRef)
  //  : {};
  // console.log(dbCourse)
  const [ dbCourse, setDbCourse ] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const course = await dbCourseRef.get();
      console.log('Course Reloaded');
      setDbCourse(course.data());
    }
    setDbCourse(null);
    console.log('xxxxxxxxxxxxxxxxxxx')
    dbCourseRef && fetchCourse();
  }, [params.course, params.lesson, params.concept]);

  //  dbCourseRef
  //   ? useFirestoreDocDataOnce(dbCourseRef)
  //   : {};

  // Store a reference to the server timestamp (we'll use this later to mark start and completion time)
  // Note that this value will always reflect the Date.now() value on the server, it's not a static time reference
  const serverTimestamp = useFirestore.FieldValue.serverTimestamp;

  // Create variables to store the page to render and the query we'll make to Sanity
  const CoursePage = pages[which];
  const query = queries[which](params);

  // Define what pages do not need the permissions check
  const permissionlessPages = ['search', 'overview'];

  // Get our data from the CMS
  const { data, loading } = useSanity(query);

  // Define the props we'll be passing to each page (and to the permission hook)
  const props: OpenMined.CoursePagesProp = {
    ...params,
    page: data,
    which,
    user,
    progress: dbCourse,
    ts: serverTimestamp,
  };

  console.log(loading, !dbCourse)
  // If we're still waiting on the CMS, render the loader

  const nowLoading = which === 'search'
    ? loading
    : (loading || !dbCourse);

  if (nowLoading) return <Loading />;

  // Prepare the configuration we'll send to the wrapper
  let config: any = {}
  try {
    config = configs[which](props);
  } catch(err) {
    return <Loading />
  }

  // If the page being requested doesn't require the permission gate, render the component directly
  if (permissionlessPages.includes(which)) {
    return (
      <CourseWrap {...config}>
        <CoursePage {...props} />
      </CourseWrap>
    );
  }

  // When ready, pass our component as a child of the permissions page
  return (
    <PermissionsGate {...props}>
      <CourseWrap {...config}>
        <CoursePage {...props} />
      </CourseWrap>
    </PermissionsGate>
  );
};
