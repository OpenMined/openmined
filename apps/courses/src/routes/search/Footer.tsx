import React from 'react';
import { 
  Box,
  Button, 
  Divider, 
  Flex, 
  Heading,
  Icon,
  Link,
  List, 
  ListItem,
  Text,
 } from '@chakra-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import GridContainer from '../../components/GridContainer';

export default ({ title, description, button, catalog, resources, copyright, otherLinks }) => (
  <Box bg="gray.900" color="white" py={16}>
    <GridContainer>
      <Flex direction={['column', null, null, 'row']} >
        <Box
          flex={[null, null, null, '0 0 40%']}
          width="100%"
          mb={[4, null, null, 0]}
          mr={[0, null, null, 32]}
          ml={[0, null, null, 16]}
        >
          <Heading as="h2" size="2l" mb={4}>
            {title}
          </Heading>
          <Text color="gray.400" fontSize="sm" mb={8}>
            {description}
          </Text>
          <Button
            key={0}
            as="a"
            href={'/'}
            target="_blank"
            mr={4}
            colorScheme="white"
          >
            {button.text}
            <Icon
              as={FontAwesomeIcon}
              icon={button.icon}
              ml={2}
              boxSize={4}
              color="black"
            />
          </Button>
        </Box>
        <Box mr={[0, null, null, 16]}>
            <Heading as="h2" size="2l" mb={3}>
              {catalog.title}
            </Heading>
            <List >
                {catalog.links.map(({ name, href}) => (
                  <ListItem>
                    <Link 
                      color="gray.400"
                      fontSize="sm"
                      _hover={{ color: 'white' }} 
                      href={href}>
                      {name}
                    </Link>
                  </ListItem>
                ))}
            </List>
        </Box>
        <Box>
          <Heading as="h2" size="2l" mb={3}>
            {resources.title}
          </Heading>
          <List >
            {resources.links.map(({ name, href}) => (
              <ListItem>
                <Link 
                  color="gray.400"
                  fontSize="sm"
                  _hover={{ color: 'white' }} 
                  href={href}
                >
                  {name}
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Flex>

      <Flex mt={20} direction={['column', null, null, 'row']} justify="space-between"  >
        <Box
          flex={[null, null, null, '0 0 40%']}
          width="100%"
          mb={[4, null, null, 0]}
          mr={[0, null, null, 16]}
          ml={[0, null, null, 16]}
        >
          <Link _hover={{ color: 'white' }} fontSize="sm" color="gray.600" href="#">
            {copyright}
          </Link>        
        </Box>
        <Flex direction={['column', null, null, 'row']} >
          <Link 
            color="gray.600" 
            fontSize="sm" 
            _hover={{ color: 'white' }} 
            href={otherLinks[0].href}
          >
            {otherLinks[0].name}
          </Link>
          <Divider orientation="vertical" ml={5} mr={5}/>         
          <Link 
            _hover={{ color: 'white' }} 
            color="gray.600" 
            fontSize="sm" 
            href={otherLinks[0].href}
          >
            {otherLinks[1].name}
          </Link>
        </Flex>      
      </Flex>
    </GridContainer>
  </Box>
);
