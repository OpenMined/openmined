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
import Page from '@openmined/shared/util-page';
import { useParams, Link as RRDLink, Navigate } from 'react-router-dom';
import { User } from '@openmined/shared/types';
import { useUser, useFirestoreDocDataOnce, useFirestore } from 'reactfire';
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
  const user: firebase.User = useUser();
  const db = useFirestore();
  const { uid } = useParams();

  const dbUserRef = db.collection('users').doc(uid);
  const dbUser: User = useFirestoreDocDataOnce(dbUserRef);

  if (!Object.keys(dbUser).length) return <Navigate to="/" />;

  const { data, loading } = useFirebaseSanity('profileCourses');

  if (loading) return null;

  const isSameUser = user && uid === user.uid;
  const name = `${dbUser.first_name} ${dbUser.last_name}`;

  const completedCourses =
    data && dbUser.completed_courses && dbUser.completed_courses.length > 0
      ? dbUser.completed_courses.map((c) => {
          const matchedCourse = data.findIndex((d) => d.slug === c.course);

          if (matchedCourse !== -1) {
            return {
              progress: { completed_at: c.completed_at },
              ...data[matchedCourse],
            };
          }

          return null;
        })
      : [];

  return (
    <Page title={name} description={dbUser.description}>
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
              <Heading as="h1" size="lg" mb={4}>
                {name}
              </Heading>
              <Text color="gray.700" mb={6}>
                {dbUser.description}
              </Text>
              <Stack
                direction="column"
                align={['center', null, null, 'flex-start']}
                spacing={2}
              >
                {dbUser.github && (
                  <SocialItem
                    title={`@${dbUser.github}`}
                    href={`https://github.com/${dbUser.github}`}
                    icon={faGithub}
                  />
                )}
                {dbUser.twitter && (
                  <SocialItem
                    title={`@${dbUser.twitter}`}
                    href={`https://twitter.com/${dbUser.twitter}`}
                    icon={faTwitter}
                  />
                )}
                {dbUser.website && (
                  <SocialItem
                    title={dbUser.website}
                    href={dbUser.website}
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
              {completedCourses.length !== 0 &&
                completedCourses.map((c) => (
                  <CourseCompleteCard key={c.title} content={c} mb={6} />
                ))}
              {completedCourses.length === 0 && (
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
