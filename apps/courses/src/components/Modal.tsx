import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/core';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  buttons?: React.ReactNode;
  children: React.ReactNode;
}

export default ({
  isOpen,
  onClose,
  title,
  buttons,
  children,
  ...props
}: ModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} {...props}>
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        {buttons && <ModalFooter>{buttons}</ModalFooter>}
      </ModalContent>
    </ModalOverlay>
  </Modal>
);
