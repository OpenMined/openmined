import React, { useEffect, useState } from 'react';
import { Flex, Box, SimpleGrid, Input, Text } from '@chakra-ui/react';
import Fuse from 'fuse.js';

import Sidebar from './Sidebar';

import GridContainer from '../../../components/GridContainer';
import Course from '../../../components/CourseCard';

export default ({ page }) => {
  const FIXED_SIDEBAR_WIDTH = 250;
  const FIXED_SIDEBAR_MD_WIDTH = 200;

  const [results, setResults] = useState(page);
  const [search, setSearch] = useState('');
  const [skillLevel, setSkillLevel] = useState('');

  const filters = [
    {
      title: 'Skill Level',
      value: skillLevel,
      setter: setSkillLevel,
      options: ['Beginner', 'Intermediate', 'Advanced'],
    },
  ];

  useEffect(() => {
    const liveSort = (a, b) => (a.live === b.live ? 0 : a.live ? -1 : 1);

    const filteredResults =
      page
        .filter((course) => {
          const NO_FILTER = true;

          const hasSkillLevel =
            skillLevel && course.level
              ? skillLevel === course.level
              : NO_FILTER;

          return hasSkillLevel;
        })
        .sort(liveSort) || [];

    if (search === '') setResults(filteredResults);
    else {
      const fuse = new Fuse(filteredResults, {
        keys: ['title', 'description'],
      });
      const searchedResults = fuse
        .search(search)
        .map((i) => i.item)
        .sort(liveSort);

      setResults(searchedResults);
    }
  }, [page, search, skillLevel]);

  const clearFilters = () => {
    setSkillLevel('');
  };

  return (
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
              numCourses={results.length}
              clearFilters={clearFilters}
            />
          </Box>
        </Box>
        <Box w={['100%', null, '60%', '70%']}>
          <Input
            w={['100%', null, null, '70%']}
            placeholder="Start typing something..."
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            size="lg"
            mt={[4, null, 0]}
          />
          {results.length === 0 && (
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
            {results &&
              results.map((course, i) => <Course key={i} content={course} />)}
          </SimpleGrid>
        </Box>
      </Flex>
    </GridContainer>
  );
};
