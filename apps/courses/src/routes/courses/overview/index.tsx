import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  Flex,
  Heading,
  Icon,
  Image,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OpenMined } from '@openmined/shared/types';

import {
  getCourseProgress,
  getNextAvailablePage,
  hasCompletedConcept,
  hasCompletedProjectPart,
  hasStartedCourse,
} from '../_helpers';
import GridContainer from '../../../components/GridContainer';
import NumberedAccordion from '../../../components/NumberedAccordion';
import FeaturesOrResources from '../../../components/FeaturesOrResources';
import waveform from '../../../assets/waveform/waveform-top-left-cool.png';

const Detail = ({ title, value }) => (
  <Flex align="center" mb={4}>
    {/* SEE TODO (#3) */}
    <Icon as={FontAwesomeIcon} icon={faCheckCircle} size="2x" />
    <Box ml={4}>
      <Text fontWeight="bold">{title}</Text>
      <Text color="gray.700">{value}</Text>
    </Box>
  </Flex>
);

const LearnHow = ({ title, image }) => (
  <Box>
    <Image
      src={image}
      alt={title}
      boxSize={16}
      display={{ base: 'none', md: 'block' }}
    />
    <Heading
      as="h3"
      size="md"
      lineHeight="base"
      mt={{ base: 0, md: 3 }}
      color="gray.700"
    >
      {title}
    </Heading>
  </Box>
);

const LearnFrom = ({ image, name, credential }) => (
  <Flex direction="column" align="center" textAlign="center">
    <Box w={240} h={240} mb={4}>
      <Image src={image} alt={name} w="100%" h="100%" objectFit="cover" />
    </Box>
    <Heading as="h3" size="md" mb={2}>
      {name}
    </Heading>
    <Text color="gray.700">{credential}</Text>
  </Flex>
);

export default ({ course, page, progress }: OpenMined.CoursePagesProp) => {
  const prepareSyllabusContent = (description, parts, lessonId = null) => {
    const iconProps: any = {
      as: FontAwesomeIcon,
      size: 'lg',
      mr: 2,
      color: 'gray.600',
    };

    // SEE TODO (#3)
    const IncompleteConcept = () => <Icon {...iconProps} icon={faCircle} />;
    const CompleteConcept = () => (
      <Icon {...iconProps} color="blue.500" icon={faCheckCircle} />
    );

    return (
      <Box bg="gray.200" p={8}>
        <Text mb={4}>{description}</Text>
        <List spacing={2}>
          {parts.map(({ title, _id, _key }, index) => {
            const isComplete =
              _id && !_key
                ? hasCompletedConcept(progress, lessonId, _id)
                : hasCompletedProjectPart(progress, _key);

            return (
              <ListItem key={index}>
                {isComplete && <ListIcon as={CompleteConcept} />}
                {!isComplete && <ListIcon as={IncompleteConcept} />}
                {title}
              </ListItem>
            );
          })}
        </List>
      </Box>
    );
  };

  const {
    title,
    description,
    prerequisites,
    learnHow,
    cost,
    level,
    length,
    certification,
    learnFrom,
    live,
    project,
  } = page;

  const lessons = page.lessons
    ? page.lessons.map(({ title, description, concepts, _id }) => ({
        title,
        content: prepareSyllabusContent(description, concepts, _id),
      }))
    : [];

  if (project) {
    lessons.push({
      title: project.title,
      content: prepareSyllabusContent(project.description, project.parts),
    });
  }

  // TODO: Patrick, add projects to the list of "lessons"
  // TODO: Patrick, add the hand icon for either the current lesson the user is on, or the first lesson
  // TODO: Patrick, have the defaultly opened indexes to be either the current lesson the user is on, or the first lesson

  const [indexes, setIndexes] = useState([]);

  const toggleAccordionItem = (index) => {
    const isActive = indexes.includes(index);

    if (isActive) setIndexes(indexes.filter((i) => i !== index));
    else setIndexes([...indexes, index]);
  };

  const courseStartLink = live
    ? `/courses/${course}/${page.lessons[0]._id}`
    : null;

  const isTakingCourse = hasStartedCourse(progress);

  const stats = isTakingCourse
    ? getCourseProgress(progress, page.lessons, project.parts)
    : {};
  const percentComplete =
    ((stats.completedConcepts + stats.completedProjectParts) /
      (stats.concepts + stats.projectParts)) *
    100;

  const nextAvailablePage = isTakingCourse
    ? getNextAvailablePage(progress, page.lessons)
    : {};
  let resumeLink = isTakingCourse
    ? `/courses/${course}/${nextAvailablePage.lesson}`
    : '';

  if (nextAvailablePage.concept) {
    resumeLink = `${resumeLink}/${nextAvailablePage.concept}`;
  }

  return (
    <>
      <Box
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '478px',
          height: '309px',
          zIndex: -1,
          backgroundImage: `url(${waveform})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '0% 0%',
          backgroundSize: 'contain',
          display: ['none', null, null, 'block'],
        }}
      />
      <Box pt={[8, null, null, 24]} pb={16}>
        <GridContainer isInitial mb={[8, null, null, 12, 16]}>
          <Flex
            direction={['column', null, null, 'row']}
            justify="space-between"
            align={{ lg: 'flex-end' }}
          >
            <Box>
              <Text fontFamily="mono" mb={4}>
                Course Overview
              </Text>
              <Heading as="h1" size="3xl" mb={8}>
                {title}
              </Heading>
              <Text color="gray.700" width={{ md: '80%', xl: '60%' }}>
                {description}
              </Text>
            </Box>
            <Box
              flex={{ lg: '0 0 280px' }}
              mt={[8, null, null, 0]}
              ml={[0, null, null, 8]}
            >
              {cost && <Detail title="Cost" value={cost} />}
              {level && <Detail title="Level" value={level} />}
              {length && <Detail title="Length" value={length} />}
              {certification && (
                <Detail title="Certification" value={certification.title} />
              )}
              <Divider mb={4} />
              <Text fontWeight="bold" mb={2}>
                Prerequisites
              </Text>
              <UnorderedList spacing={2} mb={6}>
                {prerequisites.map((p) => (
                  <ListItem key={p}>{p}</ListItem>
                ))}
              </UnorderedList>
              {!isTakingCourse && (
                <Button
                  colorScheme="blue"
                  size="lg"
                  as={courseStartLink ? Link : null}
                  to={courseStartLink}
                  disabled={!courseStartLink}
                >
                  {courseStartLink ? 'Start Course' : 'Coming Soon'}
                </Button>
              )}
              {isTakingCourse && (
                <Flex align="center">
                  <CircularProgress
                    value={percentComplete}
                    color="blue.400"
                    size="80px"
                    thickness={8}
                  >
                    <CircularProgressLabel fontWeight="bold" fontSize="md">
                      {percentComplete.toFixed(1)}%
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Button
                    colorScheme="blue"
                    size="lg"
                    as={Link}
                    to={resumeLink}
                    ml={4}
                  >
                    Continue
                  </Button>
                </Flex>
              )}
            </Box>
          </Flex>
        </GridContainer>
        {!isTakingCourse && learnHow && (
          <Box bg="gray.200" py={[8, null, null, 12]} my={[8, null, null, 12]}>
            <GridContainer>
              <Heading as="h2" size="xl" mb={8}>
                Walk away being able to...
              </Heading>
              <SimpleGrid columns={[1, null, 2, 3]} spacing={8}>
                {learnHow.map((l) => (
                  <LearnHow {...l} key={l.title} />
                ))}
              </SimpleGrid>
            </GridContainer>
          </Box>
        )}
        <GridContainer my={[8, null, null, 12]}>
          <Flex
            width={{ lg: '80%' }}
            mx="auto"
            direction="column"
            align="center"
          >
            <Heading as="h2" size="xl" mb={4}>
              What You'll Learn
            </Heading>
            <Text color="gray.700">
              Below you will find the entire course syllabus organized by
              lessons and concepts.
            </Text>
            {lessons.length !== 0 && (
              <NumberedAccordion
                width="full"
                mt={8}
                indexes={indexes}
                onToggleItem={toggleAccordionItem}
                sections={lessons}
              />
            )}
            {lessons.length === 0 && (
              <Text fontWeight="bold" fontSize="lg" mt={8}>
                Course syllabus coming soon!
              </Text>
            )}
          </Flex>
        </GridContainer>
        {!isTakingCourse && learnFrom && (
          <GridContainer my={[8, null, null, 12]}>
            <Heading as="h2" size="xl" mb={8} textAlign="center">
              Who You'll Learn From
            </Heading>
            <SimpleGrid columns={[1, null, 2, 3]} spacing={8}>
              {learnFrom.map((l) => (
                <LearnFrom {...l} key={l.name} />
              ))}
            </SimpleGrid>
          </GridContainer>
        )}
        <Flex justify="center">
          {!isTakingCourse && (
            <Button
              colorScheme="black"
              size="lg"
              as={courseStartLink ? Link : null}
              to={courseStartLink}
              disabled={!courseStartLink}
            >
              {courseStartLink ? 'Start Course' : 'Coming Soon'}
            </Button>
          )}
          {isTakingCourse && (
            <Button
              colorScheme="black"
              size="lg"
              as={Link}
              to={resumeLink}
              ml={4}
            >
              Continue Course
            </Button>
          )}
        </Flex>
        <Box my={[8, null, null, 12]}>
          {isTakingCourse && <FeaturesOrResources which="resources" />}
          {!isTakingCourse && <FeaturesOrResources which="features" />}
        </Box>
        {/* TODO: Patrick, add the other courses here */}
      </Box>
    </>
  );
};
