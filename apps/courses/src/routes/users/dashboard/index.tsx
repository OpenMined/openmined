import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Switch,
  Text,
} from '@chakra-ui/react';
import Page from '@openmined/shared/util-page';
import { useFirebaseSanity } from '@openmined/shared/data-access-sanity';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { StudentContext, StudentTabs, studentResources } from './Student';
import { MentorContext, MentorTabs, mentorResources } from './Mentor';

import GridContainer from '../../../components/GridContainer';
import Loading from '../../../components/Loading';
import Icon from '../../../components/Icon';
import { getLinkPropsFromLink } from '../../../helpers';
import { useCourseUser } from '../../../hooks/useCourseUser';

dayjs.extend(relativeTime);

const LinkItem = ({ title, icon, link, ...props }) => (
  <Flex
    {...props}
    {...getLinkPropsFromLink(link)}
    align="center"
    p={3}
    width="full"
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

const MENTOR_MODE_KEY = '@openmined/mentor-mode';

export default () => {
  const db = useFirestore();
  const { user, isMentor, uid, authUser } = useCourseUser();

  const dbCoursesRef = db.collection('users').doc(uid).collection('courses');
  const dbCourses = useFirestoreCollectionData(dbCoursesRef, {
    idField: 'uid',
  });

  const mentorModeCache = JSON.parse(localStorage.getItem(MENTOR_MODE_KEY));
  const [mentorMode, setMentorMode] = useState(
    (mentorModeCache && mentorModeCache.enabled) || false
  );

  const resources =
    !mentorMode || !isMentor ? studentResources : mentorResources;

  const { data, loading } = useFirebaseSanity('dashboardCourses');

  if (loading || !user) return <Loading />;

  return (
    <Page title="Dashboard">
      <GridContainer isInitial pt={[8, null, null, 16]} pb={16}>
        <Grid templateColumns="repeat(12, 1fr)" alignItems="center">
          <GridItem colSpan={[12, null, null, 2]} mb={[4, null, null, 0]}>
            <Flex justify={['center', null, null, 'flex-start']}>
              {user && <Avatar src={user.photoURL || null} size="2xl" />}
            </Flex>
          </GridItem>
          <GridItem colSpan={[12, null, null, 10]}>
            <Flex
              direction={['column', null, null, 'row']}
              justify="space-between"
              align="center"
            >
              <Heading as="h1" size="lg" mb={[2, null, null, 0]}>
                Welcome, {user.first_name}!
              </Heading>
              <Flex align="center" ml={[0, null, null, 6]}>
                {isMentor && (
                  <>
                    <FormControl display="flex" alignItems="center">
                      <Switch
                        id="mentor-mode"
                        size="lg"
                        isChecked={mentorMode}
                        onChange={({ target }) => {
                          setMentorMode(target.checked);

                          localStorage.setItem(
                            MENTOR_MODE_KEY,
                            JSON.stringify({ enabled: target.checked })
                          );
                        }}
                      />
                      <FormLabel
                        htmlFor="mentor-mode"
                        m={0}
                        ml={3}
                        userSelect="none"
                        color="gray.700"
                        fontSize="md"
                        fontWeight="normal"
                      >
                        Mentor Mode
                      </FormLabel>
                    </FormControl>
                    <Divider orientation="vertical" height={6} mx={4} />
                  </>
                )}
                <Text color="gray.700" whiteSpace="nowrap">
                  Last login{' '}
                  {dayjs(
                    authUser.metadata.lastSignInTime ||
                      authUser.metadata.creationTime
                  ).fromNow()}
                </Text>
              </Flex>
            </Flex>
          </GridItem>
          <GridItem colStart={[1, null, null, 3]} colEnd={13}>
            <Flex direction={['column', null, 'row']} justify="space-between">
              <Box mt={6} width="full">
                {(!mentorMode || !isMentor) && (
                  <StudentContext
                    courses={data}
                    progress={dbCourses}
                    userIsMentor={isMentor}
                  />
                )}
                {mentorMode && isMentor && <MentorContext courses={data} />}
              </Box>
              <Box mt={6} ml={[0, null, 6, 12]} minW={240}>
                <Heading as="p" size="md">
                  Resources
                </Heading>
                <Divider my={3} />
                {resources.map((i) => (
                  <LinkItem key={i.title} {...i} />
                ))}
              </Box>
            </Flex>
          </GridItem>
          <GridItem colSpan={12}>
            <Box mt={[8, null, 12, 24]}>
              {(!mentorMode || !isMentor) && (
                <StudentTabs courses={data} progress={dbCourses} />
              )}
              {mentorMode && isMentor && (
                <MentorTabs courses={data} mentor={user} />
              )}
            </Box>
          </GridItem>
        </Grid>
      </GridContainer>
    </Page>
  );
};
