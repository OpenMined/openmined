import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { useUser } from 'reactfire';

import Page from '@openmined/shared/util-page';

import GridContainer from '../../../components/GridContainer';

import BasicInformation from '../../../components/forms/users/BasicInformation';
import ChangePassword from '../../../components/forms/users/ChangePassword';
import AddPassword from '../../../components/forms/users/AddPassword';
import ManageAccount from '../../../components/forms/users/ManageAccount';

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
  const user = useUser();
  const [tabIndex, setTabIndex] = useState(0);
  const indigo50 = useToken('colors', 'indigo.50');

  // @ts-ignore
  const hasPasswordAccount = !!user.providerData.filter(
    (p) => p.providerId === 'password'
  ).length;

  return (
    <Page title="Account Settings" body={{ style: `background: ${indigo50};` }}>
      <GridContainer isInitial py={{ base: 8, lg: 16 }}>
        <Tabs
          index={tabIndex}
          onChange={(index) => setTabIndex(index)}
          variant="sticky"
        >
          <TabList>
            <Text fontWeight="bold" color="gray.700">
              Account Settings
            </Text>
            <Divider my={3} />
            <Tab>Basic Information</Tab>
            {hasPasswordAccount && <Tab>Change Password</Tab>}
            {!hasPasswordAccount && <Tab>Add Password</Tab>}
            <Tab>Manage Account</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <StickyTabPanel title="Basic Information">
                <BasicInformation
                  onChangeEmailOrGithub={() => setTabIndex(2)}
                  onAddPassword={() => setTabIndex(1)}
                />
              </StickyTabPanel>
            </TabPanel>
            {hasPasswordAccount && (
              <TabPanel>
                <StickyTabPanel title="Change Password">
                  <ChangePassword />
                </StickyTabPanel>
              </TabPanel>
            )}
            {!hasPasswordAccount && (
              <TabPanel>
                <StickyTabPanel title="Add Password">
                  <AddPassword callback={() => setTabIndex(0)} />
                </StickyTabPanel>
              </TabPanel>
            )}
            <TabPanel>
              <StickyTabPanel title="Manage Account">
                <ManageAccount
                  onAddPassword={() => setTabIndex(1)}
                  callback={() => setTabIndex(0)}
                />
              </StickyTabPanel>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </GridContainer>
    </Page>
  );
};
