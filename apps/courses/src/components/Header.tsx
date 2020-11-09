import React from 'react';
import { Box, Image, Flex, Link, Button } from '@chakra-ui/core';
import { useUser } from 'reactfire';
import { Link as RRDLink } from 'react-router-dom';
import useScrollPosition from '@react-hook/window-scroll';

import GridContainer from './GridContainer';

import logo from '../assets/logo.svg';

export default () => {
  const scrollY = useScrollPosition();
  const isScrolled = scrollY > 0;
  const user = useUser();

  return (
    <Box
      position="fixed"
      width="100%"
      top={0}
      left={0}
      py={4}
      transitionProperty="background"
      transitionDuration="normal"
      transitionTimingFunction="ease-in-out"
      bg={isScrolled ? 'gray.900' : 'white'}
      zIndex={1}
    >
      <GridContainer>
        <Flex as="nav" align="center" justify="space-between" wrap="wrap">
          <Link to="/" as={RRDLink} mr={6}>
            <Image
              src={logo}
              alt="OpenMined Courses"
              width={[160, null, 200]}
              transitionProperty="filter"
              transitionDuration="normal"
              transitionTimingFunction="normal"
              style={{
                filter: isScrolled ? 'invert(1) brightness(2)' : 'none',
              }}
            />
          </Link>
          <Flex alignItems="center">
            {!user && (
              <Button
                colorScheme={isScrolled ? 'white' : 'black'}
                variant="outline"
                ml={3}
                onClick={() =>
                  document
                    .getElementById('signup')
                    .scrollIntoView({ behavior: 'smooth' })
                }
              >
                Sign Up
              </Button>
            )}
          </Flex>
        </Flex>
      </GridContainer>
    </Box>
  );
};
