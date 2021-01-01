import React from 'react';
import * as Sentry from '@sentry/react';
import { Flex, Text, Heading, Link } from '@chakra-ui/react';

import { issuesLink } from '../content/links';

const FallbackComponent = () => (
  <Flex
    w="100vw"
    h="100vh"
    p={8}
    direction="column"
    justify="center"
    align="center"
  >
    <Heading as="p" size="lg" mb={3}>
      Sorry, it looks like there was an error!
    </Heading>
    <Text color="gray.700">
      Our development team has been notified and is working on a fix. We
      apologize for the inconvenience. If you'd like to file an official bug
      report,{' '}
      <Link href={issuesLink} as="a" target="_blank" rel="noopener noreferrer">
        please do so here
      </Link>
      .
    </Text>
  </Flex>
);

export default class ErrorBoundary extends React.Component {
  render() {
    return (
      <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
        {this.props.children}
      </Sentry.ErrorBoundary>
    );
  }
}
