import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Image,
  SimpleGrid,
  useDisclosure,
  List,
  ListItem,
  ListIcon,
  Button,
  ChakraProps,
} from '@chakra-ui/core';
// import { useNavigate } from 'react-router-dom';
import { useSanity } from '@openmined/shared/data-access-sanity';

import logo from '../../assets/logo.svg';
import GridContainer from '../../components/GridContainer';
import Modal from '../../components/Modal';
import Course from '../../components/CourseCard';

const gradientOverlay: ChakraProps = {
  position: 'relative',
  overflow: 'hidden',
  _after: {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(to right, rgba(255,255,255,0.5), rgba(255,255,255,0.01))',
  },
};

const CourseModal = ({
  title,
  description,
  prerequisites,
  learnHow,
  project,
  visual,
  cost,
  level,
  length,
  color,
  onSignup,
}) => {
  const ListIconDot = () => (
    <Box
      borderRadius="full"
      width={2}
      height={2}
      bg={color}
      display="inline-block"
      mr={4}
    />
  );

  return (
    <Flex direction={['column', null, null, 'row']} mt={8}>
      <Flex
        direction="column"
        align="center"
        textAlign="center"
        flex={[1, null, null, '0 0 360px']}
        mr={[0, null, null, 8]}
        bg="gray.900"
        p={8}
        borderRadius="md"
      >
        <Heading as="p" color="white" size="xl">
          {title}
        </Heading>
        <Flex direction={['column', null, null, 'column-reverse']}>
          <Text color="gray.400" mt={[4, null, null, 0]}>
            {cost.toUpperCase()} | {level} | {length}
          </Text>
          <Image
            src={visual.full}
            alt={title}
            width={200}
            height={200}
            mx="auto"
            my={8}
          />
        </Flex>
      </Flex>
      <Box mt={[8, null, null, 0]}>
        <Box height={1} width="80px" mb={4} bg={color} {...gradientOverlay} />
        <Text mb={8} color="gray.700">
          {description}
        </Text>
        <Box mb={8}>
          <Text fontWeight="bold">Prerequisites:</Text>
          <Text color={color}>{prerequisites.join(', ')}</Text>
        </Box>
        <Box mb={8}>
          <Text fontWeight="bold">Learn how to:</Text>
          <List>
            {learnHow.map((item, i) => (
              <ListItem key={i}>
                <ListIcon as={ListIconDot} bg={color} />
                <Text as="span" color="gray.700">
                  {item}
                </Text>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box mb={8}>
          <Text fontWeight="bold">Project:</Text>
          <Text color="gray.700">{project}</Text>
        </Box>
        <Button
          colorScheme={color.slice(0, color.indexOf('.'))}
          onClick={onSignup}
        >
          Sign Up
        </Button>
      </Box>
    </Flex>
  );
};

export default ({ title, description }) => {
  const { data, loading } = useSanity(
    `*[_type == "course"] {
      ...,
      visual {
        "default": default.asset -> url,
        "full": full.asset -> url
      }
    }`
  );


  const order = [
    'Privacy and Society',
    'Foundations of Private Computation',
    'Federated Learning Across Enterprises',
    'Federated Learning on Mobile',
  ];
  const courses = data
    ? data.sort((a, b) => order.indexOf(a.title) - order.indexOf(b.title))
    : null;

  const [isHovered, setIsHovered] = useState(null);
  // const navigate = useNavigate();

  const [modalContent, setModalContent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const launchModal = (course) => {
    setModalContent({
      title: (
        <Image src={logo} alt="OpenMined Courses" width={[160, null, 200]} />
      ),
      children: (
        <CourseModal
          {...course}
          onSignup={() => {
            onClose();

            // TODO: We can uncomment this when we're ready to launch
            // setTimeout(() => navigate('/signup'), 200);
            setTimeout(() => {
              document
                .getElementById('signup')
                .scrollIntoView({ behavior: 'smooth' });
            }, 200);
          }}
        />
      ),
    });
    onOpen();
  };

  return (
    <>
      <Box bg="gray.900" color="white" py={[16, null, null, 32]}>
        <GridContainer>
          <Heading as="h2" size="2xl" mb={4}>
            {title}
          </Heading>
          <Text
            color="gray.400"
            fontSize="lg"
            width={{ md: '60%', xl: '40%' }}
            mb={12}
          >
            {description}
          </Text>
          <SimpleGrid columns={[1, null, 2, null, 4]} spacing={[4, null, 6]}>
            {!loading &&
              courses &&
              courses.map((course, i) => (
                <Course
                  key={i}
                  content={course}
                  onMouseEnter={() => setIsHovered(i)}
                  onMouseLeave={() => setIsHovered(null)}
                  transform={
                    isHovered === i
                      ? 'scale(1.05)'
                      : isHovered !== null
                      ? 'scale(0.95)'
                      : 'none'
                  }
                  style={{
                    filter:
                      isHovered === null || (isHovered && !(isHovered === i))
                        ? 'grayscale(1)'
                        : 'none',
                  }}
                  onClick={() => launchModal(course)}
                />
              ))}
          </SimpleGrid>
        </GridContainer>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} {...modalContent} size="6xl" />
    </>
  );
};
