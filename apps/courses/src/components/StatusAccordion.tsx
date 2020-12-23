import React, { useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Circle,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react';
import {
  faPaperPlane,
  faTimes,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// As we did on the main file, we need to get some basic styles for the <AccordionItem /> according to this part's status
const getStatusStyles = (status) => {
  if (status === 'not-started') {
    return {
      icon: 'number',
      color: 'gray',
      bg: 200,
      text: 800,
    };
  } else if (status === 'in-progress') {
    return {
      icon: 'number',
      color: 'cyan',
      bg: 50,
      text: 700,
    };
  } else if (status === 'submitted') {
    return {
      icon: faPaperPlane,
      color: 'cyan',
      bg: 50,
      text: 700,
    };
  } else if (status === 'failed-but-pending') {
    return {
      icon: faTimes,
      color: 'cyan',
      bg: 50,
      text: 700,
    };
  } else if (status === 'passed') {
    return {
      icon: faCheck,
      color: 'green',
      bg: 50,
      text: 600,
    };
  } else if (status === 'failed') {
    return {
      icon: faTimes,
      color: 'magenta',
      bg: 50,
      text: 500,
    };
  }
};

// A function that will tell us what tab to have open by default
// This heavily depends on the status of the various parts
const getDefaultOpenedTab = (content) => {
  // If every part has a "passed" status, none of them should be open (because you're done)
  if (content.every(({ status }) => status === 'passed')) return [];

  // Check for all parts with a status of "failed-but-pending" or "failed" and get the first one
  const failedOrFailedButPending = content.findIndex(
    ({ status }) => status === 'failed-but-pending' || status === 'failed'
  );

  // If there's at least one, open it
  if (failedOrFailedButPending !== -1) return [failedOrFailedButPending];

  // Otherwise, check for any that are "in-progress", "not-started", or "submitted" and get the first one
  const firstIfNotFinished = content.findIndex(
    ({ status }) =>
      status === 'in-progress' ||
      status === 'not-started' ||
      status === 'submitted'
  );

  // If there's at least one, open it
  if (firstIfNotFinished === -1) return [firstIfNotFinished];

  // Otherwise, just open the first
  return [0];
};

export default ({ content, ...props }) => {
  // Set up a way to track the current open accordion items (by their "indexes")
  const [indexes, setIndexes] = useState(getDefaultOpenedTab(content));

  // What happens when you open an accordion item
  const openIndex = (index) => {
    if (indexes.includes(index)) setIndexes(indexes.filter((i) => i !== index));
    else setIndexes([...indexes, index]);
  };

  return (
    <Accordion index={indexes} {...props}>
      {content.map(({ title, status, panel: Panel }, index) => {
        const { color, icon, ...styles } = getStatusStyles(status);
        const bg = `${color}.${styles.bg}`;
        const text = `${color}.${styles.text}`;

        // The part should be disabled if it's not the first part and if the status of the part before hasn't "passed"
        const isDisabled =
          index !== 0 && content[index - 1].status !== 'passed';

        const buttonStyles = {
          px: 6,
          py: 4,
          bg,
          color: text,
          borderRadius: 'md',
          borderColor: bg,
          fontWeight: 'bold',
          _hover: { bg },
          _expanded: {
            borderBottomRadius: 'none',
          },
        };

        return (
          <AccordionItem
            key={title}
            isDisabled={isDisabled}
            border="none"
            my={4}
          >
            <AccordionButton {...buttonStyles} onClick={() => openIndex(index)}>
              <Flex flex="1" align="center">
                <Circle bg={text} color={bg} size={8}>
                  {typeof icon === 'string' && index + 1}
                  {/* SEE TODO (#3) */}
                  {typeof icon !== 'string' && (
                    <Icon
                      size="1x"
                      as={FontAwesomeIcon}
                      icon={icon}
                      color={bg}
                    />
                  )}
                </Circle>
                <Text as="span" ml={4}>
                  {title}
                </Text>
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel
              px={8}
              py={6}
              border="1px solid"
              borderColor={bg}
              borderBottomRadius="md"
            >
              <Panel />
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
