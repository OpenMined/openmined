import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  List,
  ListItem,
  Divider,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import Page from '@openmined/shared/util-page';

import { SIDEBAR_WIDTH } from '../../helpers';
import NumberedAccordion, {
  CircledNumber,
} from '../../components/NumberedAccordion';
import GridContainer from '../../components/GridContainer';
import policy from '../../content/privacy-policy';
import terms from '../../content/terms-of-service';

const SectionListItem = ({ content, index, ...props }) => {
  const handleClick = () => {
    props.onClick(index);

    const element = document.querySelectorAll('.chakra-accordion__item')[index];

    const offset = 80;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  return (
    <ListItem cursor="pointer" {...props} onClick={handleClick}>
      <Flex alignItems="center">
        <CircledNumber mr={4} size="2rem" isActive>
          {index + 1}
        </CircledNumber>
        <Text color="gray.700">{content.title}</Text>
      </Flex>
    </ListItem>
  );
};

export default () => {
  const location = useLocation();
  const isPolicy = location.pathname === '/policy';

  const {
    heading: { title, last_updated },
    sidebar: { discussion },
    sections,
  } = isPolicy ? policy : terms;

  const disclaimer = !isPolicy ? terms.heading.disclaimer : undefined;

  const [sectionIndexes, setSectionIndexes] = useState([0]);

  const openAccordionItem = (index) =>
    setSectionIndexes([...sectionIndexes, index]);
  const toggleAccordionItem = (index) => {
    const isActive = sectionIndexes.includes(index);

    if (isActive) setSectionIndexes(sectionIndexes.filter((i) => i !== index));
    else openAccordionItem(index);
  };

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
                <Text color="gray.700" fontSize="md" fontFamily="mono">
                  Last Updated: {last_updated}
                </Text>
                {disclaimer && (
                  <Box
                    mt={8}
                    px={8}
                    py={4}
                    bg="cyan.50"
                    color="cyan.700"
                    borderRadius="md"
                  >
                    {disclaimer}
                  </Box>
                )}
              </Box>
              <Box pt={8}>
                <NumberedAccordion
                  indexes={sectionIndexes}
                  onToggleItem={toggleAccordionItem}
                  sections={sections}
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
                {/* SEE TODO (#3) */}
                <Icon
                  as={FontAwesomeIcon}
                  icon={faCommentAlt}
                  size="2x"
                  mb={2}
                />
                {discussion}
                <Flex mt={12} justify="flex-start">
                  <Box
                    cursor="pointer"
                    textAlign="center"
                    color="gray.700"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  >
                    {/* SEE TODO (#3) */}
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
