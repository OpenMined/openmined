import React, { useState } from 'react';
import {
  Flex,
  Box,
  SimpleGrid,
  Input,
  InputRightAddon,
  InputGroup,
  Text,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  useToken,
  Stack,
} from '@chakra-ui/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { useSanity } from '@openmined/shared/data-access-sanity';
import Page from '@openmined/shared/util-page';

import Sidebar from './Sidebar';

import GridContainer from '../../../components/GridContainer';
import Course from '../../../components/CourseCard';
import { coursesProjection } from '../../../helpers';

export default () => {
  const gray50 = useToken('colors', 'gray.50');
  const gray600 = useToken('colors', 'gray.600');

  const [skillLevel, setSkillLevel] = useState('');
  const [topics, setTopics] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [currKeyword, setCurrKeyword] = useState('');

  const filters = [
    {
      title: 'Skill Level',
      value: skillLevel,
      setter: setSkillLevel,
      options: ['Beginner', 'Intermediate', 'Advanced'],
    },
    {
      title: 'Topic',
      multiple: true,
      value: topics,
      setter: setTopics,
      options: ['Topic One', 'Topic Two', 'Topic Three'],
    },
    {
      title: 'Language',
      multiple: true,
      value: languages,
      setter: setLanguages,
      options: ['Python', 'Javascript', 'Scala', 'R', 'SQL', 'Julia'],
    },
  ];

  const { data, loading } = useSanity(
    `*[_type == "course"] ${coursesProjection}`
  );

  const courseFilter = (course) => {
    const NO_FILTER = true;

    const hasSkillLevel =
      skillLevel && course.level ? skillLevel === course.level : NO_FILTER;

    const hasTopic =
      topics && course.topics
        ? topics.some((topic) => course.topics.includes(topic))
        : NO_FILTER;

    const hasLanguages =
      languages && course.languages
        ? languages.some((language) => course.languages.includes(language))
        : NO_FILTER;

    return hasSkillLevel && hasTopic && hasLanguages;
  };

  const courses = data ? data.filter((course) => courseFilter(course)) : [];

  const addKeyword = (e) => {
    const keyword = e.target.value;

    if (!keyword || keyword.length === 0) return;

    if (e.keyCode === 13) {
      if (!keywords.includes(keyword)) {
        setKeywords([keyword, ...keywords]);
        setCurrKeyword('');
      }
    }
  };

  const removeKeyword = (keywordIndex) => {
    setKeywords((prev) => {
      const temp = [...prev];
      temp.splice(keywordIndex, 1);
      return temp;
    });
  };

  const clearFilters = () => {
    setSkillLevel('');
    setTopics([]);
    setLanguages([]);
  };

  if (loading) return null;

  return (
    <Page title="Courses" body={{ style: `background: ${gray50};` }}>
      <GridContainer isInitial pt={[8, null, null, 16]} pb={16}>
        <Flex justifyContent="space-around" flexDirection={['column', 'row']}>
          <Box w={['100%', '50%', '40%', '30%']} px={[8, 8, 8, 16]}>
            <Sidebar
              filters={filters}
              numCourses={courses.length}
              clearFilters={clearFilters}
            />
          </Box>
          <Box w={['100%', '70%']} px={[8, 0]}>
            <InputGroup
              w={['100%', '70%']}
              px={[2, 0]}
              py={[2, null]}
              mb={4}
              justifyContent={['center', null]}
              colorScheme="cyan"
              borderColor="gray.300"
            >
              <Input
                value={currKeyword}
                onChange={(e) => setCurrKeyword(e.target.value)}
                onKeyUp={addKeyword}
                placeholder="Search courses"
                list="courses"
                borderRight={0}
              />
              <InputRightAddon
                children={<FontAwesomeIcon color={gray600} icon={faSearch} />}
                bg="transparent"
                borderLeft={0}
              />
            </InputGroup>
            {keywords.length !== 0 && (
              <Stack direction="row" spacing={4}>
                <Wrap>
                  {keywords.map((keyword, index) => (
                    <Tag
                      size="lg"
                      key={keyword}
                      borderRadius="full"
                      colorScheme="cyan"
                      variant="subtle"
                      color="cyan.800"
                    >
                      <TagLabel opacity={1}>{keyword}</TagLabel>
                      <TagCloseButton onClick={() => removeKeyword(index)} />
                    </Tag>
                  ))}
                </Wrap>
              </Stack>
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
              {courses &&
                courses.map((course, i) => <Course key={i} content={course} />)}
            </SimpleGrid>
          </Box>
        </Flex>
      </GridContainer>
    </Page>
  );
};
