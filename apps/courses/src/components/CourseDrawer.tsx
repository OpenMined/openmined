import React, { useState } from 'react';
import { Link as RRDLink } from 'react-router-dom';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
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
} from '@chakra-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';

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
              {content.map(({ title, icon, fields }, index) => (
                <AccordionItem key={index} border={0}>
                  <AccordionButton
                    px={8}
                    py={6}
                    bg={sectionIndexes.includes(index) ? 'gray.900' : 'initial'}
                    _hover={{ bg: 'gray.900' }}
                    color={
                      sectionIndexes.includes(index) ? 'white' : 'gray.400'
                    }
                    onClick={() => toggleAccordionItem(index)}
                  >
                    <Flex flex="1" textAlign="left" align="center">
                      <Icon as={FontAwesomeIcon} icon={icon} mr={6} size="lg" />
                      <Text fontWeight="bold">{title}</Text>
                    </Flex>
                    <AccordionIcon color="gray.600" />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <Stack spacing={6} px={4} my={4}>
                      {fields.map(
                        (
                          { status, title, link = '', icon, type, onClick },
                          index
                        ) => {
                          if (!status) {
                            if (type === 'divider')
                              return <Divider key={index} />;

                            const isExternal =
                              link.includes('http://') ||
                              link.includes('https://');

                            const linkProps = isExternal
                              ? {
                                  as: 'a',
                                  href: link,
                                  target: '_blank',
                                  rel: 'noopener noreferrer',
                                }
                              : {
                                  as: RRDLink,
                                  to: link,
                                };

                            return (
                              <Link
                                key={index}
                                color="gray.400"
                                _hover={{ color: 'gray.200' }}
                                onClick={() => {
                                  if (onClick) onClick();
                                  onClose();
                                }}
                                {...linkProps}
                              >
                                <Flex justify="space-between" align="center">
                                  <Flex align="center">
                                    {icon && (
                                      <Icon
                                        as={FontAwesomeIcon}
                                        icon={icon}
                                        size="lg"
                                        mr={6}
                                      />
                                    )}
                                    <Text>{title}</Text>
                                  </Flex>
                                  {isExternal && (
                                    <Icon
                                      as={FontAwesomeIcon}
                                      icon={faExternalLinkAlt}
                                    />
                                  )}
                                </Flex>
                              </Link>
                            );
                          } else {
                            const linkProps = link
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
                              icon = faCircle;
                            } else if (status === 'unavailable') {
                              linkProps.color = 'gray.700';
                              icon = faCircle;
                            }

                            return (
                              <Flex key={index} align="center" {...linkProps}>
                                <Icon
                                  as={FontAwesomeIcon}
                                  icon={icon}
                                  color={
                                    status === 'completed'
                                      ? 'orange.200'
                                      : 'inherit'
                                  }
                                  size="lg"
                                  mr={6}
                                />
                                <Text>{title}</Text>
                              </Flex>
                            );
                          }
                        }
                      )}
                    </Stack>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
