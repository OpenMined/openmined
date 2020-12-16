import React from 'react';
import {
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import GridContainer from './GridContainer';

export default ({ callback }) => {
  const { isOpen, onToggle } = useDisclosure();

  const Justification = (props) => (
    <Text as="p" mt={2} color="gray.600" {...props}>
      We're a community dedicated to promoting your online privacy rights. In
      order to sign up and log in to this website, we need to use cookies.
      However, we'd also like to learn more about our users and this requires
      using additional cookies for analytical purposes. If you're not okay with
      that, feel free to opt out below.{' '}
      <Text as="span" fontWeight="bold">
        We will never sell or share your information - it's yours.
      </Text>
    </Text>
  );

  return (
    <Box position="fixed" bottom={0} left={0} width="full" bg="gray.100" p={4}>
      <GridContainer>
        <Heading as="p" size="md" mb={2}>
          Let's talk about cookies...
        </Heading>
        <Text
          onClick={onToggle}
          cursor="pointer"
          fontWeight="bold"
          color="gray.600"
          display={{ base: 'block', md: 'none' }}
          mb={2}
        >
          Click me for {isOpen ? 'less' : 'more'} information
        </Text>
        <Box
          display={{ base: 'block', md: 'none' }}
        >
          <Collapse
            in={isOpen}
            animateOpacity
          >
            <Justification />
          </Collapse>
        </Box>
        <Justification
          display={{ base: 'none', md: 'block' }}
          width={{ lg: '80%' }}
        />
        <Flex justify={{ md: 'flex-end' }} wrap="wrap">
          <Button onClick={() => callback('necessary')} size="sm" mr={2} mt={2}>
            Only necessary cookies
          </Button>
          <Button
            onClick={() => callback('all')}
            size="sm"
            colorScheme="blue"
            mt={2}
          >
            Accept all cookies
          </Button>
        </Flex>
      </GridContainer>
    </Box>
  );
};
