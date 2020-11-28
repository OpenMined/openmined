import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  RadioGroup,
  Stack,
  Radio,
  Alert,
  Button,
  Box,
} from '@chakra-ui/core';

export default ({
  skillLevel,
  setSkillLevel,
  topic,
  setTopic,
  language,
  setLanguage,
  numCourses,
  clearFilters,
}) => {
  const filters = [
    {
      title: 'Skill Level',
      value: skillLevel,
      setter: setSkillLevel,
      options: ['Beginner', 'Intermediate', 'Advanced'],
    },
    {
      title: 'Topic',
      value: topic,
      setter: setTopic,
      options: ['Topic One', 'Topic Two', 'Topic Three'],
    },
    {
      title: 'Language',
      value: language,
      setter: setLanguage,
      options: ['Python', 'Javascript', 'Scala', 'R', 'SQL', 'Julia'],
    },
  ];
  const numFilters = filters.filter((filter) => filter.value !== '').length;
  return (
    <>
      {numFilters !== 0 && (
        <Alert
          status="success"
          variant="subtle"
          fontWeight="bold"
          flexDirection="column"
          alignItems="start"
          mb={8}
        >
          {numCourses} results
          <Button
            colorScheme="teal"
            variant="link"
            onClick={clearFilters}
            textDecoration="underline"
          >
            Clear filters ({numFilters})
          </Button>
        </Alert>
      )}
      <Accordion allowMultiple allowToggle>
        {filters.map((filter) => (
          <AccordionItem key={filter.title} border={0}>
            <AccordionButton
              borderBottomWidth={2}
              borderBottomColor="gray.300"
              borderBottomStyle="solid"
            >
              <Box flex="1" textAlign="left" fontSize="xl" fontWeight="bold">
                {filter.title}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <RadioGroup onChange={filter.setter} value={filter.value}>
                <Stack>
                  {filter.options.map((item) => (
                    <Radio key={item} value={item}>
                      {item}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};
