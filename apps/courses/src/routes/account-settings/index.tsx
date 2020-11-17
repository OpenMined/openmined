import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/core';

import Page from '@openmined/shared/util-page';

import BasicInformation from './BasicInformation';
import ChangePassword from './ChangePassword';
import LinkedAccounts from './LinkedAccounts';

/*
TODO:
- Implement a variant that has the tab list displayed vertically and the tabs container horizontal
- Style from there and then implement the individual forms
*/

export default () => (
  <Page title="Account Settings">
    <Tabs variant="sticky">
      <TabList>
        <Tab>Basic Information</Tab>
        <Tab>Change Password</Tab>
        <Tab>Linked Accounts</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <BasicInformation />
        </TabPanel>
        <TabPanel>
          <ChangePassword />
        </TabPanel>
        <TabPanel>
          <LinkedAccounts />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Page>
);
