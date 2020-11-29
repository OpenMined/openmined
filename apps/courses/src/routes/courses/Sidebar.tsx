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
  Text,
  Checkbox,
  CheckboxGroup,
  VStack,
} from '@chakra-ui/core';

const SidebarItem = ({
  title,
  value,
  setter,
  options,
  multiple = false,
  ...props
}) => {
  return (
    <AccordionItem key={title} border={0} {...props}>
      <AccordionButton
        borderBottomWidth={2}
        borderBottomColor="gray.300"
        borderBottomStyle="solid"
      >
        <Box flex="1" textAlign="left" fontSize="xl" fontWeight="bold">
          {title}
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4}>
        {multiple ? (
          <CheckboxGroup colorScheme="cyan" onChange={setter} value={value}>
            <VStack align="flex-start">
              {options.map((item) => (
                <Checkbox key={item} value={item}>
                  {item}
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
        ) : (
          <RadioGroup colorScheme="cyan" onChange={setter} value={value}>
            <Stack>
              {options.map((item) => (
                <Radio key={item} value={item}>
                  {item}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
};

export default ({
  skillLevel,
  setSkillLevel,
  topics,
  setTopics,
  languages,
  setLanguages,
  numCourses,
  clearFilters,
}) => {
  const ALERT_BG_COLOR = 'rgba(0, 162, 183, 0.25)';

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

  const numFilters = filters.filter((filter) => !(filter.value.length === 0))
    .length;

  return (
    <>
      {numFilters !== 0 && (
        <Alert
          status="success"
          variant="subtle"
          fontWeight="bold"
          flexDirection="column"
          alignItems="start"
          bgColor={ALERT_BG_COLOR}
          borderRadius={4}
          color="cyan.800"
          mb={4}
        >
          <Text mb={4} color="cyan.800">
            {' '}
            {numCourses} results
          </Text>
          <Button
            color="cyan.800"
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
          <SidebarItem key={filter.title} title="Skill Level" {...filter} />
        ))}
      </Accordion>
    </>
  );
};
