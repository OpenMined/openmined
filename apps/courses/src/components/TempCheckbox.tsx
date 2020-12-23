import React from 'react';
import { Box, Checkbox, CheckboxProps } from '@chakra-ui/react';

/*
 * This dreadful component exists because of an error that occurs in
 * Chakra UI running on React's experimental branch. Chakra's Checkbox becomes
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
export default ({ onChange, value, children, ...props }: CheckboxProps) => {
  const [isChecked, setChecked] = React.useState(false);

  const handleChange = () => {
    if (onChange && typeof onChange === 'function') {
      // @ts-ignore
      onChange(value);
    }
    setChecked(!isChecked);
  };

  return (
    <Box onClick={handleChange}>
      {!!isChecked && (
        <Checkbox value={value} isChecked={true} {...props}>
          {children}
        </Checkbox>
      )}
      {!isChecked && (
        <Checkbox value={value} {...props}>
          {children}
        </Checkbox>
      )}
    </Box>
  );
};
