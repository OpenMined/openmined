import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Icon,
  Link,
  Text,
} from '@chakra-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faCommentAlt } from '@fortawesome/free-solid-svg-icons';

import GridContainer from '../../../components/GridContainer';

export default ({ setSubmissionView, projectTitle, part }) => {
  const { title } = part;

  return (
    <GridContainer isInitial pt={[8, null, null, 16]} pb={16}>
      <Flex justify="space-between" align="center">
        <Breadcrumb
          spacing="8px"
          separator={
            <Icon as={FontAwesomeIcon} icon={faAngleRight} color="gray.400" />
          }
        >
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => setSubmissionView(null)}>
              {projectTitle}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Link
          as="a"
          href="https://discussion.openmined.org"
          target="_blank"
          rel="noopener noreferrer"
          color="gray.600"
          _hover={{ color: 'gray.800' }}
        >
          <Flex align="center">
            <Icon as={FontAwesomeIcon} icon={faCommentAlt} mr={2} />
            <Text>Get Help</Text>
          </Flex>
        </Link>
      </Flex>
    </GridContainer>
  );
};
