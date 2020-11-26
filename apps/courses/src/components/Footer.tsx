import React from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Button,
  Flex,
  Divider,
  Link,
} from '@chakra-ui/core';
import GridContainer from './GridContainer';
import content from '../content/footer';

const FooterSection = ({ title, children, ...props }) => {
  return (
    <Box {...props}>
      <Text my={4} color="gray.50" fontFamily="heading" fontSize="20px">
        {title}
      </Text>
      {children}
    </Box>
  );
};

export default ({ ...props }) => {
  const { about, catalog, resources, bottom } = content;

  return (
    <Box
      position="relative"
      zIndex={10}
      bg="gray.900"
      color="white"
      py={8}
      {...props}
    >
      <GridContainer>
        <Flex
          direction={["column", null, null, "row"]}
          justifyContent="space-between"
        >
          <FooterSection width={["100%", null, null, 1/2]} title={about.title}>
            <Text color="gray.400" my={4}>
              {about.description}
            </Text>
            <Button
              my={4}
              as="a"
              href={about.button.link}
              target="_blank"
              color="gray.200"
              bgColor="gray.800"
              boxShadow="0px 4px 16px rgba(0, 0, 0, 0.3)"
            >
              {about.button.text}
            </Button>
          </FooterSection>
          <FooterSection title={catalog.title}>
            <Flex flexDirection="column">
              {catalog.courses.map(({ name, link }, i) => (
                <Link
                  key={i}
                  href={link}
                  target="_blank"
                  color="gray.400"
                  _hover={{ color: 'white' }}
                  mt={i === 0 ? 0 : 2}
                >
                  {name}
                </Link>
              ))}
            </Flex>
          </FooterSection>
          <FooterSection title={resources.title}>
            <Flex flexDirection="column">
              {resources.links.map(({ name, link }, i) => (
                <Link
                  key={i}
                  href={link}
                  target="_blank"
                  color="gray.400"
                  _hover={{ color: 'white' }}
                  mt={i === 0 ? 0 : 2}
                >
                  {name}
                </Link>
              ))}
            </Flex>
          </FooterSection>
        </Flex>
        <Flex direction={["column", null, null, "row"]} pt={16} color="gray.600" justifyContent="space-between">
          <Text>{bottom.copyright}</Text>
          <Flex pt={[4, null, null, 0]} justifyContent="space-between">
            <Text as="span">{bottom.terms_and_conditions}</Text>
            <Divider display={["none", null, null, "block"]} mx={8} orientation="vertical" />
            <Text as="span">{bottom.privacy_policy}</Text>
          </Flex>
        </Flex>
      </GridContainer>
    </Box>
  );
};
