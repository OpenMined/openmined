import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';

const SEOContext = React.createContext(null);

export const SEOProvider = ({ metadata, children }) => (
  <SEOContext.Provider value={metadata}>{children}</SEOContext.Provider>
);

interface OverrideProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  noIndex?: boolean;
}

export default ({ children, ...overrides }: OverrideProps) => {
  const DEFAULT_TITLE = 'OpenMined';
  const DEFAULT_DESCRIPTION =
    'OpenMined is an open-source community whose goal is to make the world more privacy-preserving by lowering the barrier-to-entry to private AI technologies.';
  const DEFAULT_COLOR = '#333333';
  const BASE_URL = window.location.origin;

  const TWITTER_ACCOUNT = '@openminedorg';

  const {
    name = DEFAULT_TITLE,
    short_name = DEFAULT_TITLE,
    description = DEFAULT_DESCRIPTION,
    images,
  } = useContext(SEOContext);

  const manifest = {
    name: name,
    short_name: short_name,
    icons: [
      {
        src: `${BASE_URL}/android-chrome-192x192.png`,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: `${BASE_URL}/android-chrome-512x512.png`,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    theme_color: 'white',
    background_color: 'white',
    display: 'standalone',
  };

  return (
    <>
      <Helmet defaultTitle={name} titleTemplate={`%s | ${name}`}>
        <html lang="en" />

        <base target="_blank" href={`${BASE_URL}/`} />
        <link rel="canonical" href={`${BASE_URL}${window.location.pathname}`} />

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta itemProp="name" content={overrides.title || name} />
        <meta
          name="description"
          content={overrides.description || description}
        />
        <meta itemProp="image" content={images.main} />

        <meta name="apple-mobile-web-app-title" content={name} />
        <meta name="application-name" content={name} />
        <meta name="msapplication-TileColor" content={DEFAULT_COLOR} />
        <meta name="theme-color" content={DEFAULT_COLOR} />

        <meta property="og:title" content={overrides.title || name} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={images.facebook} />
        <meta
          property="og:description"
          content={overrides.description || description}
        />
        <meta property="og:site_name" content={name} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={TWITTER_ACCOUNT} />
        <meta name="twitter:title" content={overrides.title || name} />
        <meta
          name="twitter:description"
          content={overrides.description || description}
        />
        <meta name="twitter:creator" content={TWITTER_ACCOUNT} />
        <meta name="twitter:image:src" content={images.twitter} />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="manifest"
          href={`data:application/manifest+json,${JSON.stringify(manifest)}`}
        />
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg"
          color={DEFAULT_COLOR}
        />

        {overrides.noIndex && <meta name="robots" content="noindex" />}

        <title itemProp="name" lang="en">
          {overrides.title}
        </title>
      </Helmet>
      {children}
    </>
  );
};
