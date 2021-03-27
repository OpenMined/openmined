import React from 'react';
import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  Heading,
  Text,
  Link,
  Stack,
  Divider,
} from '@chakra-ui/react';
import { useUser } from 'reactfire';
import Page from '@openmined/shared/util-page';
import { useParams, Link as RRDLink, Navigate } from 'react-router-dom';
import {
  faPencilAlt,
  faLink,
  faCog,
  faCommentAlt,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { useFirebaseSanity } from '@openmined/shared/data-access-sanity';

import GridContainer from '../../../components/GridContainer';
import Icon from '../../../components/Icon';
import CourseCompleteCard from '../../../components/CourseCompleteCard';
import { getLinkPropsFromLink } from '../../../helpers';
import { discussionLink } from '../../../content/links';
import waveform from '../../../assets/waveform/waveform-top-left-cool.png';

import { useLoadFirestoreUser } from '../../../hooks/useCourseUser';
import Loading from '../../../components/Loading';

const SocialItem = ({ title, href, icon, ...props }) => (
  <Flex align="center" {...props}>
    <Icon icon={icon} mr={2} />
    <Link
      as="a"
      color="gray.700"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {title}
    </Link>
  </Flex>
);

const LinkItem = ({ title, icon, link, ...props }) => {
  return (
    <Flex
      {...props}
      {...getLinkPropsFromLink(link)}
      align="center"
      p={3}
      width="full"
      bg="white"
      color="gray.700"
      borderRadius="md"
      _hover={{ bg: 'blue.50', color: 'blue.500' }}
      transitionProperty="background color"
      transitionDuration="normal"
      transitionTimingFunction="ease-in-out"
    >
      <Icon icon={icon} boxSize={5} color="inherit" mr={3} />
      <Text color="inherit">{title}</Text>
    </Flex>
  );
};

export default () => {
  const { uid } = useParams();
  const authUser = useUser() as firebase.User;
  const currentUid = authUser?.uid;
  const { user } = useLoadFirestoreUser(uid);
  const { data, loading } = useFirebaseSanity('profileCourses');

  if (user === undefined) {
    return <Navigate to="/" />;
  }

  if (!user || loading) {
    return <Loading />;
  }

  const isSameUser = currentUid && currentUid === uid;
  const name = `${user.first_name} ${user.last_name}`;

  const completedCourses =
    data && user.completed_courses?.length > 0
      ? user.completed_courses.map((c) => {
          const matchedCourse = data.find((d) => d.slug === c.course);
          return matchedCourse
            ? {
                progress: { completed_at: c.completed_at },
                ...matchedCourse,
              }
            : null;
        })
      : [];

  return (
    <Page title={name} description={user.description}>
      <Box
        position="relative"
        bg="gray.50"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '478px',
          height: '309px',
          zIndex: 0,
          backgroundImage: `url(${waveform})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '0% 0%',
          backgroundSize: 'contain',
          display: ['none', null, null, 'block'],
        }}
      >
        <GridContainer isInitial pt={[8, null, null, 16]} pb={16}>
          <Flex direction={['column', null, null, 'row']}>
            <Flex
              direction="column"
              align={['center', null, null, 'flex-start']}
              width={['full', null, null, 280]}
            >
              {user && (
                <Avatar src={user.photoURL} size="2xl" mb={4}>
                  {isSameUser && (
                    <RRDLink to="/users/settings">
                      <AvatarBadge
                        bg="gray.800"
                        border={0}
                        boxSize="0.75em"
                        right={2}
                        bottom={2}
                      >
                        <Icon
                          icon={faPencilAlt}
                          color="white"
                          style={{ width: '0.35em' }}
                        />
                      </AvatarBadge>
                    </RRDLink>
                  )}
                </Avatar>
              )}
              <Heading as="h1" size="lg" mb={4}>
                {name}
              </Heading>
              <Text color="gray.700" mb={6}>
                {user.description}
              </Text>
              <Stack
                direction="column"
                align={['center', null, null, 'flex-start']}
                spacing={2}
              >
                {user.github && (
                  <SocialItem
                    title={`@${user.github}`}
                    href={`https://github.com/${user.github}`}
                    icon={faGithub}
                  />
                )}
                {user.twitter && (
                  <SocialItem
                    title={`@${user.twitter}`}
                    href={`https://twitter.com/${user.twitter}`}
                    icon={faTwitter}
                  />
                )}
                {user.website && (
                  <SocialItem
                    title={user.website}
                    href={user.website}
                    icon={faLink}
                  />
                )}
              </Stack>
              {isSameUser && (
                <Box width="full">
                  <Divider my={6} />
                  <LinkItem
                    icon={faCog}
                    title="Account Settings"
                    link="/users/settings"
                    mb={2}
                  />
                  <LinkItem
                    icon={faCommentAlt}
                    title="Discussion Board"
                    link={discussionLink}
                  />
                </Box>
              )}
            </Flex>
            <Box mt={{ base: 8, lg: 16 }} ml={{ lg: 12 }} flex={1}>
              <Heading as="h3" size="md" mb={4}>
                Completed Courses
              </Heading>
              {completedCourses.length > 0 ? (
                completedCourses.map((c) => (
                  <CourseCompleteCard key={c.title} content={c} mb={6} />
                ))
              ) : (
                <Box
                  p={4}
                  bg="gray.100"
                  color="gray.700"
                  borderRadius="md"
                  textAlign="center"
                  fontStyle="italic"
                >
                  This user has not completed a course yet.
                </Box>
              )}
            </Box>
          </Flex>
        </GridContainer>
      </Box>
    </Page>
  );
};
