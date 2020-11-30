import React from 'react';
import {
  Box,
  Button,
  Circle,
  Divider,
  Flex,
  Heading,
  Icon,
  Image,
  ListItem,
  SimpleGrid,
  Text,
  UnorderedList,
} from '@chakra-ui/core';
import { useParams } from 'react-router-dom';
import Page from '@openmined/shared/util-page';
import { useSanity } from '@openmined/shared/data-access-sanity';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { coursesProjection } from '../../../helpers';
import GridContainer from '../../../components/GridContainer';
import FeaturesOrResources from '../../../components/FeaturesOrResources';
import waveform from '../../../assets/waveform/waveform-top-left-cool.png';

const Detail = ({ title, value }) => (
  <Flex align="center" mb={4}>
    <Icon as={FontAwesomeIcon} icon={faCheckCircle} size="2x" />
    <Box ml={4}>
      <Text fontWeight="bold">{title}</Text>
      <Text color="gray.700">{value}</Text>
    </Box>
  </Flex>
);

const LearnHow = ({ value }) => (
  <Box>
    <Circle bg="white" size={8} display={{ base: 'none', md: 'block' }}>
      <Icon as={FontAwesomeIcon} icon={faCheckCircle} size="2x" />
    </Circle>
    <Heading
      as="h3"
      size="md"
      lineHeight="base"
      mt={{ base: 0, md: 3 }}
      color="gray.700"
    >
      {value}
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

export default () => {
  const { slug } = useParams();
  const { data, loading } = useSanity(
    `*[_type == "course" && slug.current == "${slug}"] ${coursesProjection}[0]`
  );

  if (loading) return null;

  // TODO: Patrick, fill this variable in with the appropriate value
  const isTakingCourse = false;

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
  } = data;

  return (
    <Page title={data.title} description={data.description}>
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
            <Box flex={{ lg: '0 0 280px' }} mt={[8, null, null, 0]}>
              {cost && <Detail title="Cost" value={cost} />}
              {level && <Detail title="Level" value={level} />}
              {length && <Detail title="Length" value={length} />}
              {certification && (
                <Detail title="Certification" value={certification} />
              )}
              <Divider mb={4} />
              <Text fontWeight="bold">Prerequisites</Text>
              <UnorderedList mb={6}>
                {prerequisites.map((p) => (
                  <ListItem key={p}>{p}</ListItem>
                ))}
              </UnorderedList>
              {/* TODO: Patrick, this should actually start the course */}
              {!isTakingCourse && (
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={() => console.log('TRY THE COURSE')}
                >
                  Start Course
                </Button>
              )}
            </Box>
          </Flex>
        </GridContainer>
        {!isTakingCourse && (
          <Box bg="gray.200" py={[8, null, null, 12]} my={[8, null, null, 12]}>
            <GridContainer>
              <Heading as="h2" size="lg" mb={8}>
                Walk away being able to...
              </Heading>
              <SimpleGrid columns={[1, null, 2, 3]} spacing={8}>
                {learnHow.map((l) => (
                  <LearnHow value={l} key={l} />
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
            <Heading as="h2" size="lg" mb={4}>
              What You'll Learn
            </Heading>
            <Text color="gray.700">
              Below you will find the entire course syllabus organized by
              lessons and concepts.
            </Text>
            {/* TODO: Patrick, put the syllabus here */}
          </Flex>
        </GridContainer>
        {!isTakingCourse && (
          <GridContainer my={[8, null, null, 12]}>
            <Heading as="h2" size="lg" mb={8} textAlign="center">
              Who You'll Learn From
            </Heading>
            <SimpleGrid columns={[1, null, 2, 3]} spacing={8}>
              {learnFrom.map((l) => (
                <LearnFrom {...l} key={l.name} />
              ))}
            </SimpleGrid>
          </GridContainer>
        )}
        {/* TODO: Patrick, this should actually start the course */}
        {!isTakingCourse && (
          <Flex justify="center">
            <Button
              colorScheme="black"
              size="lg"
              onClick={() => console.log('TRY THE COURSE')}
            >
              Start Course
            </Button>
          </Flex>
        )}
        <Box my={[8, null, null, 12]}>
          {isTakingCourse && <FeaturesOrResources which="resources" />}
          {!isTakingCourse && <FeaturesOrResources which="features" />}
        </Box>
        {/* TODO: Patrick, add the other courses here */}
      </Box>
    </Page>
  );
};
