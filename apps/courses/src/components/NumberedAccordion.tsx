import React from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Circle,
  Flex,
  Heading,
} from '@chakra-ui/react';

export const CircledNumber = ({ isActive = false, children, ...props }) => {
  const circleProps = isActive
    ? {
        bg: 'gray.800',
        borderColor: 'gray.800',
        color: 'gray.50',
      }
    : {
        bg: 'white',
        borderColor: 'gray.600',
        color: 'gray.600',
      };

  return (
    <Circle
      border="2px"
      cursor="pointer"
      userSelect="none"
      textAlign="center"
      transitionDuration="normal"
      transitionTimingFunction="ease-in-out"
      {...circleProps}
      {...props}
    >
      <Heading as="span" fontSize="lg">
        {children}
      </Heading>
    </Circle>
  );
};

export default ({ indexes, onToggleItem, sections, ...props }) => (
  <Accordion index={indexes} allowMultiple {...props}>
    {sections.map(({ title, content, ...section }, index) => (
      <AccordionItem
        border="0px"
        mt={index === 0 ? 0 : 8}
        key={index}
        {...section}
      >
        <Flex alignItems="center" onClick={() => onToggleItem(index)}>
          <CircledNumber
            mr={6}
            size="2.5rem"
            isActive={indexes.includes(index)}
          >
            {index + 1}
          </CircledNumber>
          <AccordionButton
            px={0}
            borderBottomWidth="1px"
            _hover={{ backgroundColor: 'initial' }}
          >
            <Heading size="lg" as="h3" flex="1" textAlign="left">
              {title}
            </Heading>
            <AccordionIcon fontSize="1.5rem" />
          </AccordionButton>
        </Flex>
        <AccordionPanel ml={4} pl={12} pr={0} pt={4}>
          {content}
        </AccordionPanel>
      </AccordionItem>
    ))}
  </Accordion>
);
