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
    bg: 'blue.50',
    color: 'blue.700',
    border: '1px solid',
    borderColor: 'blue.100',
    borderBottom: '2px solid',
    borderBottomColor: ['blue.100', null, 'blue.700'],
  },
};

export default ({ children, ...props }) => {
  const childrenArray = React.Children.toArray(children)
  const titles = childrenArray.map(child => (child as any).props.title)
  return (
    <Tabs isFitted {...props}>
      <TabList flexDirection={['column', null, 'row']}>
        {titles.map(title => (
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
        {childrenArray}
      </TabPanels>
    </Tabs>
  );
};

export const ColoredTabPanel = ({ children, title, ...props }) => (
  <TabPanel {...props} key={title}>
    {children}
  </TabPanel>
);
