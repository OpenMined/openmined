import React from 'react';
import { Divider } from '@chakra-ui/core';

export default ({ spacing }) => <Divider spacing={spacing} />; // Divider doesnt have a prop named spacing, so I am leaving
// it here, because the person who made this component might
// have wanted to use the `spacing` prop for some css
// styling
