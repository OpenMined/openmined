import React from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

const tabProps = {
  fontWeight: 'bold',
  color: 'gray.600',
  borderColor: 'gray.300',
  borderTopRadius: 'md',
  borderBottomRadius: ['md', null, 'none'],
  py: 4,
  mb: [2, null, 0],
  _selected: {
    bg: 'cyan.50',
    color: 'cyan.700',
    border: '1px solid',
    borderColor: 'cyan.100',
    borderBottom: '2px solid',
    borderBottomColor: ['cyan.100', null, 'cyan.700'],
  },
};

export default ({ content, ...props }) => (
  <Tabs isFitted {...props}>
    <TabList flexDirection={['column', null, 'row']}>
      {content.map(({ title }) => (
        <Tab {...tabProps} key={title}>
          {title}
        </Tab>
      ))}
    </TabList>
    <TabPanels
      bg="white"
      border="1px solid"
      borderColor="gray.300"
      borderBottomRadius="md"
    >
      {content.map(({ panel: Panel, title, ...i }) => (
        <TabPanel {...i} key={title}>
          <Panel />
        </TabPanel>
      ))}
    </TabPanels>
  </Tabs>
);
