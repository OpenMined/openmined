import React from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Circle,
  Box,
  Flex,
  Heading,
} from '@chakra-ui/core';

export const CircledNumber = ({ active = false, text, ...props }) => (
  <Circle
    {...props}
    backgroundColor={active ? 'gray.800' : props.backgroundColor}
    borderColor={active ? 'gray.800' : props.borderColor}
    color={active ? 'gray.50' : props.color}
  >
    <Box as="span" fontFamily="heading" fontWeight="500" fontSize="lg">
      {text}
    </Box>
  </Circle>
);

export default ({ indexes, onToggleItem, sections, ...props }) => (
  <Accordion index={indexes} allowMultiple {...props}>
    {sections.map(({ title, content, ...section }, index) => (
      <AccordionItem
        border="0px"
        my={8}
        onClick={() => onToggleItem(index)}
        key={index}
        {...section}
      >
        {console.log(section)}
        <Flex alignItems="center">
          <CircledNumber
            textAlign="center"
            border="3px solid"
            color="gray.600"
            size="2.5rem"
            mr="2.5rem"
            active={indexes.includes(index)}
            transition=".2s"
            onClick={() => onToggleItem(index)}
            text={index + 1}
          />
          <AccordionButton
            pl={0}
            borderBottomWidth="1px"
            _hover={{ backgroundColor: 'initial' }}
          >
            <Box flex="1" textAlign="left">
              <Heading size="lg" as="h3">
                {title}
              </Heading>
            </Box>
            <AccordionIcon fontSize="1.5rem" />
          </AccordionButton>
        </Flex>
        <AccordionPanel ml={16}>{content}</AccordionPanel>
      </AccordionItem>
    ))}
  </Accordion>
);
