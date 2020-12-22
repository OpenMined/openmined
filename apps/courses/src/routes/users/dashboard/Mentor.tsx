import React, { useState } from 'react';
import {
  Box,
  Button,
  Circle,
  Divider,
  Flex,
  Heading,
  Icon,
  Image,
  Link,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { Link as RRDLink } from 'react-router-dom';
import { faGithub, faSlack } from '@fortawesome/free-brands-svg-icons';
import { faCommentAlt, faShapes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck } from '@fortawesome/free-regular-svg-icons';

import ColoredTabs from '../../../components/ColoredTabs';
import useToast, { toastConfig } from '../../../components/Toast';
import dayjs from 'dayjs';
import {
  useFirestore,
  useFirestoreCollectionData,
  useFunctions,
  useUser,
} from 'reactfire';
import { getSubmissionReviewEndTime } from '../../courses/_helpers';
import Countdown from '../../../components/Countdown';

// TODO: Do a responsive overview of this entire page

const getMentorableCourses = (courses, mentor) =>
  mentor.courses.map((id) => {
    const courseIndex = courses.findIndex(({ slug }) => slug === id);

    if (courseIndex !== -1) return courses[courseIndex];
    return null;
  });

export const MentorContext = ({ courses, mentor }) => {
  const user = useUser();
  const db = useFirestore();
  const functions = useFunctions();
  functions.region = 'europe-west1';

  const requestResignation = functions.httpsCallable('resignReview');

  const activeReviewsRef = db
    .collectionGroup('submissions')
    .where('mentor', '==', db.doc(`/users/${user.uid}`));
  const activeReviewsData = useFirestoreCollectionData(activeReviewsRef);

  const activeReviews = activeReviewsData.map((r) => {
    const courseIndex = courses.findIndex(({ slug }) => slug === r.course);

    if (courseIndex !== -1) return { ...r, course: courses[courseIndex] };
    return null;
  });

  return (
    <Box width="full" borderRadius="md" boxShadow="lg" overflow="hidden" p={6}>
      <Heading as="p" size="md" mb={2}>
        Your Reviews
      </Heading>
      {activeReviews.length === 0 && (
        <Box p={4} bg="gray.200" color="gray.700" borderRadius="md">
          Your queue is empty, click "Review" on a course below to begin.
        </Box>
      )}
      {activeReviews.length > 0 &&
        activeReviews.map((review, index) => (
          <Box key={index} mt={activeReviews.length > 1 && index !== 0 ? 4 : 0}>
            <Text fontFamily="mono" color="gray.700">
              Time Remaining:{' '}
              <Countdown
                time={getSubmissionReviewEndTime(
                  dayjs(review.review_started_at.toDate())
                )}
              />
            </Text>
            <Flex
              p={3}
              mt={2}
              bg="gray.200"
              borderRadius="md"
              justify="space-between"
              align="center"
            >
              <Flex align="center">
                {/* SEE TODO (#3) */}
                <Icon
                  as={FontAwesomeIcon}
                  icon={faShapes}
                  size="2x"
                  ml={1}
                  mr={4}
                />
                <Heading as="p" size="sm">
                  {
                    review.course.project.parts[
                      review.course.project.parts.findIndex(
                        (p) => p._key === review.part
                      )
                    ].title
                  }
                </Heading>
              </Flex>
              <Flex align="center">
                <Button
                  variant="ghost"
                  colorScheme="gray"
                  mr={3}
                  onClick={() => {
                    requestResignation({
                      course: review.course.slug,
                      part: review.part,
                      mentor: review.mentor,
                      student: review.student,
                    }).then((d) => console.log(d));
                  }}
                >
                  Resign
                </Button>
                <Button
                  colorScheme="black"
                  as={RRDLink}
                  to={`/courses/${review.course.slug}/project/${review.part}`}
                >
                  Review
                </Button>
              </Flex>
            </Flex>
          </Box>
        ))}
      <Divider my={6} />
      <Heading as="p" size="md" mb={2}>
        Your Shifts
      </Heading>
      <Text color="gray.700" mb={6}>
        Sign up for a Discussion Board shift on our "Shift Calendar".
      </Text>
      <Flex direction={['column', null, null, 'row']} align="center">
        {/* TODO: Input link for shift calendar */}
        <Link
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          color="gray.700"
          _hover={{ color: 'gray.800' }}
        >
          <Flex align="center">
            {/* SEE TODO (#3) */}
            <Icon
              as={FontAwesomeIcon}
              icon={faCalendarCheck}
              size="lg"
              mr={3}
            />
            <Text fontWeight="bold">Shift Calendar</Text>
          </Flex>
        </Link>
        <Link
          href="https://discussion.openmined.org"
          target="_blank"
          rel="noopener noreferrer"
          ml={[0, null, null, 8]}
          mt={[2, null, null, 0]}
          color="gray.700"
          _hover={{ color: 'gray.800' }}
        >
          <Flex align="center">
            {/* SEE TODO (#3) */}
            <Icon as={FontAwesomeIcon} icon={faCommentAlt} size="lg" mr={3} />
            <Text fontWeight="bold">Discussion Board</Text>
          </Flex>
        </Link>
      </Flex>
    </Box>
  );
};

export const MentorTabs = ({ courses, mentor }) => {
  const ProjectQueue = () => {
    const toast = useToast();
    const functions = useFunctions();
    functions.region = 'europe-west1';

    const requestReview = functions.httpsCallable('assignReview');

    const [hasRequestedReview, setHasRequestedReview] = useState(false);

    const mentorableCourses = getMentorableCourses(courses, mentor);

    return (
      <SimpleGrid columns={3} spacing={6}>
        {mentorableCourses.map(
          ({ title, slug, visual: { full }, project: { parts } }) => (
            <Box key={title} borderRadius="md" boxShadow="lg" overflow="hidden">
              <Flex
                p={6}
                direction="column"
                align="center"
                bg="gray.800"
                color="white"
              >
                <Heading as="p" size="md" mb={4}>
                  {title}
                </Heading>
                <Image src={full} alt={title} />
                {/* TODO: Fill this value in */}
                {/* <Text color="gray.400" mt={4}>X in queue</Text> */}
              </Flex>
              <Flex p={6} direction="column" align="center">
                <Box mt={-3} mb={8} width="full">
                  {parts.map((part, index) => (
                    <Flex
                      align="center"
                      p={3}
                      borderBottom="1px solid"
                      borderBottomColor="gray.400"
                      key={index}
                    >
                      <Circle
                        bg="gray.800"
                        color="white"
                        fontWeight="bold"
                        boxSize={8}
                        mr={3}
                      >
                        {index + 1}
                      </Circle>
                      <Text fontWeight="bold">{part.title}</Text>
                    </Flex>
                  ))}
                </Box>
                <Flex justify="space-between" align="center" width="full">
                  <Link
                    as={RRDLink}
                    to={`/courses/${slug}`}
                    textDecoration="underline"
                    color="gray.700"
                    _hover={{ color: 'gray.800' }}
                  >
                    Project Overview
                  </Link>
                  <Button
                    colorScheme="black"
                    disabled={hasRequestedReview}
                    isLoading={hasRequestedReview}
                    onClick={() => {
                      setHasRequestedReview(true);

                      requestReview({ course: slug }).then(({ data }) => {
                        if (data && !data.error) {
                          setHasRequestedReview(false);

                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                          toast({
                            ...toastConfig,
                            title: 'Error assigning review',
                            description: data.error,
                            status: 'error',
                          });

                          setHasRequestedReview(false);
                        }
                      });
                    }}
                  >
                    Review
                  </Button>
                </Flex>
              </Flex>
            </Box>
          )
        )}
      </SimpleGrid>
    );
  };

  const MyActivity = () => {
    // TODO: Fill this in correctly
    const reviewHistory = [
      {
        title: 'Project name',
        part: 'Project part name',
        ended_at: 'January 4th, 2020',
        resigned: false,
      },
      {
        title: 'Project name',
        part: 'Project part name 2',
        ended_at: 'January 4th, 2020',
        resigned: false,
      },
      {
        title: 'Project name',
        part: 'Project part name 2',
        ended_at: 'January 2nd, 2020',
        resigned: true,
      },
      {
        title: 'Project name',
        part: 'Project part name',
        ended_at: 'January 2nd, 2020',
        resigned: true,
      },
      {
        title: 'Project name',
        part: 'Project part name 3',
        ended_at: 'January 1st, 2020',
        resigned: false,
      },
    ];

    // TODO: Fill this in correctly
    const hasMoreReviews = true;

    // TODO: Fill this in correctly
    const numReviewed = 4;

    // TODO: Fill this in correctly
    const numResigned = 1;

    return (
      <Box>
        <SimpleGrid
          columns={[1, null, 2]}
          spacing={0}
          width="full"
          bg="gray.800"
          color="white"
          borderRadius="md"
          mb={8}
          p={12}
        >
          <Flex
            direction="column"
            justify="center"
            align="center"
            textAlign="center"
            borderRight="1px solid"
            borderRightColor="gray.900"
          >
            <Heading as="p" size="3xl">
              {numReviewed}
            </Heading>
            <Text color="gray.200">Reviews Completed</Text>
          </Flex>
          <Flex
            direction="column"
            justify="center"
            align="center"
            textAlign="center"
          >
            <Heading as="p" size="3xl">
              {numResigned}
            </Heading>
            <Text color="magenta.200">Reviews Resigned</Text>
          </Flex>
        </SimpleGrid>
        <Heading as="p" size="md" color="gray.700" mb={3}>
          History
        </Heading>
        {reviewHistory.map((review, index) => (
          <Flex
            direction={['column', null, 'row']}
            justify={{ md: 'space-between' }}
            align="center"
            borderRadius="md"
            boxShadow="md"
            mb={3}
            p={4}
            key={index}
          >
            <Box>
              <Heading as="p" size="sm" mb={2}>
                {review.title}
              </Heading>
              <Text color="gray.700">{review.part}</Text>
            </Box>
            <Text color="gray.700">{review.ended_at}</Text>
            <Flex justify="center" align="center" width={200}>
              {review.resigned && (
                <Text color="gray.700" fontStyle="italic">
                  Resigned
                </Text>
              )}
              {!review.resigned && (
                <Button variant="outline" colorScheme="black">
                  See Review
                </Button>
              )}
            </Flex>
          </Flex>
        ))}
        {/* TODO: Fill this in... */}
        {hasMoreReviews && (
          <Flex justify="center" mt={3}>
            <Button
              onClick={() => console.log('LOAD MORE')}
              colorScheme="black"
            >
              Load More Reviews
            </Button>
          </Flex>
        )}
      </Box>
    );
  };

  return (
    <ColoredTabs
      content={[
        {
          title: 'Project Queue',
          panel: ProjectQueue,
          px: [8, null, null, 16],
          py: [8, null, null, 12],
        },
        {
          title: 'My Activity',
          panel: MyActivity,
          px: [8, null, null, 16],
          py: [8, null, null, 12],
        },
      ]}
    />
  );
};

export const mentorResources = [
  {
    title: 'Discussion Board',
    icon: faCommentAlt,
    link: 'https://discussion.openmined.org',
  },
  {
    title: 'Slack',
    icon: faSlack,
    link: 'https://slack.openmined.org',
  },
  {
    title: 'Code of Conduct',
    icon: faGithub,
    link: 'https://github.com/OpenMined/.github/blob/master/CODE_OF_CONDUCT.md',
  },
];
