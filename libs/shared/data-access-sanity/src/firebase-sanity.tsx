import { useUser } from 'reactfire';
import React, { useEffect, useState } from 'react';

import sanityClient from './firebase-sanity-client';
import * as firebaseSanity from './firebase-sanity';

export type SANITY_FIREBASE_QUERY = {
  method: string;
  data: any;
};

export const runQuery = async (currentUser, query: SANITY_FIREBASE_QUERY) => {
  let token = '';
  if (currentUser) {
    token = await currentUser.getIdToken();
  }

  return sanityClient({
    method: 'POST',
    url: `runQuery/${query.method}`,
    data: query.data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const useFirebaseSanity = (method, params) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user: firebase.User = useUser();

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
      data: params,
    };

    runQuery(user, query)
      .then((d) => {
        setData(prepareData(d.data.data));
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
  }, [user, method, params]);

  return { data, loading, error };
};
