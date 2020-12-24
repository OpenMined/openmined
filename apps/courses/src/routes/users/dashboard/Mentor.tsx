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
import {
  useFirestore,
  useFirestoreCollectionData,
  useFunctions,
  useUser,
} from 'reactfire';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  faCommentAlt,
  faMoneyBillWave,
  faQuestionCircle,
  faShapes,
} from '@fortawesome/free-solid-svg-icons';
import { faCalendarCheck } from '@fortawesome/free-regular-svg-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import {
  getSubmissionReviewEndTime,
  SUBMISSION_REVIEW_HOURS,
} from '../../courses/_helpers';
import ColoredTabs from '../../../components/ColoredTabs';
import useToast, { toastConfig } from '../../../components/Toast';
import Countdown from '../../../components/Countdown';
import { OpenMined } from '@openmined/shared/types';

dayjs.extend(relativeTime);

export const MENTOR_STUDENT_TOKEN = '@openmined/mentor-student-token';

const getMentorableCourses = (courses, user) =>
  user.mentorable_courses.map((id) => {
    const courseIndex = courses.findIndex(({ slug }) => slug === id);

    if (courseIndex !== -1) return courses[courseIndex];
    return null;
  });

const setupUserTokenAndGoToSubmission = (studentId, url) => {
  localStorage.setItem(MENTOR_STUDENT_TOKEN, studentId);

  window.location.href = url;
};

export const MentorContext = ({ courses }) => {
  const toast = useToast();
  const user: firebase.User = useUser();
  const db = useFirestore();
  const functions = useFunctions();
  functions.region = 'europe-west1';

  const requestResignation = functions.httpsCallable('resignReview');

  const activeReviewsRef = db
    .collectionGroup('submissions')
    .where('mentor', '==', db.doc(`/users/${user.uid}`))
    .where('status', '==', null);
  const activeReviewsData: OpenMined.CourseProjectSubmission[] = useFirestoreCollectionData(activeReviewsRef);

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
              direction={['column', null, 'row']}
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
              <Flex align="center" mt={[3, null, 0]}>
                <Button
                  variant="ghost"
                  colorScheme="gray"
                  mr={3}
                  onClick={() => {
                    requestResignation({
                      submission: review.id,
                      mentor: review.mentor.id,
                    }).then(({ data }) => {
                      if (data && !data.error) {
                        toast({
                          ...toastConfig,
                          title: 'Resigned from review',
                          description: 'You have resigned from this review',
                          status: 'success',
                        });
                      } else {
                        toast({
                          ...toastConfig,
                          title: 'Error resigning from review',
                          description: data.error,
                          status: 'error',
                        });
                      }
                    });
                  }}
                >
                  Resign
                </Button>
                <Button
                  colorScheme="black"
                  onClick={() => {
                    setupUserTokenAndGoToSubmission(
                      review.student.id,
                      `/courses/${review.course.slug}/project/${review.part}/${review.attempt}`
                    );
                  }}
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
          variant="flat"
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
          variant="flat"
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

const NullSetTabPanel = ({ children }) => (
  <Box
    p={4}
    bg="gray.100"
    color="gray.700"
    borderRadius="md"
    textAlign="center"
    fontStyle="italic"
  >
    {children}
  </Box>
);

export const MentorTabs = ({ courses, mentor }) => {
  const ProjectQueue = () => {
    const toast = useToast();
    const functions: firebase.functions.Functions = useFunctions();
    functions.region = 'europe-west1';

    const requestReview = functions.httpsCallable('assignReview');

    const [hasRequestedReview, setHasRequestedReview] = useState(false);

    const mentorableCourses = getMentorableCourses(courses, mentor);

    return (
      <SimpleGrid columns={[1, null, 2, null, 3]} spacing={6} width="full">
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

                          toast({
                            ...toastConfig,
                            title: 'Review assigned',
                            description: `You have been assigned a review, you have ${SUBMISSION_REVIEW_HOURS} hours to complete this review`,
                            status: 'success',
                          });

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
    const user: firebase.User = useUser();
    const db = useFirestore();
    const dbReviewsRef = db
      .collection('users')
      .doc(user.uid)
      .collection('reviews')
      // .where('status', '!=', 'pending')
      .orderBy('started_at', 'desc')
      .limit(10);
    const dbReviews: OpenMined.MentorReview[] = useFirestoreCollectionData(dbReviewsRef);

    const reviewHistory = dbReviews.map((r) => {
      const courseIndex = courses.findIndex(({ slug }) => slug === r.course);

      if (courseIndex !== -1) return { ...r, course: courses[courseIndex] };
      return null;
    });

    // TODO: We don't currently support pagination here - although we need to at some point
    const hasMoreReviews = false;

    // TODO: Fill this in correctly
    const numReviewed = 0;

    // TODO: Fill this in correctly
    const numResigned = 0;

    if (reviewHistory.length === 0) {
      return (
        <NullSetTabPanel>
          You have no history of reviews at this time.
        </NullSetTabPanel>
      );
    }

    return (
      <Box>
        {/* <SimpleGrid
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
        </SimpleGrid> */}
        <Heading as="p" size="md" color="gray.700" mb={3}>
          History
        </Heading>
        {reviewHistory.map((review, index) => (
          <Flex
            direction={['column', null, 'row']}
            justify="space-between"
            align="center"
            borderRadius="md"
            boxShadow="md"
            mb={3}
            p={4}
            key={index}
          >
            <Box>
              <Heading as="p" size="sm" mb={2}>
                {review.course.title}
              </Heading>
              <Text color="gray.700">
                {
                  review.course.project.parts[
                    review.course.project.parts.findIndex(
                      (p) => p._key === review.part
                    )
                  ].title
                }
              </Text>
            </Box>
            {review.completed_at && (
              <Text color="gray.700">
                {review.status === 'resigned' ? 'Resigned' : 'Reviewed'}{' '}
                {dayjs(review.completed_at.toDate()).fromNow()}
              </Text>
            )}
            {!review.completed_at && (
              <Text color="gray.700">
                Started {dayjs(review.started_at.toDate()).fromNow()}
              </Text>
            )}
            <Flex justify="center" align="center" width={200} mt={[3, null, 0]}>
              {review.status === 'resigned' && (
                <Text color="gray.700" fontStyle="italic">
                  Resigned
                </Text>
              )}
              {review.status === 'reviewed' && (
                <Button
                  variant="outline"
                  colorScheme="black"
                  onClick={() => {
                    setupUserTokenAndGoToSubmission(
                      review.student.id,
                      `/courses/${review.course.slug}/project/${review.part}/${review.attempt}`
                    );
                  }}
                >
                  See Review
                </Button>
              )}
              {review.status === 'pending' && (
                <Button
                  colorScheme="black"
                  onClick={() => {
                    setupUserTokenAndGoToSubmission(
                      review.student.id,
                      `/courses/${review.course.slug}/project/${review.part}/${review.attempt}`
                    );
                  }}
                >
                  Finish Review
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
    title: 'Rates',
    icon: faMoneyBillWave,
    link:
      'https://www.notion.so/openmined/822b6f0510a644bab826eccb1ac3a477?v=69f88b18cdbd4410af89615043c1b983',
  },
  {
    title: 'FAQ',
    icon: faQuestionCircle,
    link:
      'https://www.notion.so/openmined/FAQs-ddb46eca6ab143f6af3a6314f30ff1b5',
  },
  {
    title: 'Code of Conduct',
    icon: faGithub,
    link: 'https://github.com/OpenMined/.github/blob/master/CODE_OF_CONDUCT.md',
  },
];
