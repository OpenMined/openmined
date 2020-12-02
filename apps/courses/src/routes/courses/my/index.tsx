import React from 'react';
import {
  Flex,
  Box,
  Text,
  Divider,
  Stack,
  Link,
  Avatar,
  AvatarBadge,
} from '@chakra-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSlack, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faPencilAlt, faComment } from '@fortawesome/free-solid-svg-icons';
import Page from '@openmined/shared/util-page';
import { useSanity } from '@openmined/shared/data-access-sanity';

import theme from '../../../theme';
import GridContainer from '../../../components/GridContainer';
import CurrentCourse from './CurrentCourse';
import QueuedCourses from './QueuedCourses';
import CommunityResources from './CommunityResources';
import { coursesProjection } from '../../../helpers';

export default () => {
  const { data, loading } = useSanity(
    `*[_type == "course"] ${coursesProjection}`
  );
  if (loading) return null;
  const currentCourse = data[0];
  // const data = [];

  const queuedCourses = data; // this will be replaced by data from api

  const resources = [
    {
      icon: faComment,
      title: 'Forum',
      description:
        'Description here of what the above promises. Mention mentors',
      linkText: 'Check it out',
      link: 'https://github.com/OpenMined/openmined/',
    },
    {
      icon: faSlack,
      title: 'Slack Community',
      description:
        'Description here of what the above promises. Mention caliber and breadth',
      linkText: 'Join OpenMined Slack',
      link: 'https://github.com/OpenMined/openmined/',
    },
    {
      icon: faPencilAlt,
      title: 'Blog',
      description:
        'Description here of what the above promises. Mention range of material',
      linkText: 'Begin Reading',
      link: 'https://github.com/OpenMined/openmined/',
    },
    {
      icon: faGithub,
      title: 'GitHub',
      description:
        'Description here of what the above promises. Mention putting skills to use',
      linkText: 'Go to GitHub',
      link: 'https://github.com/OpenMined/openmined/',
    },
  ];

  const spaceOnLeft = [4, 4, '120px', '120px'];

  return (
    <Page title="My courses">
      <GridContainer isInitial pt={[8, null, null, 16]} pb={16}>
        <Box pb={4}>
          <Flex pb={4} position="relative">
            <Avatar
              src="https://www.w3schools.com/w3images/avatar2.png"
              width="75px"
              height="75px"
              position={['static', 'static', 'absolute']}
              top={['0', '5px']}
              left={['0', '20px']}
              zIndex={2}
            />
            <Flex
              w="100%"
              pl={spaceOnLeft}
              justifyContent="space-between"
              flexDirection={['column', 'column', 'row', 'row']}
            >
              <Text fontSize="2xl" fontWeight="bold">
                Welcome Kyoko
              </Text>
              <Text fontSize="sm" color="gray.500">
                Last login Jan 01, 2021
              </Text>
            </Flex>
          </Flex>
          <Divider borderColor="gray.700" borderBottomWidth="3px" />
        </Box>
        <Flex
          justifyContent="space-around"
          flexDirection={['column', 'column', 'row', 'row']}
        >
          <CurrentCourse
            content={currentCourse}
            ml={spaceOnLeft}
            w={['90%', null, '60%', '70%']}
          />
          <Box w={['100%', null, '40%', '30%']} px={[0, null, 8, 8]}>
            <Text fontSize="xl" py={4} fontWeight="bold">
              Resources
            </Text>
            <Divider />
            <Stack py={2}>
              {resources.map((resource, index) => (
                <Link
                  color="pink.500"
                  px={4}
                  py={1}
                  href={resource.link}
                  key={index}
                  _hover={{
                    backgroundColor: theme.colors.pink[50],
                    cursor: 'pointer',
                  }}
                >
                  <FontAwesomeIcon
                    style={{ color: theme.colors.pink[700] }}
                    icon={resource.icon}
                  />
                  <Text pl={4} as="span">
                    {resource.title}
                  </Text>
                </Link>
              ))}
            </Stack>
          </Box>
        </Flex>
        <QueuedCourses pl={spaceOnLeft} queuedCourses={queuedCourses} />
        <CommunityResources resources={resources} />
      </GridContainer>
    </Page>
  );
};
