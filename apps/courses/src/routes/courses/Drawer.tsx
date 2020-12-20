import React, { useState } from 'react';
import { Link as RRDLink } from 'react-router-dom';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faExternalLinkAlt,
  faFile,
  faPlayCircle,
} from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { getLinkPropsFromLink } from '../../helpers';
import ChakraIcon from '../../components/ChakraIcon';

const DrawerItem = ({
  index,
  sectionIndexes,
  toggleAccordionItem,
  onClose,
  item: { title, icon, fields },
}) => (
  <AccordionItem border={0}>
    <AccordionButton
      px={8}
      py={6}
      bg={sectionIndexes.includes(index) ? 'gray.900' : 'initial'}
      _hover={{ bg: 'gray.900' }}
      color={sectionIndexes.includes(index) ? 'white' : 'gray.400'}
      onClick={() => toggleAccordionItem(index)}
    >
      <Flex flex="1" textAlign="left" align="center">
        {/* SEE TODO (#3) */}
        <ChakraIcon icon={icon} mr={6} size="lg" />
        <Text fontWeight="bold">{title}</Text>
      </Flex>
      <AccordionIcon color="gray.600" />
    </AccordionButton>
    <AccordionPanel pb={4}>
      <Stack spacing={6} px={4} my={4}>
        {fields.map(
          (
            { status, title, link = '', icon, number, type, onClick },
            index
          ) => {
            if (!status) {
              if (type === 'divider') return <Divider key={index} />;

              const isExternal =
                link.includes('http://') || link.includes('https://');

              return (
                <Link
                  key={index}
                  color="gray.400"
                  _hover={{ color: 'gray.200' }}
                  onClick={() => {
                    if (onClick) onClick();
                    onClose();
                  }}
                  {...getLinkPropsFromLink(link)}
                >
                  <Flex justify="space-between" align="center">
                    <Flex align="center">
                      {/* SEE TODO (#3) */}
                      {icon && (
                        <ChakraIcon
                          icon={icon}
                          size="lg"
                          mr={6}
                        />
                      )}
                      <Text>{title}</Text>
                    </Flex>
                    {/* SEE TODO (#3) */}
                    {isExternal && (
                      <ChakraIcon icon={faExternalLinkAlt} />
                    )}
                  </Flex>
                </Link>
              );
            } else {
              const linkProps: any = link
                ? {
                    as: RRDLink,
                    to: link,
                    onClick: onClose,
                  }
                : {
                    userSelect: 'none',
                  };

              let icon;

              if (status === 'completed') {
                linkProps.color = 'white';
                icon = faCheckCircle;
              } else if (status === 'available') {
                linkProps.color = 'gray.400';
                icon = type ? (type === 'video' ? faPlayCircle : faFile) : null;
              } else if (status === 'unavailable') {
                linkProps.color = 'gray.700';
                icon = type ? (type === 'video' ? faPlayCircle : faFile) : null;
              }

              // SEE TODO (#11)
              // The following lines are unnecessary if TODO #11 is fixed, remove them
              if (linkProps.to) {
                linkProps.as = 'a';
                linkProps.to = null;
                linkProps.cursor = 'pointer';
                linkProps.onClick = () => {
                  window.location.href = link;
                };
              }

              return (
                <Flex key={index} align="center" {...linkProps}>
                  <Flex
                    justify="center"
                    align="center"
                    textAlign="center"
                    width={5}
                    mr={6}
                  >
                    {/* SEE TODO (#3) */}
                    {icon && (
                      <ChakraIcon
                        icon={icon}
                        color={status === 'completed' ? 'teal.300' : 'inherit'}
                        size="lg"
                      />
                    )}
                    {!icon && (
                      <Text fontWeight="bold" fontSize="xl">
                        {number}
                      </Text>
                    )}
                  </Flex>
                  <Text>{title}</Text>
                </Flex>
              );
            }
          }
        )}
      </Stack>
    </AccordionPanel>
  </AccordionItem>
);

export default ({ isOpen, onOpen, onClose, header, content, ...props }) => {
  const [sectionIndexes, setSectionIndexes] = useState([0]);

  const openAccordionItem = (index) =>
    setSectionIndexes([...sectionIndexes, index]);
  const toggleAccordionItem = (index) => {
    const isActive = sectionIndexes.includes(index);

    if (isActive) setSectionIndexes(sectionIndexes.filter((i) => i !== index));
    else openAccordionItem(index);
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      size="sm"
      initialFocusRef={null}
      {...props}
    >
      <DrawerOverlay>
        <DrawerContent bg="gray.800" color="white">
          <DrawerCloseButton />
          <DrawerHeader
            fontFamily="body"
            fontWeight="normal"
            fontSize="md"
            px={8}
            py={6}
          >
            {header}
          </DrawerHeader>
          <DrawerBody p={0}>
            <Accordion allowMultiple index={sectionIndexes}>
              {content.map((item, index) => (
                <DrawerItem
                  key={index}
                  index={index}
                  sectionIndexes={sectionIndexes}
                  toggleAccordionItem={toggleAccordionItem}
                  onClose={onClose}
                  item={item}
                />
              ))}
            </Accordion>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
