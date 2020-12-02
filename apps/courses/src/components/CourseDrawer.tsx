import React from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/core';

export default ({ isOpen, onOpen, onClose, header, children, ...props }) => (
  <Drawer isOpen={isOpen} placement="left" onClose={onClose} {...props}>
    <DrawerOverlay>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{header}</DrawerHeader>
        <DrawerBody>{children}</DrawerBody>
      </DrawerContent>
    </DrawerOverlay>
  </Drawer>
);
