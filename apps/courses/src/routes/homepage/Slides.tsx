import React, {
  useState,
  useEffect,
  useCallback,
  FunctionComponent,
  CSSProperties,
} from 'react';
import {
  Box,
  Heading,
  Text,
  Image,
  Flex,
  CircularProgress,
  CircularProgressProps,
  Icon,
} from '@chakra-ui/react';
import { useTimer } from 'use-timer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import theme from '../../theme';
import GridContainer from '../../components/GridContainer';

import { useWindowSize } from '../../helpers';
import { useSanity } from '@openmined/shared/data-access-sanity';

const absolute: CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

interface ControlledCircularProgressProps extends CircularProgressProps {
  variant?: string;
}

const ControlledCircularProgress: FunctionComponent<ControlledCircularProgressProps> = CircularProgress;

const ProgressButton = ({ value, direction, onClick }) => (
  <Box position="relative" width={8} height={8} cursor="pointer">
    <ControlledCircularProgress
      variant="controlled-motion"
      value={value}
      color="violet.500"
      thickness="8px"
      size={8}
      style={absolute}
    />
    {/* TODO: Icons are kinda ugly like this, do something about it when we import OMUI to the monorepo */}
    {direction === 'forward' && (
      <Icon
        as={FontAwesomeIcon}
        icon={faArrowRight}
        onClick={onClick}
        style={absolute}
      />
    )}
    {direction === 'back' && (
      <Icon
        as={FontAwesomeIcon}
        icon={faArrowLeft}
        onClick={onClick}
        style={absolute}
      />
    )}
  </Box>
);

export default (props) => {
  const { data, loading } = useSanity(`*[_type == "teacher"] {
    ...,
    "image": image.asset -> url,
  }`);

  const order = [
    'Cynthia Dwork',
    'Helen Nissenbaum',
    'Pascal Paillier',
    'Ilya Mironov',
    'Dawn Song',
    'Ramesh Raskar',
  ];
  const slides = data
    ? data.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name))
    : null;

  if (loading) return null;

  return <Slides {...props} slides={slides} />;
};

const Slides = ({ title, description, slides }) => {
  const REFRESH_RATE = 50;
  const SLIDE_DURATION = 5000;

  const { time, start, reset } = useTimer({
    interval: REFRESH_RATE,
    step: REFRESH_RATE,
  });
  const [current, setCurrent] = useState(0);

  const goNext = useCallback(() => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);

    reset();
    start();
  }, [current, slides.length, reset, start]);

  const goPrev = useCallback(() => {
    setCurrent(current - 1 < 0 ? slides.length - 1 : current - 1);

    reset();
    start();
  }, [current, slides.length, reset, start]);

  // Start the timer the first time this component loads
  useEffect(start, [start]);

  // Every time the timer gets to the intended duration, go to the next slide
  useEffect(() => {
    if (time >= SLIDE_DURATION) goNext();
  }, [time, goNext]);

  const { width } = useWindowSize();

  return (
    <Box overflow="hidden" mt={[16, null, null, 32]} mb={[16, null, 0]}>
      <GridContainer>
        <Flex align="center">
          <Box
            position="relative"
            display={['none', null, 'block']}
            flex="0 0 40%"
            height="460px"
            mr={8}
          >
            {slides.map(({ image, name }, i) => (
              <Box key={i} position="absolute" bottom={0} left={0}>
                <Box
                  display={['none', null, null, 'block']}
                  position="absolute"
                  top={-16}
                  left={-16}
                  width="100%"
                  height="100%"
                  bg={`linear-gradient(to bottom right, ${theme.colors.gray[50]}, ${theme.colors.gray[400]})`}
                  zIndex={-1}
                />
                <Image
                  src={image}
                  alt={name}
                  opacity={current === i ? 1 : 0}
                  ml={current === i ? 0 : -4}
                  transitionProperty="all"
                  transitionDuration="slower"
                  transitionTimingFunction="ease-in-out"
                />
              </Box>
            ))}
          </Box>
          <Box>
            <Heading as="h2" size="2xl" mb={4}>
              {title}
            </Heading>
            <Text color="gray.700" fontSize="lg" mb={[4, null, 16]}>
              {description}
            </Text>
            <Box
              position="relative"
              maxHeight="320px"
              display={['block', null, 'none']}
              mb={4}
              style={{ height: width - 30 || 320 }}
            >
              {slides.map(({ image }, i) => (
                <Box
                  key={i}
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  height="100%"
                  opacity={current === i ? 1 : 0}
                  bgImage={`url(${image})`}
                  bgRepeat="no-repeat"
                  bgPosition="bottom left"
                  bgSize="contain"
                  transitionProperty="opacity"
                  transitionDuration="slower"
                  transitionTimingFunction="ease-in-out"
                />
              ))}
            </Box>
            <Box position="relative" height="60px" mb={4}>
              {slides.map(({ name, credential }, i) => (
                <Box
                  key={i}
                  position="absolute"
                  top={0}
                  left={0}
                  opacity={current === i ? 1 : 0}
                  transitionProperty="opacity"
                  transitionDuration="slower"
                  transitionTimingFunction="ease-in-out"
                >
                  <Text color="violet.500" fontWeight="bold" mb={2}>
                    {name}
                  </Text>
                  <Text color="violet.400">{credential}</Text>
                </Box>
              ))}
            </Box>
            <Flex align="center">
              <ProgressButton value={0} direction="back" onClick={goPrev} />
              <Text mx={4} color="gray.700">
                {current + 1}/{slides.length}
              </Text>
              <ProgressButton
                value={(time / SLIDE_DURATION) * 100}
                direction="forward"
                onClick={goNext}
              />
            </Flex>
          </Box>
        </Flex>
      </GridContainer>
    </Box>
  );
};
