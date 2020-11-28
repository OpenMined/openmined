import React, { useState, useMemo, useRef } from 'react';
import {
  Flex,
  Box,
  SimpleGrid,
  Input,
  InputRightAddon,
  InputGroup,
  Text,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
} from '@chakra-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Page from '@openmined/shared/util-page';
import { useSanity } from '@openmined/shared/data-access-sanity';

import CourseCard from '../../components/CourseCard';
import Sidebar from './Sidebar';

const _courses = [
  {
    __i18n_lang: 'en-US',
    _createdAt: '2020-11-26T11:54:35Z',
    _id: '62427006-c610-4f78-820b-5e4d147dee0f',
    _rev: 'vxVxCBAR678lnAVxAwsb8y',
    _type: 'course',
    _updatedAt: '2020-11-26T11:54:38Z',
    color: 'green.500',
    cost: 'Free',
    description:
      'Become a data scientist and statistician capable of studying data you do not own and cannot see. Learn every major privacy-preserving technique to an intermediate level, understand how they work together, and how you can use them to safely study data owned by another organization (such as another university, enterprise, or government) without ever seeing the underlying data yourself.',
    learnHow: [
      'Build privacy-preserving technologies from scratch',
      'Use federated learning to work with protected data on remote devices',
      'Understand the math behind encrypted computations',
      'Use differential privacy budgeting with PyTorch models',
    ],
    length: '60 hours',
    level: 'Intermediate',
    prerequisites: [
      'Beginner Python, or other programming languages',
      'Experience with Numpy is helpful',
    ],
    project:
      'Train a machine learning model on private data in a one-on-one session with the data owner.',
    title: 'Foundations of Private Computation',
    visual: {
      default:
        'https://cdn.sanity.io/images/rzeg7i8f/production/36bcee542ca63d30b0bd8ecaca9bb8348ba574ef-200x200.svg',
      full:
        'https://cdn.sanity.io/images/rzeg7i8f/production/00c54e3593fed9088fbd9bd36537b80822e13fb8-200x200.svg',
    },
  },
  {
    __i18n_lang: 'en-US',
    _createdAt: '2020-11-26T11:56:32Z',
    _id: 'a4e2abc3-e1ec-4fe8-b4f9-5bdcd8d4988d',
    _rev: 'vxVxCBAR678lnAVxAwsiad',
    _type: 'course',
    _updatedAt: '2020-11-26T11:56:35Z',
    color: 'blue.500',
    cost: 'Free',
    description:
      'Learn how to stand up a private data warehouse for facilitating private data analysis, and learn how to be a user of such a system to analyze sensitive data from multiple institutions at once.',
    learnHow: [
      'Share data in a private data warehouse',
      'Access private data for statistical analysis or training machine learning models',
    ],
    length: '40 hours',
    level: 'Intermediate',
    prerequisites: ['Complete the Foundations of Private Computation Course'],
    project:
      'Set up a private data warehouse, then train models on private data provided by other students.',
    title: 'Federated Learning Across Enterprises',
    visual: {
      default:
        'https://cdn.sanity.io/images/rzeg7i8f/production/6c7f4997ece928a8ff35dc27d0c55939d8f3d63b-200x200.svg',
      full:
        'https://cdn.sanity.io/images/rzeg7i8f/production/1b7c155e6fc2c0a26337fc9e90512bac01a976df-200x200.svg',
    },
  },
  {
    __i18n_lang: 'en-US',
    _createdAt: '2020-11-26T16:09:12Z',
    _id: 'b5af6aab-bb92-4274-abd3-c1c4171f6462',
    _rev: 'vxVxCBAR678lnAVxAxJYqa',
    _type: 'course',
    _updatedAt: '2020-11-26T17:06:57Z',
    color: 'cyan.500',
    cost: 'Free',
    description:
      "Privacy infrastructure is changing how information is managed in society. In this course, you'll learn how it creates both opportunity and disruption within nearly every corner of society and how you can join this next great wave of innovation.",
    learnHow: [
      'Understand how privacy is transforming the world',
      'Learn how privacy-preserving AI can be used in products and services',
    ],
    length: '6 hours',
    lessons: [
      {
        _key: '81fa2f9ffa29',
        _ref: '8337874c-20c4-4856-95e3-dcbb4a043b63',
        _type: 'reference',
      },
    ],
    level: 'Beginner',
    prerequisites: ['None'],
    project:
      'Develop a business proposal or product spec using private AI technology.',
    title: 'Privacy and Society',
    visual: {
      default:
        'https://cdn.sanity.io/images/rzeg7i8f/production/d913196e82d84b2c38c96f3874041ee6bbf5f5db-200x200.svg',
      full:
        'https://cdn.sanity.io/images/rzeg7i8f/production/e531a6730903e1fad920730d101b9a7fab8a9648-200x200.svg',
    },
  },
  {
    __i18n_lang: 'en-US',
    _createdAt: '2020-11-26T11:57:42Z',
    _id: 'f5310836-cfd2-4676-8f2a-75bca1a19482',
    _rev: 'XJqWit7B5exXcHuIIiXVWb',
    _type: 'course',
    _updatedAt: '2020-11-26T11:57:45Z',
    color: 'orange.500',
    cost: 'Free',
    description:
      'Learn how to build mobile apps that can train models across millions of devices using federated learning.',
    learnHow: [
      'Train AI models across multiple mobile devices using federated learning',
    ],
    length: '40 hours',
    level: 'Intermediate',
    prerequisites: ['Complete the Foundations of Private Computation Course'],
    project:
      'Build a mobile app that uses federated learning to train a model across devices.',
    title: 'Federated Learning on Mobile',
    visual: {
      default:
        'https://cdn.sanity.io/images/rzeg7i8f/production/2ff1865bc25b466d4d6cda8da8fe4eba5e23be07-200x200.svg',
      full:
        'https://cdn.sanity.io/images/rzeg7i8f/production/e3561b95576e36453bab5b5785466fb968ce2919-200x200.svg',
    },
  },
];

export default () => {
  const [skillLevel, setSkillLevel] = useState('');
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [isHovered, setIsHovered] = useState(null);
  const currKeyword = useRef();

  const filterCourses = () => {
    console.log('called everytime any of the filters are changed');
    let filteredCourses = _courses || [];
    if (skillLevel === 'Beginner') filteredCourses = [];
    else if (topic === 'Topic One')
      filteredCourses = filteredCourses.slice(0, 2);
    return filteredCourses;
  };

  const courses = useMemo(filterCourses, [
    skillLevel,
    topic,
    language,
    keywords,
  ]);

  const setCurrKeyword = (e) => {
    if (currKeyword.current === undefined) return;
    // @ts-ignore (already checked for undefined case)
    const val = currKeyword.current!.value;
    if (val === '') return;
    if (e.keyCode === 13) {
      if (!keywords.includes(val)) setKeywords([val, ...keywords]);
      // @ts-ignore (already checked for undefined case)
      currKeyword.current.value = '';
      return;
    }
  };
  const removeKeyword = (keywordIndex) => {
    setKeywords((prev) => {
      const temp = [...prev];
      temp.splice(keywordIndex, keywordIndex + 1);
      return temp;
    });
  };
  const clearFilters = () => {
    setSkillLevel('');
    setTopic('');
    setLanguage('');
  };

  return (
    <Page title="Courses">
      <Box pt={150} px={3} bg="gray.50">
        <Flex justifyContent="space-around" flexDirection={['column', 'row']}>
          <Box w={['100%', '50%', '40%', '30%']} px={[8, 8, 8, 16]}>
            <Sidebar
              {...{
                skillLevel,
                setSkillLevel,
                topic,
                setTopic,
                language,
                setLanguage,
                clearFilters,
                numCourses: courses.length,
              }}
            />
          </Box>
          <Box w={['100%', '70%']} px={[8, 10]}>
            <InputGroup
              w={['100%', '70%']}
              px={2}
              py={[2, null]}
              mb={4}
              justifyContent={['center', null]}
            >
              <Input
                ref={currKeyword}
                onKeyUp={setCurrKeyword}
                placeholder="Search courses"
                list="courses"
                borderColor="gray.500"
                borderRight={0}
                color="gray.500"
              />
              <InputRightAddon
                children={<FontAwesomeIcon icon={faSearch} />}
                bg="transparent"
                borderColor="gray.500"
                borderLeft={0}
              />
            </InputGroup>
            <datalist id="courses">
              {courses.map((course, index) => (
                <option
                  key={index}
                  style={{ padding: 20 }}
                  value={course.title}
                />
              ))}
            </datalist>
            {keywords.length !== 0 && (
              <HStack px={2} spacing={4}>
                <Wrap>
                  {keywords.map((keyword, index) => (
                    <Tag
                      size="lg"
                      key={keyword}
                      borderRadius="full"
                      variant="solid"
                      colorScheme="green"
                    >
                      <TagLabel>{keyword}</TagLabel>
                      <TagCloseButton onClick={() => removeKeyword(index)} />
                    </Tag>
                  ))}
                </Wrap>
              </HStack>
            )}
            {courses.length === 0 && (
              <Box py={4}>
                <Text fontSize="3xl" px={2} fontWeight="bold">
                  Sorry there are no results
                </Text>
                <Text fontSize="lg" px={2} color="gray.600">
                  Why dont you try one of these courses to get you started
                </Text>
              </Box>
            )}
            <SimpleGrid
              py={5}
              columns={[1, null, 1, 2, 3]}
              spacing={[4, null, 6]}
              color="white"
            >
              {(courses.length !== 0 ? courses : _courses).map(
                (course, index) => (
                  <CourseCard
                    key={index}
                    {...{ ...course, ...{ index, isHovered, setIsHovered } }}
                    onClick={console.log}
                  />
                )
              )}
            </SimpleGrid>
          </Box>
        </Flex> 
      </Box>
    </Page>
  );
};
