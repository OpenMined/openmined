import React, { lazy } from 'react';
import { useUser } from 'reactfire';

import { Box } from '@chakra-ui/react';

import Header from '../components/Header';
import Footer from '../components/Footer';

// const AuthRoute = (props) => {
//   const user = useUser();

//   return user ? <Route {...props} /> : <Navigate to="/signin" />;
// };

// const UnauthRoute = (props) => {
//   const user = useUser();

//   return !user ? <Route {...props} /> : <Navigate to="/users/dashboard" />;
// };

export default ({
  noHeader = false,
  blackHeader = false,
  noFooter = false,
  children,
}) => (
  <>
    {!noHeader && <Header noScrolling={blackHeader} />}
    <Box
      minHeight="100vh"
      display="grid"
      gridTemplateRows={!noFooter ? '1fr' : '1fr auto'}
    >
      {children}
      {!noFooter && <Footer />}
    </Box>
  </>
);
