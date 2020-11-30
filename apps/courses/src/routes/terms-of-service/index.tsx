import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  List,
  ListItem,
  Divider,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Icon,
} from '@chakra-ui/core';
import Page from '@openmined/shared/util-page';
import content from '../../content/terms-of-service';
import GridContainer from '../../components/GridContainer';

import { Link, animateScroll as scroll } from 'react-scroll';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import CircledNumber from '../../components/CircledNumber';

const SectionListItem = ({ content, index, onClick, ...props }) => (
  <ListItem key={content.title} cursor="pointer" {...props}>
    <Link
      to={`accordion-button-${content.title
        .replace(/\s+/g, '-')
        .toLowerCase()}`}
      onClick={() => onClick(index)}
      smooth={true}
      offset={-150}
      duration={500}
    >
      <Flex alignItems="center">
        <CircledNumber
          backgroundColor="gray.800"
          mr="2rem"
          color="white"
          size="2rem"
          text={index + 1}
        />
        <Text color="gray.700">{content.title}</Text>
      </Flex>
    </Link>
  </ListItem>
);

export default () => {
  const [sectionIndexes, setSectionIndexes] = useState([0]);

  const { title, last_updated, disclaimer } = content.heading;
  const { sections } = content;
  const { footer } = content.sidebar;

  const SIDEBAR_WIDTH = 280;

  const openAccordionItem = (index) => {
    setSectionIndexes([...sectionIndexes, index]);
  };

  const toggleAccordionItem = (index) => {
    const isActive = sectionIndexes.includes(index);
    if (isActive) {
      setSectionIndexes(sectionIndexes.filter((i) => i !== index));
    } else {
      openAccordionItem(index);
    }
  };

  const scrollTop = () => {
    scroll.scrollToTop({ duration: 500, smooth: true });
  };

  return (
    <Page title="Terms of Service">
      <Box position="relative" pb={[32, null, null, 40, 48]} height="100%">
        <GridContainer isInitial pt={{ lg: 8 }} pb={[16, null, null, 32]}>
          <Flex
            pr={[0, null, null, 32]}
            direction={['column', null, null, 'row']}
          >
            <Box mr={[0, null, null, 16]}>
              <Box pt={16} mr={[0, null, null, 8]}>
                <Heading as="h2" size="2xl" mb={4}>
                  {title}
                </Heading>
                <Text color="indigo.500" fontSize="md" fontFamily="mono">
                  Last Updated: {last_updated}
                </Text>
                <Box
                  mt={8}
                  px={8}
                  py={4}
                  bgColor="indigo.50"
                  color="indigo.500"
                >
                  {disclaimer}
                </Box>
              </Box>
              <Box pt={8}>
                <Accordion variant="spaced" index={sectionIndexes} allowMultiple>
                  {sections.map((section, index) => (
                    <AccordionItem
                      id={section.title.replace(/\s+/g, '-').toLowerCase()}
                      my={8}
                      onClick={() => toggleAccordionItem(index)}
                      key={section.title}
                    >
                      <Flex alignItems="center">
                        <CircledNumber
                          textAlign="center"
                          border="3px solid"
                          color="gray.600"
                          size="2.5rem"
                          mr="2.5rem"
                          active={sectionIndexes.includes(index)}
                          transition=".2s"
                          onClick={() => toggleAccordionItem(index)}
                          text={index + 1}
                        />
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            <Heading size="lg" as="h3">
                              {section.title}
                            </Heading>
                          </Box>
                          <AccordionIcon fontSize="1.5rem" />
                        </AccordionButton>
                      </Flex>
                      <AccordionPanel>{section.content}</AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Box>
            </Box>
            <Box
              width={SIDEBAR_WIDTH}
              flex={`0 0 ${SIDEBAR_WIDTH}px`}
              display={['none', null, null, 'block']}
            >
              <Divider position="fixed" orientation="vertical" />
              <Box ml={8} position="fixed" width={SIDEBAR_WIDTH}>
                <List marginTop={4} marginBottom={16} spacing={8}>
                  {sections.map((section, i) => (
                    <SectionListItem
                      onClick={openAccordionItem}
                      index={i}
                      content={section}
                    />
                  ))}
                </List>
                <Divider my={8} />
                <Icon
                  as={FontAwesomeIcon}
                  icon={faCommentAlt}
                  size="2x"
                  my={2}
                />
                <Text fontSize="16px">{footer}</Text>
                <Flex mt={16} mr={4} justify="flex-end">
                  <Box
                    cursor="pointer"
                    onClick={scrollTop}
                    color="indigo.500"
                    textAlign="center"
                  >
                    <Icon as={FontAwesomeIcon} icon={faChevronUp} />
                    <Text>TOP</Text>
                  </Box>
                </Flex>
              </Box>
            </Box>
          </Flex>
        </GridContainer>
      </Box>
    </Page>
  );
};
