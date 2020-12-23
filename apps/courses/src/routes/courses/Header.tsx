import React from 'react';
import {
  Box,
  Flex,
  Link,
  Icon,
  Stack,
  Avatar,
  Text,
  Heading,
  Image,
  useDisclosure,
  Divider,
} from '@chakra-ui/react';
import {
  useAuth,
  useFirestore,
  useUser,
  useFirestoreDocDataOnce,
} from 'reactfire';
import { Link as RRDLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faUserCircle,
  faCog,
  faCommentAlt,
  faHome,
  faLink,
  faSignOutAlt,
  faUserGraduate,
} from '@fortawesome/free-solid-svg-icons';
import { OpenMined } from '@openmined/shared/types';

import CourseDrawer from './Drawer';
import { getUserRef } from './_firebase';

import { getLinkPropsFromLink, handleErrors } from '../../helpers';
import useToast, { toastConfig } from '../../components/Toast';
import { Popover } from '../../components/Popover';
import logo from '../../assets/logo.svg';

type LinkProps = {
  title: string;
  type: string;
  element?: React.ReactElement;
  auth?: boolean;
  unauth?: boolean;
  to?: string;
  onClick?: () => void;
};

const createLinks = (links: LinkProps[], onClick: () => void) =>
  links.map(({ type, title, auth, unauth, ...link }: LinkProps) => {
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

const UserAvatar = () => {
  const user: firebase.User = useUser();
  const db = useFirestore();
  const dbUserRef = getUserRef(db, user.uid);
  const dbUser: OpenMined.User = useFirestoreDocDataOnce(dbUserRef);

  return <Avatar src={dbUser.photo_url} cursor="pointer" />;
};

// SEE TODO (#10)

export default ({
  icon,
  title,
  subtitle,
  course,
  sections,
  noShadow = false,
  noTitle = false,
}) => {
  const user: firebase.User = useUser();
  const auth = useAuth();
  const toast = useToast();

  const {
    isOpen: isLeftDrawerOpen,
    onOpen: onLeftDrawerOpen,
    onClose: onLeftDrawerClose,
  } = useDisclosure();

  const {
    isOpen: isRightDrawerOpen,
    onOpen: onRightDrawerOpen,
    onClose: onRightDrawerClose,
  } = useDisclosure();

  const BREAK = 'md';

  const menuLinks = [
    {
      title: 'Profile',
      link: `/users/${user.uid}`,
      icon: faUserCircle,
    },
    {
      title: 'Account Settings',
      link: '/users/settings',
      icon: faCog,
    },
    {
      title: 'Forum',
      link: 'https://discussion.openmined.org',
      icon: faCommentAlt,
    },
    {
      type: 'divider',
    },
    {
      title: 'Logout',
      icon: faSignOutAlt,
      onClick: () =>
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
          .catch((error) => handleErrors(toast, error)),
    },
  ];

  const RIGHT_LINKS: LinkProps[] = [
    {
      title: 'Dashboard',
      type: 'text',
      to: '/users/dashboard',
    },
    {
      title: 'User',
      type: 'element',
      element: (
        <Popover
          trigger={UserAvatar}
          position="bottom"
          alignment={{ base: 'start', [BREAK]: 'end' }}
          clickShouldCloseContent
        >
          <Stack spacing={3}>
            {menuLinks.map(
              ({ type, link = '', onClick, title, icon }, index) => {
                if (type === 'divider') return <Divider key={index} />;

                return (
                  <Flex
                    align="center"
                    key={index}
                    {...getLinkPropsFromLink(link)}
                    onClick={() => {
                      if (onClick) onClick();
                    }}
                  >
                    {/* SEE TODO (#3) */}
                    {icon && (
                      <Icon
                        as={FontAwesomeIcon}
                        icon={icon}
                        size="lg"
                        color="gray.400"
                        mr={4}
                      />
                    )}
                    <Text color="gray.700">{title}</Text>
                  </Flex>
                );
              }
            )}
          </Stack>
        </Popover>
      ),
    },
  ];

  const rightDrawerSections = [
    {
      title: 'Links',
      icon: faLink,
      fields: [
        {
          title: 'Dashboard',
          link: '/users/dashboard',
          icon: faUserGraduate,
        },
        ...menuLinks,
      ],
    },
  ];

  return (
    <Box
      position="fixed"
      width="100%"
      top={0}
      left={0}
      px={8}
      py={{ base: 6, [BREAK]: 4 }}
      bg="gray.900"
      boxShadow={noShadow ? null : 'md'}
      zIndex={2}
    >
      <Flex as="nav" align="center" justify="space-between">
        <Box width={{ base: 6, [BREAK]: 1 / 4 }}>
          {/* SEE TODO (#3) */}
          <Icon
            as={FontAwesomeIcon}
            icon={faBars}
            color="white"
            cursor="pointer"
            onClick={isLeftDrawerOpen ? onLeftDrawerClose : onLeftDrawerOpen}
          />
        </Box>
        <Box width={{ base: 'full', [BREAK]: 1 / 2 }} mx={4}>
          {!noTitle && (
            <Flex justify="center" align="center">
              {/* SEE TODO (#3) */}
              {icon && (
                <Icon
                  as={FontAwesomeIcon}
                  icon={icon}
                  color="gray.700"
                  size="lg"
                  mr={4}
                />
              )}
              <Heading as="span" size="md" color="white">
                {subtitle}: {title}
              </Heading>
            </Flex>
          )}
        </Box>
        <Stack
          width={1 / 4}
          justify="flex-end"
          align="center"
          direction="row"
          spacing={6}
          display={{ base: 'none', [BREAK]: 'flex' }}
        >
          {createLinks(RIGHT_LINKS, onRightDrawerClose)}
        </Stack>
        <Flex
          width={6}
          justify="flex-end"
          display={{ base: 'flex', [BREAK]: 'none' }}
        >
          {/* SEE TODO (#3) */}
          <Icon
            as={FontAwesomeIcon}
            icon={faHome}
            size="lg"
            color="white"
            onClick={isRightDrawerOpen ? onRightDrawerClose : onRightDrawerOpen}
          />
        </Flex>
      </Flex>
      <CourseDrawer
        isOpen={isLeftDrawerOpen}
        onOpen={onLeftDrawerOpen}
        onClose={onLeftDrawerClose}
        header={
          <>
            <Text color="gray.400" mb={1}>
              {subtitle}
            </Text>
            <Heading as="span" size="lg" display="block" mb={3}>
              {title}
            </Heading>
            <Link
              as={RRDLink}
              to={`/courses/${course}`}
              color="cyan.200"
              _hover={{ color: 'cyan.400' }}
            >
              View Full Syllabus
            </Link>
          </>
        }
        content={sections}
      />
      <CourseDrawer
        isOpen={isRightDrawerOpen}
        onOpen={onRightDrawerOpen}
        onClose={onRightDrawerClose}
        placement="right"
        header={
          <RRDLink to="/" onClick={onRightDrawerClose}>
            <Image
              src={logo}
              alt="OpenMined Courses"
              width={[160, null, 200]}
              style={{ filter: 'invert(1) brightness(2)' }}
            />
          </RRDLink>
        }
        content={rightDrawerSections}
      />
    </Box>
  );
};
