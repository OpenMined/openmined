import React from 'react';
import { useParams } from 'react-router-dom';
import { useFirestore, useFirestoreDocDataOnce, useUser } from 'reactfire';
import { Box, Heading, useDisclosure } from '@chakra-ui/core';
import { useSanity } from '@openmined/shared/data-access-sanity';
import Page from '@openmined/shared/util-page';

import GridContainer from '../../../components/GridContainer';
import CourseHeader from '../../../components/CourseHeader';
import CourseDrawer from '../../../components/CourseDrawer';

export default () => {
  const { lesson } = useParams();

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

  // const user = useUser();
  // const db = useFirestore();
  // const dbCourseRef = db
  //   .collection('users')
  //   .doc(user.uid)
  //   .collection('courses')
  //   .doc(course);
  // const dbCourse = useFirestoreDocDataOnce(dbCourseRef);

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (loading) return null;

  const {
    course: { title: courseTitle, lessons },
    title,
    description,
  } = data;
  const lessonNum = lessons.findIndex(({ _id }) => _id === lesson) + 1;

  // TODO: Start on the drawer design. Make sure to add lessons at this level, but allow for concepts at the concept level.
  // TODO: Make sure you select the right width of drawer
  // TODO: Make sure that the CourseHeader has the ability to fold responsively for the My Courses and Avatar links
  // TODO: Begin the design of the lesson page
  // TODO: Make sure that they cannot begin a lesson if they haven't completed the previous lessons (unless it's the first)

  return (
    <Page title={`${courseTitle} - ${title}`} description={description}>
      <CourseHeader
        setDrawerOpen={onOpen}
        isDrawerOpen={isOpen}
        title={`Lesson ${lessonNum}: ${title}`}
      />
      <CourseDrawer
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        header={
          <Box>
            Awesome <Heading>Okay</Heading>
          </Box>
        }
      >
        Awesome
      </CourseDrawer>
      <GridContainer isInitial>
        <p>Course: {courseTitle}</p>
        <p>Lesson: {title}</p>
      </GridContainer>
    </Page>
  );
};
