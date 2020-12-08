import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFirestore, useFirestoreDocDataOnce, useUser } from 'reactfire';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Link,
  Text,
} from '@chakra-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faBookOpen,
  faBullhorn,
  faCheckCircle,
  faCommentAlt,
  faLink,
} from '@fortawesome/free-solid-svg-icons';
import { useSanity } from '@openmined/shared/data-access-sanity';
import Page from '@openmined/shared/util-page';

import {
  getLessonIndex,
  hasCompletedLesson,
  hasStartedLesson,
} from '../_helpers';
import CourseHeader from '../../../components/CourseHeader';
import GridContainer from '../../../components/GridContainer';

const DetailLink = ({ icon, children, ...props }) => (
  <Box
    width={{ base: 'full', md: '35%' }}
    color="gray.400"
    textAlign="center"
    {...props}
  >
    <Icon as={FontAwesomeIcon} icon={icon} size="lg" mb={4} />
    <Text>{children}</Text>
  </Box>
);

const LessonComplete = ({ dbCourse, data, user, db, ts, course, lesson }) => {
  const navigate = useNavigate();
  const [isFeedbackActive, setFeedbackActive] = useState(false);

  // Destructure our data object for easier use
  const {
    course: { lessons },
    resources,
    title,
    description,
  } = data;

  // Get the current lesson index, and their non-zero numbers
  // Also get the next leson
  const lessonIndex = getLessonIndex(lessons, lesson);
  const lessonNum = lessonIndex + 1;
  const nextLesson = lessons.length > lessonNum ? lessons[lessonNum] : null;

  // Create a function that is triggered when the lesson is completed
  // This is triggered by clicking the "Next" button in the <ConceptFooter />
  const onCompleteLesson = () =>
    new Promise((resolve, reject) => {
      // If we haven't already completed this lesson...
      if (!hasCompletedLesson(dbCourse, lesson)) {
        // Tell the DB we've done so
        db.collection('users')
          .doc(user.uid)
          .collection('courses')
          .doc(course)
          .set(
            {
              lessons: {
                [lesson]: {
                  completed_at: ts,
                },
              },
            },
            { merge: true }
          )
          .then(resolve)
          .catch(reject);
      } else {
        resolve();
      }
    });

  const leftDrawerSections = [
    {
      title: 'Lessons',
      icon: faBookOpen,
      fields: lessons.map(({ _id, title }, index) => {
        let status = 'unavailable';

        if (hasStartedLesson(dbCourse, _id)) {
          if (hasCompletedLesson(dbCourse, _id)) status = 'completed';
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

  // TODO: Do feedback section
  // TODO: Make sure that lessons can be completed
  // TODO: Make sure that you can be directed to the project page if it's the last lesson
  // TODO: Make sure that you're redirected from this page if you're not supposed to be here

  return (
    <Page title={title} description={description}>
      <Box bg="gray.900" color="white">
        <CourseHeader
          subtitle={`Lesson ${lessonNum}`}
          title={title}
          course={course}
          leftDrawerSections={leftDrawerSections}
          noShadow
          noTitle
        />
        <GridContainer isInitial py={[8, null, null, 16]}>
          <Flex direction="column" align="center" maxW={600} mx="auto">
            <Icon
              as={FontAwesomeIcon}
              icon={faCheckCircle}
              color="teal.300"
              size="3x"
              mb={4}
            />
            <Heading as="p" size="xl" textAlign="center" mb={4}>
              Congratulations!
            </Heading>
            <Heading as="p" size="lg" textAlign="center" mb={12}>
              You just finished the "{title}" lesson.
            </Heading>
            <Flex align="center" width="full" mb={8}>
              <Divider />
              <Text
                color="gray.400"
                fontStyle="italic"
                width={200}
                textAlign="center"
              >
                Up Next
              </Text>
              <Divider />
            </Flex>
            <Flex
              bg="gray.800"
              borderRadius="md"
              align="center"
              width="full"
              p={6}
              mb={8}
            >
              <Icon
                as={FontAwesomeIcon}
                icon={faArrowRight}
                color="orange.200"
                size="lg"
                mr={6}
              />
              <Text fontSize="lg">{nextLesson.title}</Text>
            </Flex>
            <Button
              width="full"
              mb={12}
              colorScheme="magenta"
              onClick={() =>
                onCompleteLesson().then(() =>
                  navigate(`/courses/${course}/${nextLesson._id}`)
                )
              }
            >
              Continue
            </Button>
            <Flex
              direction={{ base: 'column', md: 'row' }}
              justify="space-between"
            >
              <DetailLink icon={faCommentAlt}>
                Talk about this topic further in our{' '}
                <Link
                  href="https://discussion.openmined.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="gray.400"
                  _hover={{ color: 'gray.600' }}
                  textDecoration="underline"
                >
                  discussion board
                </Link>
                .
              </DetailLink>
              <DetailLink icon={faBullhorn} mt={[8, null, 0]}>
                Tell us how we're doing! Make sure to{' '}
                <Link
                  onClick={() => setFeedbackActive(true)}
                  color="gray.400"
                  _hover={{ color: 'gray.600' }}
                  textDecoration="underline"
                >
                  give feedback
                </Link>
                .
              </DetailLink>
            </Flex>
          </Flex>
        </GridContainer>
      </Box>
    </Page>
  );
};

export default () => {
  // Get our data from the CMS
  const { course, lesson } = useParams();
  const { data, loading } = useSanity(
    `*[_type == "lesson" && _id == "${lesson}"] {
      title,
      description,
      resources,
      "course": *[_type == "course" && references(^._id)][0] {
        title,
        "lessons": lessons[] -> {
          _id,
          title,
        }
      }
    }[0]`
  );

  // Get the current user and the course object (dbCourse) for this particular course
  const user = useUser();
  const db = useFirestore();
  const dbCourseRef = db
    .collection('users')
    .doc(user.uid)
    .collection('courses')
    .doc(course);
  const dbCourse = useFirestoreDocDataOnce(dbCourseRef);

  // Store a reference to the server timestamp (we'll use this later to mark start and completion time)
  // Note that this value will always reflect the Date.now() value on the server, it's not a static time reference
  const serverTimestamp = useFirestore.FieldValue.serverTimestamp();

  // If the data from the CMS is still loading, render nothing
  if (loading) return null;

  return (
    <LessonComplete
      dbCourse={dbCourse}
      data={data}
      user={user}
      db={db}
      ts={serverTimestamp}
      course={course}
      lesson={lesson}
    />
  );
};
