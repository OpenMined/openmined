import React, { useEffect, useState } from 'react';
import { Box, Image, Flex, Link, Button, Icon, Stack } from '@chakra-ui/core';
import { useAuth, useUser } from 'reactfire';
import { Link as RRDLink } from 'react-router-dom';
import useToast, { toastConfig } from './Toast';
import useScrollPosition from '@react-hook/window-scroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons';

import GridContainer from './GridContainer';

import logo from '../assets/logo.svg';

interface LinkProps {
  title: string;
  type: string;
  auth?: boolean;
  unauth?: boolean;
  to?: string;
  onClick?: () => void;
}

const createLinks = (
  links: LinkProps[],
  user: boolean,
  isScrolled: boolean
) => {
  const appropriateLinks = (l: LinkProps) =>
    (l.auth && user) || (l.unauth && !user) || (!l.auth && !l.unauth);

  const linkStyles = {
    color: isScrolled ? 'white' : 'gray.600',
    textDecoration: 'none',
    _hover: {
      color: isScrolled ? 'gray.400' : 'black',
    },
  };

  return links
    .filter(appropriateLinks)
    .map(({ type, title, auth, unauth, ...link }: LinkProps) => {
      const as = link.to ? { as: RRDLink } : {};

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

export default () => {
  const user = useUser();
  const auth = useAuth();
  const toast = useToast();
  const isLoggedIn = !!user;

  const [show, setShow] = useState(false);

  const scrollY = useScrollPosition();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (scrollY > 0 && !isScrolled) setIsScrolled(true);
    else if (scrollY <= 0 && isScrolled) setIsScrolled(false);
  }, [scrollY, isScrolled]);

  const LEFT_LINKS: LinkProps[] = [
    {
      title: 'Courses',
      type: 'text',
      to: '/courses',
    },
  ];

  const RIGHT_LINKS: LinkProps[] = [
    {
      title: 'Login',
      type: 'text',
      to: '/login',
      unauth: true,
    },
    {
      title: 'Sign Up',
      type: 'button',
      to: '/signup',
      unauth: true,
    },
    {
      title: 'My Courses',
      type: 'text',
      to: '/my-courses',
      auth: true,
    },
    {
      title: 'Logout',
      type: 'button',
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
          .catch(({ message }) =>
            toast({
              ...toastConfig,
              title: 'Error',
              description: message,
              status: 'error',
            })
          ),
      auth: true,
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
      zIndex={1}
    >
      <GridContainer>
        <Flex as="nav" align="center" justify="space-between" wrap="wrap">
          <RRDLink to="/">
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
            {/* TODO: Icons are kinda ugly like this, do something about it when we import OMUI to the monorepo */}
            {show ? (
              <Icon as={FontAwesomeIcon} icon={faTimes} {...iconStyles} />
            ) : (
              <Icon as={FontAwesomeIcon} icon={faBars} {...iconStyles} />
            )}
          </Box>
          <Box
            display={{ base: show ? 'block' : 'none', [BREAK]: 'block' }}
            width={{ base: 'full', [BREAK]: 'auto' }}
            flexGrow={1}
            my={{ base: 4, [BREAK]: 0 }}
          >
            <Stack
              align={{ [BREAK]: 'center' }}
              direction={{ base: 'column', [BREAK]: 'row' }}
              spacing={{ base: 4, [BREAK]: 6 }}
            >
              {createLinks(LEFT_LINKS, isLoggedIn, isScrolled)}
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
              {createLinks(RIGHT_LINKS, isLoggedIn, isScrolled)}
            </Stack>
          </Box>
        </Flex>
      </GridContainer>
    </Box>
  );
};
