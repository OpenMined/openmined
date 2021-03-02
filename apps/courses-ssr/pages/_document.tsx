import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  componentDidMount () {
    if (typeof window !== 'undefined') {
      (window as any).plausible = (window as any).plausible || function () {};
      ((window as any).plausible.q = (window as any).plausible.q || []).push(
        arguments
      );
    }
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <title>Openmined</title>
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
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export const getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const originalRenderPage = ctx.renderPage;

  // ctx.renderPage = () =>
  //   originalRenderPage({
  //     enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
  //   });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles)],
  };
};
