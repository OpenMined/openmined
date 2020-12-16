import React, { useEffect, useState } from 'react';
import { Box, Flex, Heading, Text, Button, Link, Icon } from '@chakra-ui/react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import GridContainer from '../../components/GridContainer';
import theme from '../../theme';

const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';

const Map = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    let mounted = true;

    fetch('https://stats.openmined.org/github')
      .then((data) => data.json())
      .then((data) => {
        if (mounted) {
          const finalMembers = data.members
            .map(({ coords }) => {
              if (!coords) return null;
              return [Math.round(coords[0]), Math.round(coords[1])];
            })
            .filter((d) => d);

          // @ts-ignore
          const uniqueMembers = Array.from(
            new Set(finalMembers.map(JSON.stringify)),
            JSON.parse
          );

          setMembers(uniqueMembers);
        }
      })
      .catch((error) => {
        console.error('Error fetching members', error);
      });

    return () => (mounted = false);
  }, []);

  if (members.length === 0) return null;

  const colors = [
    theme.colors.magenta,
    theme.colors.red,
    theme.colors.orange,
    theme.colors.yellow,
    theme.colors.green,
    theme.colors.teal,
    theme.colors.cyan,
    theme.colors.blue,
    theme.colors.indigo,
    theme.colors.violet,
  ];

  const DEG_LONG = 360;
  const LONG_GROUP_SIZE = DEG_LONG / colors.length;

  const colorGroups = colors.map((color, i) => ({
    color,
    start: LONG_GROUP_SIZE * i,
  }));

  const getColor = (coords) => {
    const modifiedLong = coords[0] + DEG_LONG / 2;
    let final;

    for (let i = 0; i < colorGroups.length; i++) {
      const { color, start } = colorGroups[i];

      if (modifiedLong >= start) final = color;
      else break;
    }

    return { fill: final[500], stroke: final[300] };
  };

  return (
    <ComposableMap projectionConfig={{ scale: 170, rotate: [-15] }}>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={theme.colors.gray[800]}
            />
          ))
        }
      </Geographies>
      {members.map((coords, i) => {
        if (coords) {
          const { fill, stroke } = getColor(coords);
          const size = 2.5;

          return (
            <Marker key={i} coordinates={coords}>
              <g>
                <rect
                  width={size * 4}
                  height={size * 4}
                  fill={stroke}
                  opacity="0.5"
                  transform={`rotate(-45) translate(-${size * 2}, -${
                    size * 2
                  })`}
                />
                <rect
                  x={size}
                  y={size}
                  width={size * 2}
                  height={size * 2}
                  fill={fill}
                  transform={`rotate(-45) translate(-${size * 2}, -${
                    size * 2
                  })`}
                />
              </g>
            </Marker>
          );
        }

        return null;
      })}
    </ComposableMap>
  );
};

export default ({ title, description, buttons, links }) => (
  <Box bg="gray.900" color="white" py={16}>
    <GridContainer>
      <Flex direction={['column', null, null, 'row']} align="center">
        <Box
          flex={[null, null, null, '0 0 60%']}
          width="100%"
          mb={[4, null, null, 0]}
          mr={[0, null, null, 16]}
        >
          <Map />
        </Box>
        <Box>
          <Heading as="h2" size="2xl" mb={4}>
            {title}
          </Heading>
          <Text color="gray.400" fontSize="lg" mb={8}>
            {description}
          </Text>
          <Flex wrap="wrap" mb={[8, null, null, 12]}>
            {buttons.map(({ link, title, icon }, i) => (
              <Button
                key={i}
                as="a"
                href={link}
                target="_blank"
                mr={i === 0 ? 4 : 0}
                colorScheme="gray"
              >
                {/* SEE TODO (#3) */}
                {title}{' '}
                <Icon
                  as={FontAwesomeIcon}
                  icon={icon}
                  ml={2}
                  boxSize={4}
                  color="black"
                />
              </Button>
            ))}
          </Flex>
          <Flex>
            {links.map(({ title, link }, i) => (
              <Link
                key={i}
                href={link}
                target="_blank"
                color="gray.400"
                _hover={{ color: 'white' }}
                ml={i === 0 ? 0 : 4}
              >
                {title}
              </Link>
            ))}
          </Flex>
        </Box>
      </Flex>
    </GridContainer>
  </Box>
);
