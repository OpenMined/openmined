import React, { useState, useEffect, useRef } from 'react';
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

import Course from '../../components/CourseCard';
import Sidebar from './Sidebar';

export default () => {
  const TAG_BG_COLOR = 'rgba(0, 162, 183, 0.25)';

  const [skillLevel, setSkillLevel] = useState('');
  const [topics, setTopics] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const currKeyword = useRef();

  const { data, loading } = useSanity(
    `*[_type == "course"] {
      ...,
      visual {
        "default": default.asset -> url,
        "full": full.asset -> url
      }
    }`
  );

  const courseFilter = (course) => {
    let hasSkillLevel = true,
      hasTopic = true,
      hasLanguages = true;

    if (skillLevel && course.skillLevel)
      hasSkillLevel = skillLevel === course.level;
    if (topics && course.topics)
      hasTopic = topics.some((topic) => course.topics.includes(topic));
    if (languages && course.languages)
      hasLanguages = languages.some((language) =>
        course.languages.includes(language)
      );

    return hasSkillLevel && hasTopic && hasLanguages;
  };

  const courses = data ? data.filter((course) => courseFilter(course)) : [];

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
    setTopics([]);
    setLanguages([]);
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
                topics,
                setTopics,
                languages,
                setLanguages,
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
              {courses &&
                courses.map((course, index) => (
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
                      colorScheme="cyan"
                      bgColor={TAG_BG_COLOR}
                      color="cyan.800"
                    >
                      <TagLabel opacity={1}>{keyword}</TagLabel>
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
              {!loading &&
                courses &&
                courses.map((course, i) => (
                  <Course key={i} content={course} onClick={console.log} />
                ))}
            </SimpleGrid>
          </Box>
        </Flex>
      </Box>
    </Page>
  );
};
