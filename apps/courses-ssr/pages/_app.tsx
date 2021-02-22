import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
// import { ReactComponent as NxLogo } from '../public/nx-logo-white.svg';
// import './styles.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default CustomApp;
