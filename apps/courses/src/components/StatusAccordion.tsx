import React from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/core';
import { Link } from 'react-router-dom';
import {
  faCheckCircle,
  faLock,
  faLockOpen,
} from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default ({ parts, course }) => (
  <Accordion colorScheme="magenta" variant="boxed" allowMultiple mt={8}>
    {parts.map((part) => {
      const {
        title,
        status,
        description,
        attempts,
        max_attempts,
        ...props
      } = part;

      const statuses = {
        locked: {
          icon: faLock,
          color: 'gray',
        },
        unlocked: {
          icon: faLockOpen,
          color: 'magenta',
        },
        passed: {
          icon: faCheckCircle,
          color: 'green',
        },
        failed: {
          icon: faTimesCircle,
          color: 'red',
        },
      };

      const { icon, color } = statuses[status];

      const accordionButtonProps = {
        bgColor: `${color}.50`,
        color: `${color}.500`,
        _hover: {
          bgColor: `${color}.50`,
        },
      };

      return (
        <AccordionItem
          key={part.title}
          isDisabled={status === 'locked'}
          {...props}
        >
          <AccordionButton {...accordionButtonProps}>
            <Box flex="1" textAlign="left">
              <Icon size="lg" mr={2} as={FontAwesomeIcon} icon={icon} />
              {title}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel borderColor={`${color}.50`} color="gray.700" pb={4}>
            <Box {...props}>
              <Text>{description}</Text>
            </Box>
            <Flex mt={8} align="center">
              <Button
                as={Link}
                to={`/courses/${course}/project`}
                colorScheme="black"
              >
                Begin
              </Button>
              <Text
                ml={4}
                as="i"
              >{`${attempts}/${max_attempts} attempts`}</Text>
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      );
    })}
  </Accordion>
);
