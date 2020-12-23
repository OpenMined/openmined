import React from 'react';
import { Box, Radio, forwardRef, RadioProps } from '@chakra-ui/react';

/*
 * This dreadful component exists because of an error that occurs in
 * Chakra UI running on React's experimental branch. Chakra's Radio becomes
 * focused when you click on it instead of becoming checked. Users then have to
 * double click to achieve what they want.
 *
 * Nice issues to follow:
 * https://github.com/chakra-ui/chakra-ui/issues/2842
 * https://github.com/blitz-js/blitz/issues/1600
 *
 * A codesandbox for Chakra UI in experimental mode:
 * https://codesandbox.io/s/recursing-blackwell-no53l
 */
const TempRadio = forwardRef<RadioProps, 'input'>(
  ({ onChange, value, children, ...props }, ref) => {
    const handleChange = () => {
      if (onChange && typeof onChange === 'function') {
        // @ts-ignore
        onChange(value);
      }
    };

    return (
      <Box onClick={handleChange}>
        <Radio value={value} {...props} ref={ref}>
          {children}
        </Radio>
      </Box>
    );
  }
);

export default TempRadio;
