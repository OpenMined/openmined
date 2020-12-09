import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirestore, useFirestoreDocDataOnce, useUser } from 'reactfire';
import {
  Box,
  Button,
  CloseButton,
  Divider,
  Flex,
  Heading,
  Icon,
  Link,
  Text,
  Textarea,
} from '@chakra-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faBookOpen,
  faBullhorn,
  faCheckCircle,
  faCommentAlt,
  faLink,
  faShapes,
} from '@fortawesome/free-solid-svg-icons';
import { useSanity } from '@openmined/shared/data-access-sanity';
import Page from '@openmined/shared/util-page';

import {
  getLessonIndex,
  hasCompletedLesson,
  hasStartedLesson,
  usePageAvailabilityRedirect,
} from '../_helpers';
import useToast, { toastConfig } from '../../../components/Toast';
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
  // Destructure our data object for easier use
  const {
    course: { lessons },
    resources,
    title,
    description,
  } = data;

  // *-----*
  // PERMISSIONS LOGIC: We need to check if they're allowed to view this lesson completion page or navigate them away.
  // *-----*

  // Check whether or not we're able to see this page
  usePageAvailabilityRedirect(dbCourse, lessons, course, lesson, 'complete');

  // *-----*
  // COMPONENT LOGIC: Assuming all that permissions logic is done...
  // *-----*

  // Be able to push a toast message
  const toast = useToast();

  // Allow this component to capture the user's feedback
  const [isFeedbackActive, setFeedbackActive] = useState(false);
  const [vote, setVote] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Get the current lesson index, the lesson number, and (if applicable) the next lesson or final project
  const lessonIndex = getLessonIndex(lessons, lesson);
  const lessonNum = lessonIndex + 1;
  const nextLesson =
    lessons.length > lessonNum ? lessons[lessonNum] : 'project';

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
                  completed_at: ts(),
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

  // We need a function to be able to provide feedback for this lesson
  const onProvideFeedback = (value, feedback = null) =>
    db.collection('users').doc(user.uid).collection('feedback').doc(lesson).set(
      {
        value,
        feedback,
        type: 'lesson',
      },
      { merge: true }
    );

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

  const votes = [
    { text: '👎', val: -1 },
    { text: '👌', val: 0 },
    { text: '👍', val: 1 },
  ];

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
          {!isFeedbackActive && (
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
                  icon={
                    typeof nextLesson === 'string' ? faShapes : faArrowRight
                  }
                  color="orange.200"
                  size="lg"
                  mr={6}
                />
                <Text fontSize="lg">
                  {typeof nextLesson === 'string'
                    ? 'Final Project'
                    : nextLesson.title}
                </Text>
              </Flex>
              <Button
                width="full"
                mb={12}
                colorScheme="magenta"
                onClick={() =>
                  onCompleteLesson().then(() => {
                    window.location.href = `/courses/${course}/${
                      typeof nextLesson === 'string'
                        ? nextLesson
                        : nextLesson._id
                    }`;
                  })
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
          )}
          {isFeedbackActive && (
            <Box
              position="relative"
              bg="gray.800"
              borderRadius="md"
              p={8}
              textAlign="center"
              maxW={600}
              mx="auto"
            >
              <Flex justify={['center', null, 'flex-end']} mb={4} mt={-2}>
                <CloseButton onClick={() => setFeedbackActive(false)} />
              </Flex>
              <Heading as="p" size="lg" mb={4}>
                Send us your feedback!
              </Heading>
              <Text color="gray.400" mb={8}>
                Tell us about your experience on this lesson. Was it helpful?
                Full of bugs? Is the material no longer accurate?
              </Text>
              <Box maxW={480} mx="auto">
                <Flex justify="space-around" align="center" mb={4}>
                  {votes.map(({ text, val }) => (
                    <Text
                      fontSize="5xl"
                      key={val}
                      cursor="pointer"
                      onClick={() => setVote(val)}
                      opacity={vote !== null && vote !== val ? 0.5 : 1}
                    >
                      {text}
                    </Text>
                  ))}
                </Flex>
                <Textarea
                  placeholder="Type whatever you'd like..."
                  onChange={({ target }) => setFeedback(target.value)}
                  resize="none"
                  variant="filled"
                  mb={4}
                />
                <Button
                  onClick={() => {
                    onProvideFeedback(vote, feedback).then(() => {
                      setFeedbackActive(false);

                      toast({
                        ...toastConfig,
                        title: 'Feedback sent',
                        description:
                          "We appreciate you telling us how we're doing!",
                        status: 'success',
                      });
                    });
                  }}
                  disabled={vote === null}
                  colorScheme="magenta"
                  width="full"
                >
                  Submit
                </Button>
              </Box>
            </Box>
          )}
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
          "concepts": concepts[] -> { _id }
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
  const serverTimestamp = useFirestore.FieldValue.serverTimestamp;

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
