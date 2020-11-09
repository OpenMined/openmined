import { useToast, UseToastOptions } from '@chakra-ui/core';

export default useToast;

export const toastConfig: UseToastOptions = {
  position: 'bottom-left',
  duration: 7000,
  isClosable: true,
};
