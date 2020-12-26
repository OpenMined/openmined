import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  Flex,
  Heading,
  Image,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {
  faArrowRight,
  faCertificate,
  faCheckCircle,
  faClock,
  faFile,
  faMoneyBillWave,
  faPlayCircle,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { OpenMined } from '@openmined/shared/types';

import {
  getCourseProgress,
  getNextAvailablePage,
  hasCompletedConcept,
  hasCompletedCourse,
  hasCompletedLesson,
  hasCompletedProject,
  hasCompletedProjectPart,
  hasStartedCourse,
} from '../_helpers';
import GridContainer from '../../../components/GridContainer';
import NumberedAccordion from '../../../components/NumberedAccordion';
import FeaturesOrResources from '../../../components/FeaturesOrResources';
import Icon from '../../../components/Icon';
import waveform from '../../../assets/waveform/waveform-top-left-cool.png';
import projectIcon from '../../../assets/homepage/technical-mentor.svg';
import currentLessonIcon from '../../../assets/homepage/finger-point.svg';

const Detail = ({ title, value, icon = faCheckCircle }) => (
  <Flex align="center" mb={4}>
    <Icon icon={icon} boxSize={8} />
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
  const prepareSyllabusContent = (
    description,
    parts,
    lessonId,
    isCurrent,
    isTakingCourse
  ) => (
    <Box bg="gray.200" p={8}>
      <Text mb={4}>{description}</Text>
      <List spacing={2}>
        {parts.map(({ title, _id, type, _key }, index) => {
          const isComplete =
            _id && !_key
              ? hasCompletedConcept(progress, lessonId, _id)
              : hasCompletedProjectPart(progress, _key);

          let icon;

          const conceptIcon = type
            ? type === 'video'
              ? faPlayCircle
              : faFile
            : null;

          if (isComplete) {
            if (conceptIcon) icon = conceptIcon;
            else icon = faCheckCircle;
          } else {
            if (conceptIcon) icon = conceptIcon;
            else icon = faCircle;
          }

          const iconProps: any = {
            boxSize: 5,
            mr: 2,
            color: isComplete ? 'blue.500' : 'gray.600',
          };

          return (
            <ListItem key={index} display="flex" alignItems="center">
              <ListIcon as={() => <Icon {...iconProps} icon={icon} />} />
              {title}
            </ListItem>
          );
        })}
      </List>
      {isCurrent && isTakingCourse && (
        <Flex justify="flex-end" mt={4}>
          <Link to={resumeLink}>
            <Flex align="center">
              <Text fontWeight="bold" mr={3}>
                Resume
              </Text>
              <Icon icon={faArrowRight} />
            </Flex>
          </Link>
        </Flex>
      )}
    </Box>
  );

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

  const determineOpenLessons = () => {
    if (!isTakingCourse) return [0];
    if (hasCompletedCourse(progress)) return [];

    for (let i = 0; i < page.lessons.length; i++) {
      if (!hasCompletedLesson(progress, page.lessons[i]._id)) return [i];
    }

    if (!hasCompletedProject(progress)) return [page.lessons.length];

    return [];
  };

  const openLessons = determineOpenLessons();
  const [indexes, setIndexes] = useState(openLessons);

  const toggleAccordionItem = (index) => {
    const isActive = indexes.includes(index);

    if (isActive) setIndexes(indexes.filter((i) => i !== index));
    else setIndexes([...indexes, index]);
  };

  const lessons = page.lessons
    ? page.lessons.map(({ title, description, concepts, _id }, index) => ({
        title,
        content: prepareSyllabusContent(
          description,
          concepts,
          _id,
          openLessons.includes(index),
          isTakingCourse
        ),
        icon:
          openLessons.includes(index) && isTakingCourse
            ? currentLessonIcon
            : null,
      }))
    : [];

  if (project) {
    lessons.push({
      title: project.title,
      content: prepareSyllabusContent(
        project.description,
        project.parts,
        null,
        openLessons.includes(page.lessons.length),
        isTakingCourse
      ),
      icon: projectIcon,
    });
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
              {cost && (
                <Detail title="Cost" value={cost} icon={faMoneyBillWave} />
              )}
              {level && <Detail title="Level" value={level} icon={faStar} />}
              {length && (
                <Detail title="Length" value={length} icon={faClock} />
              )}
              {certification && (
                <Detail
                  title="Certification"
                  value={certification.title}
                  icon={faCertificate}
                />
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
      </Box>
    </>
  );
};
