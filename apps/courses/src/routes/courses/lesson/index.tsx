import React from 'react';
import { useParams, Link as RRDLink } from 'react-router-dom';
import { useFirestore, useFirestoreDocDataOnce, useUser } from 'reactfire';
import {
  faBookOpen,
  faCheckCircle,
  faExternalLinkAlt,
  faLink,
} from '@fortawesome/free-solid-svg-icons';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSanity } from '@openmined/shared/data-access-sanity';
import Page from '@openmined/shared/util-page';

import {
  getLessonNumber,
  hasCompletedLesson,
  hasStartedCourse,
  hasStartedLesson,
  usePageAvailabilityRedirect,
} from '../_helpers';
import GridContainer from '../../../components/GridContainer';
import CourseHeader from '../../../components/CourseHeader';

const Detail = ({ title, value }) => (
  <Flex align="center" mb={4}>
    <Icon as={FontAwesomeIcon} icon={faCheckCircle} size="2x" />
    <Box ml={4}>
      <Text fontWeight="bold">{title}</Text>
      <Text color="gray.700">{value}</Text>
    </Box>
  </Flex>
);

const Lesson = ({ dbCourse, data, user, db, ts, course, lesson }) => {
  const {
    course: { title: courseTitle, lessons },
    title,
    description,
    resources,
    firstConcept,
    learnFrom,
    learnHow,
    length,
    conceptsCount,
  } = data;

  // *-----*
  // PERMISSIONS LOGIC: We need to check if they're allowed to view this lesson or navigate them away.
  // *-----*

  // Check whether or not we're able to see this page
  usePageAvailabilityRedirect(dbCourse, lessons, course, lesson);

  // *-----*
  // COMPONENT LOGIC: Assuming all that permissions logic is done...
  // *-----*

  // Set the width of the sidebar
  const SIDEBAR_WIDTH = 360;

  // Get the lesson's number
  const lessonNum = getLessonNumber(lessons, lesson);

  // Define the left-side drawer sections for the <CourseHeader />
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

  const onLessonStart = () => {
    const isCourseStarted = hasStartedCourse(dbCourse);
    const isLessonStarted = hasStartedLesson(dbCourse, lesson);

    const data = dbCourse;

    // Append the course data structure
    if (!isCourseStarted) {
      data.started_at = ts();
      data.lessons = {};
    }

    // Then the lesson data structure inside that
    if (!isLessonStarted) {
      data.lessons[lesson] = {
        started_at: ts(),
        concepts: {},
      };
    }

    // When the object is constructed, store it!
    db.collection('users')
      .doc(user.uid)
      .collection('courses')
      .doc(course)
      .set(data, { merge: true })
      .then(() => {
        window.location.href = `/courses/${course}/${lesson}/${firstConcept}`;
      });
  };

  return (
    <Page title={`${courseTitle} - ${title}`} description={description}>
      <CourseHeader
        subtitle={`Lesson ${lessonNum}`}
        title={title}
        course={course}
        leftDrawerSections={leftDrawerSections}
      />
      <GridContainer isInitial pt={[8, null, null, 16]} pb={16}>
        <Flex direction={{ base: 'column-reverse', lg: 'row' }}>
          <Box
            bg="gray.100"
            p={6}
            width={{ base: 'full', lg: SIDEBAR_WIDTH }}
            flex={{ lg: `0 0 ${SIDEBAR_WIDTH}px` }}
            mr={{ lg: 16 }}
            mt={{ base: 8, lg: 0 }}
          >
            {length && <Detail title="Length" value={length} />}
            {conceptsCount && (
              <Detail title="Concepts" value={`${conceptsCount} concepts`} />
            )}
            {lessons && (
              <Detail
                title="Progress"
                value={`${lessonNum} of ${lessons.length} lessons`}
              />
            )}
            {learnFrom && (
              <>
                <Divider my={6} />
                <Heading as="p" size="sm">
                  In this Lesson:
                </Heading>
                {learnFrom.map(({ credential, image, name }) => (
                  <Flex key={name} align="center" mt={4}>
                    <Avatar src={image} size="lg" mr={4} />
                    <Box>
                      <Heading as="p" size="sm">
                        {name}
                      </Heading>
                      <Text fontSize="sm">{credential}</Text>
                    </Box>
                  </Flex>
                ))}
              </>
            )}
            {resources && (
              <>
                <Divider my={6} />
                <Heading as="p" size="sm" mb={4}>
                  Helpful Resources:
                </Heading>
                {resources.map(({ title, link }, index) => {
                  const isExternal =
                    link.includes('http://') || link.includes('https://');

                  const linkProps = isExternal
                    ? {
                        as: 'a',
                        href: link,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      }
                    : {
                        as: RRDLink,
                        to: link,
                      };

                  return (
                    <Link
                      key={index}
                      color="magenta.500"
                      _hover={{ color: 'magenta.700' }}
                      display="block"
                      mt={2}
                      {...linkProps}
                    >
                      <Flex justify="space-between" align="center">
                        <Flex align="center">
                          <Text>{title}</Text>
                        </Flex>
                        {isExternal && (
                          <Icon as={FontAwesomeIcon} icon={faExternalLinkAlt} />
                        )}
                      </Flex>
                    </Link>
                  );
                })}
              </>
            )}
          </Box>
          <Box>
            <Text color="gray.700" mb={2}>
              <Text fontWeight="bold" as="span">
                {courseTitle}
              </Text>{' '}
              | Lesson {lessonNum}
            </Text>
            <Heading as="h1" size="xl">
              {title}
            </Heading>
            <Divider my={6} />
            <Text color="gray.700" mb={6}>
              {description}
            </Text>
            {learnHow && (
              <>
                <Heading as="p" size="md" mb={4}>
                  In this lesson you'll:
                </Heading>
                <UnorderedList spacing={4} mb={6}>
                  {learnHow.map((l) => (
                    <ListItem key={l} color="gray.700">
                      {l}
                    </ListItem>
                  ))}
                </UnorderedList>
              </>
            )}
            <Button onClick={onLessonStart} colorScheme="magenta">
              Begin Lesson
            </Button>
          </Box>
        </Flex>
      </GridContainer>
    </Page>
  );
};

export default () => {
  const { course, lesson } = useParams();
  const { data, loading } = useSanity(
    `*[_type == "lesson" && _id == "${lesson}"] {
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
    }[0]`
  );

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

  if (loading) return null;

  return (
    <Lesson
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
