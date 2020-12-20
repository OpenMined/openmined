import React, { forwardRef, useEffect, useState } from 'react';
import {
  Box,
  Image,
  Flex,
  Link,
  Button,
  Icon,
  Stack,
  Divider,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  MenuDivider,
  useDisclosure,
} from '@chakra-ui/react';
import {
  useAuth,
  useFirestore,
  useUser,
  useFirestoreDocDataOnce,
} from 'reactfire';
import { Link as RRDLink } from 'react-router-dom';
import useToast, { toastConfig } from './Toast';
import useScrollPosition from '@react-hook/window-scroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faBars,
  faUserCircle,
  faCog,
  faCommentAlt,
} from '@fortawesome/free-solid-svg-icons';
import { User } from '@openmined/shared/types';

import GridContainer from './GridContainer';

import logo from '../assets/logo.svg';
import { handleErrors } from '../helpers';
import ChakraIcon from './ChakraIcon';

interface LinkProps {
  title: string;
  type: string;
  element?: React.ReactElement;
  auth?: boolean;
  unauth?: boolean;
  to?: string;
  onClick?: () => void;
}

const createLinks = (
  links: LinkProps[],
  user: boolean,
  isScrolled: boolean,
  onClick: () => void
) => {
  const appropriateLinks = (l: LinkProps) =>
    (l.auth && user) || (l.unauth && !user) || (!l.auth && !l.unauth);

  const linkStyles = {
    color: isScrolled ? 'gray.400' : 'gray.600',
    _hover: {
      color: isScrolled ? 'white' : 'black',
    },
  };

  return links
    .filter(appropriateLinks)
    .map(({ type, title, auth, unauth, ...link }: LinkProps) => {
      if (type === 'element')
        return React.cloneElement(link.element, { key: title });

      const as: any = link.to ? { as: RRDLink } : {};

      if (!link.onClick) link.onClick = onClick;
      else {
        const currOnClick = link.onClick;

        link.onClick = () => {
          currOnClick();
          onClick();
        };
      }

      if (type === 'text') {
        return (
          <Link {...as} key={title} {...link} {...linkStyles}>
            {title}
          </Link>
        );
      } else if (type === 'button') {
        return (
          <Button
            {...as}
            key={title}
            colorScheme={isScrolled ? 'white' : 'black'}
            variant="outline"
            {...link}
          >
            {title}
          </Button>
        );
      }

      return null;
    });
};
// SEE TODO (#18)
const UserAvatar = forwardRef((props, ref: React.Ref<HTMLElement>) => {
  const user: firebase.User = useUser();
  const db = useFirestore();
  const dbUserRef = db.collection('users').doc(user.uid);
  const dbUser: User = useFirestoreDocDataOnce(dbUserRef);

  return (
    <Avatar ref={ref} {...props} src={dbUser.photo_url} cursor="pointer" />
  );
});

export default ({ noScrolling }) => {
  const user: firebase.User = useUser();
  const auth = useAuth();
  const toast = useToast();
  const isLoggedIn = !!user;

  const [show, setShow] = useState(false);

  const scrollY = useScrollPosition();
  const [isScrolled, setIsScrolled] = useState(noScrolling || false);

  useEffect(() => {
    if (!noScrolling) {
      if (scrollY > 0 && !isScrolled) setIsScrolled(true);
      else if (scrollY <= 0 && isScrolled) setIsScrolled(false);
    }
  }, [scrollY, isScrolled, noScrolling]);

  const menuDisclosure = useDisclosure();

  const LEFT_LINKS = [
    {
      title: 'Courses',
      type: 'text',
      to: '/courses',
    },
  ];

  const RIGHT_LINKS = [
    {
      title: 'Sign In',
      type: 'text',
      to: '/signin',
      unauth: true,
    },
    {
      title: 'Sign Up',
      type: 'button',
      to: '/signup',
      unauth: true,
    },
    {
      title: 'Dashboard',
      type: 'text',
      to: '/users/dashboard',
      auth: true,
    },
    {
      title: 'User',
      type: 'element',
      auth: true,
      element: (
        <Menu placement="bottom-end">
          <MenuButton as={UserAvatar} />
          <MenuList>
            {user && (
              <MenuItem as={RRDLink} to={`/users/${user.uid}`}>
                {/* SEE TODO (#3) */}
                <ChakraIcon
                  icon={faUserCircle}
                  size="lg"
                  color="gray.400"
                  mr={4}
                />
                <Text color="gray.700">Profile</Text>
              </MenuItem>
            )}
            <MenuItem as={RRDLink} to="/users/settings">
              {/* SEE TODO (#3) */}
              <ChakraIcon
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
              {/* SEE TODO (#3) */}
              <ChakraIcon
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

  const BREAK = 'md';
  const iconStyles = {
    color: isScrolled ? 'white' : 'black',
    transitionProperty: 'color',
    transitionDuration: 'normal',
    transitionTimingFunction: 'ease-in-out',
  };

  return (
    <Box
      position="fixed"
      width="100%"
      top={0}
      left={0}
      py={{ base: 6, [BREAK]: 4 }}
      transitionProperty="background"
      transitionDuration="normal"
      transitionTimingFunction="ease-in-out"
      bg={isScrolled ? 'gray.900' : 'white'}
      boxShadow={{ base: 'md', [BREAK]: 'none' }}
      zIndex={1}
    >
      <GridContainer>
        <Flex as="nav" align="center" justify="space-between" wrap="wrap">
          <RRDLink to="/" onClick={() => setShow(false)}>
            <Image
              src={logo}
              alt="OpenMined Courses"
              width={[160, null, 200]}
              mr={6}
              transitionProperty="filter"
              transitionDuration="normal"
              transitionTimingFunction="normal"
              style={{
                filter: isScrolled ? 'invert(1) brightness(2)' : 'none',
              }}
            />
          </RRDLink>
          <Box display={['block', null, 'none']} onClick={() => setShow(!show)}>
            {/* SEE TODO (#3) */}
            {show ? (
              <ChakraIcon icon={faTimes} {...iconStyles} />
            ) : (
              <ChakraIcon icon={faBars} {...iconStyles} />
            )}
          </Box>
          <Box
            display={{ base: show ? 'flex' : 'none', [BREAK]: 'flex' }}
            width={{ base: 'full', [BREAK]: 'auto' }}
            flexGrow={1}
            my={{ base: 4, [BREAK]: 0 }}
          >
            <Divider
              orientation="vertical"
              height={6}
              mr={{ base: 4, [BREAK]: 6 }}
              display={{ base: 'none', [BREAK]: 'block' }}
            />
            <Stack
              align={{ [BREAK]: 'center' }}
              direction={{ base: 'column', [BREAK]: 'row' }}
              spacing={{ base: 4, [BREAK]: 6 }}
            >
              {createLinks(LEFT_LINKS, isLoggedIn, isScrolled, () =>
                setShow(false)
              )}
            </Stack>
          </Box>
          <Box
            display={{ base: show ? 'block' : 'none', [BREAK]: 'block' }}
            flexGrow={{ base: 1, [BREAK]: 0 }}
          >
            <Stack
              align={{ [BREAK]: 'center' }}
              direction={{ base: 'column', [BREAK]: 'row' }}
              spacing={{ base: 4, [BREAK]: 6 }}
            >
              {createLinks(RIGHT_LINKS, isLoggedIn, isScrolled, () =>
                setShow(false)
              )}
            </Stack>
          </Box>
        </Flex>
      </GridContainer>
    </Box>
  );
};
