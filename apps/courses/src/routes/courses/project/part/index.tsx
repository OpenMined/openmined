import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  ListItem,
  UnorderedList,
  useToken,
  Divider,
  Image,
} from '@chakra-ui/core';
import Page from '@openmined/shared/util-page';

import GridContainer from '../../../../components/GridContainer';
import CourseHeader from '../../../../components/CourseHeader';

const content = {
  title: "Click 'n pass",
  status: 'passed',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  attempts: 1,
  max_attempts: 3,
};

export default () => {
  const { course } = useParams();

  const gray50 = useToken('colors', 'gray.50');

  const { title, description, max_attempts, attempts } = content;

  return (
    <Page title={'Title'} body={{ style: `background: ${gray50};` }}>
      {/* @ts-ignore */}
      <CourseHeader
        subtitle="Project Part"
        title={title}
        course={course}
        leftDrawerSections={[]}
      />
      <GridContainer isInitial pt={[8, null, null, 16]} pb={16}>
        <Flex
          align="flex-start"
          direction={{ base: 'column-reverse', lg: 'row' }}
        >
          <Box mr={{ lg: 16 }}>
            <Heading as="h1" size="xl">
              {title}
            </Heading>
            <Flex mt={4} mb={8} direction="row" align="center">
              {Array.from({ length: max_attempts }, (_, i) => (
                <Box
                  mr={2}
                  key={i}
                  flex={1}
                  height={1}
                  bgColor={i < attempts ? 'magenta.500' : 'gray.400'}
                />
              ))}
              <Text
                ml={16}
                as="i"
              >{`${attempts}/${max_attempts} attempts`}</Text>
            </Flex>
            <Box
              py={4}
              px={8}
              bgColor="magenta.50"
              color="magenta.500"
              borderWidth={1}
              borderRadius="md"
              borderColor="magenta.100"
            >
              <Heading as="h6" size="md">
                Instructions
              </Heading>
              <Text my={4}>
                In the text editor below please write a proposal as to which
                type of bread you prefer and why that bread is best suited for
                PB&J sandwiches. Students will be graded on the following:
              </Text>
              <UnorderedList>
                <ListItem>Clarity of message</ListItem>
                <ListItem>Organization and logic of their argument</ListItem>
                <ListItem>
                  For a full list of criteria reference the Project Rubric
                </ListItem>
              </UnorderedList>
            </Box>
            <Box
              mt={8}
              mb={4}
              py={16}
              px={24}
              bgColor="white"
              borderWidth={1}
              borderRadius="md"
              borderColor="gray.300"
            >
              <Heading as="h6" size="md">
                WYSIWYG Editor
              </Heading>
              <Divider my={4} color="gray.400" />
              <Text color="gray.700">{description}</Text>
              <Flex>
                <Image width="100%" mt={4} src="https://i1.wp.com/www.eatthis.com/wp-content/uploads/media/images/ext/134098955/peanut-butter-jelly-sandwich.jpg?resize=640%2C360&ssl=1" />
              </Flex>
            </Box>
            <Flex justify="space-between">
              <Button colorScheme="black" variant="outline">
                Back to Project
              </Button>
              <Box>
                <Button colorScheme="black">Save</Button>
                <Button ml={2} colorScheme="magenta">
                  Submit
                </Button>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </GridContainer>
    </Page>
  );
};
