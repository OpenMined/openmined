import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  List,
  ListItem,
  Divider,
  Flex,
  Circle,
  Icon,
} from '@chakra-ui/core';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import { Link, animateScroll as scroll } from 'react-scroll';
import Page from '@openmined/shared/util-page';

import { SIDEBAR_WIDTH } from '../../helpers';
import NumberedAccordion, {
  CircledNumber,
} from '../../components/NumberedAccordion';
import GridContainer from '../../components/GridContainer';
import policy from '../../content/privacy-policy';
import terms from '../../content/terms-of-service';

const SectionListItem = ({ content, index, onClick, ...props }) => (
  <ListItem cursor="pointer" {...props}>
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
        <CircledNumber mr={4} size="2rem" isActive>
          {index + 1}
        </CircledNumber>
        <Text color="gray.700">{content.title}</Text>
      </Flex>
    </Link>
  </ListItem>
);

export default () => {
  const location = useLocation();
  const isPolicy = location.pathname === '/policy';

  const {
    heading: { title, last_updated },
    sidebar: { footer },
    sections,
  } = isPolicy ? policy : terms;

  const [sectionIndexes, setSectionIndexes] = useState([0]);

  // TODO: Hericles, we may not need this when you remove react-scroll
  const sectionsWithIds = sections.map((s) => ({
    ...s,
    id: s.title.replace(/\s+/g, '-').toLowerCase(),
  }));

  const disclaimer = !isPolicy ? terms.heading.disclaimer : undefined;

  const openAccordionItem = (index) =>
    setSectionIndexes([...sectionIndexes, index]);
  const toggleAccordionItem = (index) => {
    const isActive = sectionIndexes.includes(index);

    if (isActive) setSectionIndexes(sectionIndexes.filter((i) => i !== index));
    else openAccordionItem(index);
  };

  const scrollTop = () => scroll.scrollToTop({ duration: 500, smooth: true });

  return (
    <Page title="Terms of Service">
      <Box position="relative" height="100%" pt={[8, null, null, 16]} pb={16}>
        <GridContainer isInitial pt={{ lg: 8 }}>
          <Flex
            pr={[0, null, null, 24]}
            direction={['column', null, null, 'row']}
          >
            <Box mr={[0, null, null, 16]}>
              <Box mr={[0, null, null, 8]}>
                <Heading as="h2" size="2xl" mb={4}>
                  {title}
                </Heading>
                <Text color="indigo.500" fontSize="md" fontFamily="mono">
                  Last Updated: {last_updated}
                </Text>
                {disclaimer && (
                  <Box
                    mt={8}
                    px={8}
                    py={4}
                    bgColor="indigo.50"
                    color="indigo.500"
                  >
                    {disclaimer}
                  </Box>
                )}
              </Box>
              <Box pt={8}>
                <NumberedAccordion
                  indexes={sectionIndexes}
                  onToggleItem={toggleAccordionItem}
                  sections={sectionsWithIds}
                />
              </Box>
            </Box>
            <Box
              width={SIDEBAR_WIDTH}
              flex={`0 0 ${SIDEBAR_WIDTH}px`}
              display={['none', null, null, 'block']}
            >
              <Divider position="fixed" orientation="vertical" />
              <Box ml={8} position="fixed" width={SIDEBAR_WIDTH}>
                <List mt={4} spacing={4}>
                  {sections.map((section, i) => (
                    <SectionListItem
                      key={section.title}
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
                  mb={2}
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
                    <Text textTransform="uppercase">Top</Text>
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
