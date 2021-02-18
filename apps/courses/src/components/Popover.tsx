// TODO: We can delete this component once the following issue is fixed:
// https://github.com/chakra-ui/chakra-ui/issues/2531

import React, { useState } from 'react';
import { Box, useTheme, useBreakpointValue, SlideFade } from '@chakra-ui/react';
import { Popover as TinyPopover } from 'react-tiny-popover';

export const Popover = ({
  trigger: Trigger,
  position,
  alignment,
  clickShouldCloseContent = false,
  isOpen = null,
  onOpen = null,
  children,
}) => {
  const [show, setShow] = useState(isOpen || false);

  const theme = useTheme();
  const lightGray = theme.colors.gray[100];

  const respPosition = useBreakpointValue(
    typeof position === 'object' || Array.isArray(position)
      ? position
      : [position]
  );

  const respAlignment = useBreakpointValue(
    typeof alignment === 'object' || Array.isArray(alignment)
      ? alignment
      : [alignment]
  );

  return (
    <TinyPopover
      isOpen={isOpen !== null ? isOpen : show}
      positions={[respPosition]}
      align={respAlignment}
      padding={12}
      reposition={true}
      onClickOutside={() => {
        if (onOpen) onOpen(false);
        else setShow(false);
      }}
      content={
        <SlideFade
          offsetY={respPosition === 'top' ? '20px' : '-20px'}
          in={isOpen !== null ? isOpen : show}
        >
          <Box
            bg={lightGray}
            px={6}
            py={4}
            borderRadius="md"
            onClick={() => {
              if (clickShouldCloseContent) {
                if (onOpen) onOpen(!show);
                else setShow(!show);
              }
            }}
          >
            {children}
          </Box>
        </SlideFade>
      }
    >
      <Box
        onClick={(ev) => {
          // stopPropagation, or it will invoke onClickOutside, thus closes the popup right away
          ev.stopPropagation();
          if (onOpen) onOpen(!show);
          else setShow(!show);
        }}
      >
        <Trigger />
      </Box>
    </TinyPopover>
  );
};
