import React from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Divider,
  Box,
  Heading,
  useToken,
} from '@chakra-ui/core';

import Page from '@openmined/shared/util-page';

import BasicInformation from '../../components/forms/users/BasicInformation';
import ChangePassword from '../../components/forms/users/ChangePassword';
import LinkedAccounts from '../../components/forms/users/LinkedAccounts';

import GridContainer from '../../components/GridContainer';

const StickyTabPanel = ({ title, children }) => (
  <Box bg="white" borderRadius="md" border="1px" borderColor="gray.400">
    <Box
      py={6}
      px={{ base: 6, lg: 8 }}
      borderBottom="1px"
      borderColor="gray.400"
    >
      <Heading as="h3" size="lg" color="indigo.500">
        {title}
      </Heading>
    </Box>
    <Box p={{ base: 6, lg: 8 }}>{children}</Box>
  </Box>
);

export default () => {
  const indigo50 = useToken('colors', 'indigo.50');

  return (
    <Page title="Account Settings" style={`body { background: ${indigo50}; }`}>
      <GridContainer isInitial py={{ base: 8, lg: 16 }}>
        {/* TODO: I'd love to not have to do this, waiting on this issue to be merged: https://github.com/chakra-ui/chakra-ui/issues/2548 */}
        <Tabs
          variant="sticky"
          display="flex"
          flexDirection={{ base: 'column', lg: 'row' }}
        >
          <TabList>
            <Text fontWeight="bold" color="gray.700">
              Account Settings
            </Text>
            <Divider my={3} />
            <Tab>Basic Information</Tab>
            <Tab>Change Password</Tab>
            <Tab>Linked Accounts</Tab>
          </TabList>
          {/* TODO: I'd love to not have to do this, waiting on this issue to be merged: https://github.com/chakra-ui/chakra-ui/issues/2548 */}
          <TabPanels width="full">
            <TabPanel>
              <StickyTabPanel title="Basic Information">
                <BasicInformation />
              </StickyTabPanel>
            </TabPanel>
            <TabPanel>
              <StickyTabPanel title="Change Password">
                <ChangePassword />
              </StickyTabPanel>
            </TabPanel>
            <TabPanel>
              <StickyTabPanel title="Linked Accounts">
                <LinkedAccounts />
              </StickyTabPanel>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </GridContainer>
    </Page>
  );
};
