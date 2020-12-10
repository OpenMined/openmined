import React, { lazy } from 'react';
import { useParams } from 'react-router-dom';
import { useFirestore, useFirestoreDocDataOnce, useUser } from 'reactfire';
import { useSanity } from '@openmined/shared/data-access-sanity';

import { usePageAvailabilityRedirect } from './_helpers';
import Loading from '../../components/Loading';

const CourseSearch = lazy(() => import('./search'));
const CourseOverview = lazy(() => import('./overview'));
const CourseProject = lazy(() => import('./project'));
const CourseLesson = lazy(() => import('./lesson'));
const CourseLessonComplete = lazy(() => import('./lesson-complete'));
const CourseConcept = lazy(() => import('./concept'));

// TODO: Do header and footer for some pages
// TODO: Some pages require elements to wrap the header, content, and footer... figure this out
// TODO: Just do the fucking project page already... then try the next steps
// TODO: Consider not using the firestore doc once and instead use realtime (just double check to make sure concept is okay)
// TODO: Then try navigate everywhere

// What component do we render given what page is specified in the main routes file?
const pages = {
  search: CourseSearch,
  overview: CourseOverview,
  project: CourseProject,
  lesson: CourseLesson,
  'lesson-complete': CourseLessonComplete,
  concept: CourseConcept,
};

// What query do we give to the Sanity CMS to supply the properly data for this page?
const queries = (params) => ({
  search: `*[_type == "course"] {
    title,
    description,
    level,
    length,
    cost,
    "slug": slug.current,
    visual {
      "default": default.asset -> url,
      "full": full.asset -> url
    },
  }`,
  overview: `*[_type == "course" && slug.current == "${params.course}"] {
    ...,
    "slug": slug.current,
    visual {
      "default": default.asset -> url,
      "full": full.asset -> url
    },
    learnFrom[] -> {
      ...,
      "image": image.asset -> url
    },
    lessons[] -> {
      _id,
      title,
      description,
      concepts[] -> {
        title
      }
    }
  }[0]`,
  project: `*[_type == "course" && slug.current == "${params.course}"] {
    title,
    description,
    "lessons": lessons[] -> {
      _id,
      title,
      "concepts": concepts[] -> { _id }
    }
  }[0]`,
  lesson: `*[_type == "lesson" && _id == "${params.lesson}"] {
    ...,
    learnFrom[] -> {
      ...,
      "image": image.asset -> url
    },
    "firstConcept": concepts[0]._ref,
    "conceptsCount": count(concepts),
    "course": *[_type == "course" && references(^._id) ][0] {
      title,
      "lessons": lessons[] -> {
        _id,
        title,
        "concepts": concepts[] -> { _id }
      }
    }
  }[0]`,
  'lesson-complete': `*[_type == "lesson" && _id == "${params.lesson}"] {
    title,
    description,
    resources,
    "course": *[_type == "course" && references(^._id)][0] {
      title,
      "lessons": lessons[] -> {
        _id,
        title,
        "concepts": concepts[] -> { _id }
      }
    }
  }[0]`,
  concept: `*[_type == "lesson" && _id == "${params.lesson}"] {
    title,
    resources,
    "concept": *[_type == "concept" && _id == "${params.concept}"][0],
    "concepts": concepts[] -> {
      _id,
      title
    },
    "course": *[_type == "course" && references(^._id)][0] {
      title,
      "lessons": lessons[] -> {
        _id,
        title,
        "concepts": concepts[] -> { _id }
      }
    }
  }[0]`,
});

const PermissionsGate = ({ children, progress, which, page, ...params }) => {
  // Check whether or not we're able to see this page
  const status = usePageAvailabilityRedirect(
    progress, // The user's progress
    page.lessons || page.course.lessons, // The CMS's list of lessons and concepts
    params.course, // The current course
    params.lesson || 'project', // The current lesson (or the "project" lesson)
    params.concept ? params.concept : which === 'lesson' ? null : 'complete' // The current concept, if it exists, or the appropriate lesson/lesson complete "concept"
  );

  // If we're loading or going to redirect, render the loader
  if (status === 'loading' || status === 'redirecting') return <Loading />;

  // Otherwise, render the component itself
  return children;
};

export default ({ which }) => {
  // Get all the URL params
  const params = useParams();

  // Get the user's current progress on their courses
  const user = useUser();
  const db = useFirestore();
  const dbCourseRef = params.course
    ? db
        .collection('users')
        .doc(user.uid)
        .collection('courses')
        .doc(params.course)
    : null;
  const dbCourse = dbCourseRef ? useFirestoreDocDataOnce(dbCourseRef) : [];

  // Store a reference to the server timestamp (we'll use this later to mark start and completion time)
  // Note that this value will always reflect the Date.now() value on the server, it's not a static time reference
  const serverTimestamp = useFirestore.FieldValue.serverTimestamp;

  // Create variables to store the page to render and the query we'll make to Sanity
  const CoursePage = pages[which];
  const query = queries(params)[which];

  // Define what pages do not need the permissions check
  const permissionlessPages = ['search', 'overview'];

  // Get our data from the CMS
  const { data, loading } = useSanity(query);

  // Define the props we'll be passing to each page (and to the permission hook)
  const props = {
    ...params,
    page: data,
    which,
    user,
    progress: dbCourse,
    ts: serverTimestamp,
  };

  // If we're still waiting on the CMS, render the loader
  if (loading) return <Loading />;

  // If the page being requested doesn't require the permission gate, render the component directly
  if (permissionlessPages.includes(which)) return <CoursePage {...props} />;

  // When ready, pass our component as a child of the permissions page
  return (
    <PermissionsGate {...props}>
      <CoursePage {...props} />
    </PermissionsGate>
  );
};
