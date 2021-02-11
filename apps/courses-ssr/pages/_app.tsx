import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';

// import { ReactComponent as NxLogo } from '../public/nx-logo-white.svg';
import '../styles/app.css';

import Main from '../Main';

function CustomApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).plausible = (window as any).plausible || function () {};
      ((window as any).plausible.q = (window as any).plausible.q || []).push(
        arguments
      );
    }
  }, []);

  return (
    <>
      <Head>
        <title>Welcome to courses-ssr!</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code&family=Roboto:wght@400;700&family=Rubik:wght@500&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css"
          integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X"
          crossOrigin="anonymous"
        ></link>
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.js"
          integrity="sha384-g7c+Jr9ZivxKLnZTDUhnkOnsh30B4H0rpLUpJ4jAIKs4fnJI+sEnkvrMWph2EDg4"
          crossOrigin="anonymous"
        ></script>
        <script
          async
          defer
          data-domain="courses.openmined.org"
          src="https://plausible.io/js/plausible.outbound-links.js"
        ></script>
      </Head>
      <main>
        <Main>
          <Component {...pageProps} />
        </Main>
      </main>
    </>
  );
}

export default CustomApp;
