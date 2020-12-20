import React from 'react';
import { Link as RRDLink } from 'react-router-dom';
import { useFirestore } from 'reactfire';
import {
  faCheckCircle,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  getLessonNumber,
  hasStartedCourse,
  hasStartedLesson,
} from '../_helpers';
import GridContainer from '../../../components/GridContainer';
import { getLinkPropsFromLink } from '../../../helpers';
import { handleErrors } from '../../../helpers';
import useToast from '../../../components/Toast';
import { handleLessonStart } from '../_firebase';
import ChakraIcon from '../../../components/ChakraIcon';

const Detail = ({ title, value }) => (
  <Flex align="center" mb={4}>
    {/* SEE TODO (#3) */}
    <ChakraIcon icon={faCheckCircle} size="2x" />
    <Box ml={4}>
      <Text fontWeight="bold">{title}</Text>
      <Text color="gray.700">{value}</Text>
    </Box>
  </Flex>
);

export default ({ page, progress, user, ts, course, lesson }) => {
  const db = useFirestore();
  const toast = useToast();

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
  } = page;

  // Set the width of the sidebar
  const SIDEBAR_WIDTH = 360;

  // Get the lesson's number
  const lessonNum = getLessonNumber(lessons, lesson);

  const onLessonStart = () => {
    handleLessonStart(db, user.uid, course, ts, progress, lesson)
      .then(() => {
        window.location.href = `/courses/${course}/${lesson}/${firstConcept}`;
      })
      .catch((error) => handleErrors(toast, error));
  };

  return (
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
                return (
                  <Link
                    key={index}
                    color="magenta.500"
                    _hover={{ color: 'magenta.700' }}
                    display="block"
                    mt={2}
                    {...getLinkPropsFromLink(link)}
                  >
                    <Flex justify="space-between" align="center">
                      <Flex align="center">
                        <Text>{title}</Text>
                      </Flex>
                      {/* SEE TODO (#3) */}
                      {isExternal && (
                        <ChakraIcon icon={faExternalLinkAlt} />
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
  );
};
