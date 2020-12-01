import React, { useEffect, useState } from 'react';
import { Flex, Box, SimpleGrid, Input, Text, useToken } from '@chakra-ui/core';

import Fuse from 'fuse.js';

import { useSanity } from '@openmined/shared/data-access-sanity';
import Page from '@openmined/shared/util-page';

import Sidebar from './Sidebar';

import GridContainer from '../../../components/GridContainer';
import Course from '../../../components/CourseCard';
import { coursesProjection } from '../../../helpers';

export default () => {
  const gray50 = useToken('colors', 'gray.50');

  const FIXED_SIDEBAR_WIDTH = 250;
  const FIXED_SIDEBAR_MD_WIDTH = 200;

  const [searchData, setSearchData] = useState([]);
  const [skillLevel, setSkillLevel] = useState('');
  const [topics, setTopics] = useState([]);
  const [languages, setLanguages] = useState([]);

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
    `*[_type == "course"] ${coursesProjection()}`
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

  const filterData = (data) =>
    data ? data.filter((course) => courseFilter(course)) : [];

  useEffect(() => {
    setSearchData(filterData(data));
  }, [data, filterData]);

  const searchItem = (query) => {
    if (!query) {
      setSearchData(filterData(data));
      return;
    }
    const fuse = new Fuse(filterData(data), {
      keys: ['title', 'description'],
    });
    const result = fuse.search(query);
    const finalResult = [];
    if (result.length) {
      result.forEach((item) => {
        finalResult.push(item.item);
      });
      setSearchData(finalResult);
    } else {
      setSearchData([]);
    }
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
        <Flex
          justifyContent="space-around"
          flexDirection={['column', 'column', 'row', 'row']}
        >
          <Box w={['100%', null, '40%', '30%']} px={[0, null, 8, 16]}>
            <Box
              w={[
                null,
                null,
                FIXED_SIDEBAR_WIDTH,
                FIXED_SIDEBAR_MD_WIDTH,
                FIXED_SIDEBAR_WIDTH,
              ]}
              position={[null, null, 'fixed']}
            >
              <Sidebar
                filters={filters}
                numCourses={searchData.length}
                clearFilters={clearFilters}
              />
            </Box>
          </Box>
          <Box w={['100%', null, '60%', '70%']}>
            <Input
              w={['100%', null, null, '70%']}
              placeholder="Start typing something..."
              onChange={(e) => searchItem(e.target.value)}
              size="lg"
              py={[2, null]}
              my={4}
            />
            {searchData.length === 0 && (
              <Box py={4}>
                <Text fontSize="3xl" px={2} fontWeight="bold">
                  Sorry, there are no search results for that query
                </Text>
              </Box>
            )}
            <SimpleGrid
              py={5}
              columns={[1, null, 1, 2]}
              spacing={[4, null, 6]}
              color="white"
            >
              {searchData &&
                searchData.map((course, i) => (
                  <Course key={i} content={course} />
                ))}
            </SimpleGrid>
          </Box>
        </Flex>
      </GridContainer>
    </Page>
  );
};
