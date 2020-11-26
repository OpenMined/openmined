import React, { createContext, useContext, useEffect, useState } from 'react';
import sanityClient from '@sanity/client';

const SanityContext = createContext(null);

export const SanityProvider = ({ sanityConfig, children }) => {
  const client = sanityClient(sanityConfig);

  return (
    <SanityContext.Provider value={client}>{children}</SanityContext.Provider>
  );
};

export const useSanity = (query) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const context = useContext(SanityContext);

  useEffect(() => {
    context
      .fetch(query)
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
  }, [context, query]);

  return { data, loading, error };
};
