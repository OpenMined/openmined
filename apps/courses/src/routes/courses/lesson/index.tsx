import React from 'react';
import { useParams, Link as RRDLink, Navigate } from 'react-router-dom';
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
  hasStartedLesson,
  isLessonAvailable,
  getLastCompletedLesson,
} from '../../../helpers';
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

export default () => {
  const SIDEBAR_WIDTH = 360;

  const { course, lesson } = useParams();
  const { data, loading } = useSanity(
    `*[_type == "lesson" && slug._id == "${lesson}"] {
      ...,
      learnFrom[] -> {
        ...,
        "image": image.asset -> url
      },
      "firstConcept": concepts[0]._ref,
      "concepts": count(concepts),
      "course": *[_type == "course" && references(^._id) ][0] {
        title,
        "lessons": lessons[] -> {
          _id,
          title,
          "concepts": concepts[] -> {
            _id, title
          }
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

  if (loading) return null;

  const {
    course: { title: courseTitle, lessons },
    title,
    description,
    resources,
    firstConcept,
    learnFrom,
    learnHow,
    length,
    concepts,
  } = data;

  const lessonNum = getLessonNumber(lessons, lesson);

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

  if (!isLessonAvailable(dbCourse, lessons, lesson)) {
    const lastCompletedLesson = getLastCompletedLesson(dbCourse, lessons);

    return <Navigate to={`/courses/${course}/${lastCompletedLesson.lesson}`} />;
  }

  return (
    <Page title={`${courseTitle} - ${title}`} description={description}>
      <CourseHeader
        lessonNum={lessonNum}
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
            {concepts && (
              <Detail title="Concepts" value={`${concepts} concepts`} />
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
            <Button
              as={RRDLink}
              to={`/courses/${course}/${lesson}/${firstConcept}`}
              colorScheme="magenta"
            >
              Begin Lesson
            </Button>
          </Box>
        </Flex>
      </GridContainer>
    </Page>
  );
};
