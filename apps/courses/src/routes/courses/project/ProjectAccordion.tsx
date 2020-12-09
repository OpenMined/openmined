import React from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
} from '@chakra-ui/core';

const ProjectPart = ({ content, ...props }) => {
  const { title, status, description, attempts, max_attemps } = content;

  const accordionButtonProps = {
    py: 3,
    color: 'magenta.500',
    fontFamily: 'heading',
    borderColor: 'magenta.50',
    backgroundColor: 'magenta.50',
    _hover: {
      backgroundColor: 'magenta.50',
    },
    _disabled: {
      backgroundColor: 'gray.200',
      color: 'gray.500',
      opacity: 1,
    },
  };

  return (
    <AccordionItem
      mb={4}
      border="none"
      isDisabled={status === 'locked'}
      {...props}
    >
      <AccordionButton
        borderRadius="md"
        _expanded={{
          borderBottomRadius: 0,
        }}
        {...accordionButtonProps}
      >
        <Box flex="1" textAlign="left">
          {title}
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel
        borderWidth={1}
        borderColor="magenta.50"
        borderBottomRadius={5}
      >
        <Box>
          <Text>{description}</Text>
        </Box>
      </AccordionPanel>
    </AccordionItem>
  );
};

const ProjectAccordion = ({ parts, ...props }) => {
  return (
    <Accordion mt={8} allowMultiple {...props}>
      {parts.map((part) => (
        <ProjectPart key={part.title} content={part} />
      ))}
    </Accordion>
  );
};

export default ProjectAccordion;
