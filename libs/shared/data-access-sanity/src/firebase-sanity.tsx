import React, { useEffect, useState } from 'react';

import * as firebaseSanity from './firebase-sanity';
import { useFunctions } from 'reactfire';

export type SANITY_FIREBASE_QUERY = {
  method: string;
  params: any;
  env?: string;
};

export const useFirebaseSanity = (method, params = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const functions: firebase.functions.Functions = useFunctions();
  // @ts-ignore
  functions.region = 'europe-west1';
  const sanity = functions.httpsCallable('sanity');

  const prepareData = (d) => {
    Object.keys(d).forEach((i) => {
      const elem = d[i];

      // Make sure we convert all breaking spaces to <br /> tags
      if (typeof elem === 'string' && elem.includes('\n')) {
        d[i] = (
          <span
            dangerouslySetInnerHTML={{
              __html: elem.split('\n').join('<br />'),
            }}
          />
        );
      }
    });

    return d;
  };

  useEffect(() => {
    const query: firebaseSanity.SANITY_FIREBASE_QUERY = {
      method,
      params,
      env: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    };

    sanity(query)
      .then((d) => {
        setData(prepareData(d.data));
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
  }, [method, params]);

  return { data, loading, error };
};
