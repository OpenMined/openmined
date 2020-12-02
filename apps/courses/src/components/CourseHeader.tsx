import React, { forwardRef } from 'react';
import {
  Box,
  Flex,
  Link,
  Icon,
  Stack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  MenuDivider,
  Heading,
} from '@chakra-ui/core';
import {
  useAuth,
  useFirestore,
  useUser,
  useFirestoreDocDataOnce,
} from 'reactfire';
import { Link as RRDLink } from 'react-router-dom';
import useToast, { toastConfig } from './Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faUserCircle,
  faCog,
  faCommentAlt,
} from '@fortawesome/free-solid-svg-icons';
import { User } from '@openmined/shared/types';

import GridContainer from './GridContainer';

import { handleErrors } from '../helpers';

interface LinkProps {
  title: string;
  type: string;
  element?: React.ReactNode;
  auth?: boolean;
  unauth?: boolean;
  to?: string;
  onClick?: () => void;
}

const createLinks = (links: LinkProps[], onClick: () => void) =>
  links.map(({ type, title, auth, unauth, ...link }: LinkProps) => {
    if (type === 'element')
      return React.cloneElement(link.element, { key: title });

    const as = link.to ? { as: RRDLink } : {};

    if (!link.onClick) link.onClick = onClick;
    else {
      const currOnClick = link.onClick;

      link.onClick = () => {
        currOnClick();
        onClick();
      };
    }

    return (
      <Link
        {...as}
        key={title}
        {...link}
        color="gray.400"
        _hover={{ color: 'white' }}
      >
        {title}
      </Link>
    );
  });

// TODO: Patrick, how much of this logic CAN and SHOULD we share with the original header?

export default ({ setDrawerOpen, isDrawerOpen, title }) => {
  const user = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const toast = useToast();

  const userAvatar = forwardRef((props, ref) => {
    const dbUserRef = db.collection('users').doc(user.uid);
    const dbUser: User = useFirestoreDocDataOnce(dbUserRef);

    return (
      <Avatar ref={ref} {...props} src={dbUser.photo_url} cursor="pointer" />
    );
  });

  const RIGHT_LINKS: LinkProps[] = [
    {
      title: 'My Courses',
      type: 'text',
      to: '/my-courses',
    },
    {
      title: 'User',
      type: 'element',
      element: (
        <Menu placement="bottom-end">
          <MenuButton as={userAvatar} />
          <MenuList>
            {user && (
              <MenuItem as={RRDLink} to={`/users/${user.uid}`}>
                <Icon
                  as={FontAwesomeIcon}
                  icon={faUserCircle}
                  size="lg"
                  color="gray.400"
                  mr={4}
                />
                <Text color="gray.700">Profile</Text>
              </MenuItem>
            )}
            <MenuItem as={RRDLink} to="/users/settings">
              <Icon
                as={FontAwesomeIcon}
                icon={faCog}
                size="lg"
                color="gray.400"
                mr={4}
              />
              <Text color="gray.700">Account Settings</Text>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              as="a"
              href="https://discussion.openmined.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon
                as={FontAwesomeIcon}
                icon={faCommentAlt}
                size="lg"
                color="gray.400"
                mr={4}
              />
              <Text color="gray.700">Forum</Text>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              onClick={() =>
                auth
                  .signOut()
                  .then(() =>
                    toast({
                      ...toastConfig,
                      title: 'Sign out successful',
                      description: 'Come back soon!',
                      status: 'success',
                    })
                  )
                  .catch((error) => handleErrors(toast, error))
              }
            >
              <Text color="gray.700">Logout</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      ),
    },
  ];

  return (
    <Box
      position="fixed"
      width="100%"
      top={0}
      left={0}
      py={4}
      bg="gray.900"
      boxShadow="md"
      zIndex={2}
    >
      <GridContainer>
        <Flex as="nav" align="center" justify="space-between">
          <Box width={1 / 3} onClick={() => setDrawerOpen(!isDrawerOpen)}>
            {/* TODO: Icons are kinda ugly like this, do something about it when we import OMUI to the monorepo */}
            <Icon as={FontAwesomeIcon} icon={faBars} color="white" />
          </Box>
          <Heading
            width={1 / 3}
            textAlign="center"
            as="span"
            size="md"
            color="white"
          >
            {title}
          </Heading>
          <Stack
            width={1 / 3}
            justify="flex-end"
            align="center"
            direction="row"
            spacing={4}
          >
            {createLinks(RIGHT_LINKS, () => setDrawerOpen(false))}
          </Stack>
        </Flex>
      </GridContainer>
    </Box>
  );
};
