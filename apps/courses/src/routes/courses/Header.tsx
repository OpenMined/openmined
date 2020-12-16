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
  Image,
  useDisclosure,
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
import { User } from '@openmined/shared/types';

import CourseDrawer from './Drawer';

import useToast, { toastConfig } from '../../components/Toast';
import { handleErrors } from '../../helpers';
import logo from '../../assets/logo.svg';

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

const userAvatar = forwardRef((props, ref) => {
  const user = useUser();
  const db = useFirestore();
  const dbUserRef = db.collection('users').doc(user.uid);
  const dbUser: User = useFirestoreDocDataOnce(dbUserRef);

  return (
    <Avatar ref={ref} {...props} src={dbUser.photo_url} cursor="pointer" />
  );
});

// SEE TODO (#10)

export default ({
  subtitle,
  title,
  course,
  leftDrawerSections,
  noShadow = false,
  noTitle = false,
}) => {
  const user = useUser();
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
            {menuLinks.map(
              ({ type, link = '', onClick, title, icon }, index) => {
                if (type === 'divider') return <MenuDivider key={index} />;

                const isExternal =
                  link.includes('http://') || link.includes('https://');

                const linkProps = isExternal
                  ? {
                      as: 'a',
                      href: link,
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    }
                  : {
                      as: RRDLink,
                      to: link,
                    };

                return (
                  <MenuItem
                    key={index}
                    {...linkProps}
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
                  </MenuItem>
                );
              }
            )}
          </MenuList>
        </Menu>
      ),
    },
  ];

  const rightDrawerSections = [
    {
      title: 'Links',
      icon: faLink,
      fields: [
        {
          title: 'My Courses',
          link: '/my-courses',
          icon: faUserGraduate,
        },
        ...menuLinks,
      ],
    },
  ];

  const BREAK = 'md';

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
        <Heading
          width={{ base: 'full', [BREAK]: 1 / 2 }}
          mx={4}
          textAlign="center"
          as="span"
          size="md"
          color="white"
        >
          {!noTitle && (
            <>
              {subtitle}: {title}
            </>
          )}
        </Heading>
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
              textDecoration="underline"
              color="magenta.200"
              _hover={{ color: 'magenta.400' }}
            >
              View Full Syllabus
            </Link>
          </>
        }
        content={leftDrawerSections}
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
