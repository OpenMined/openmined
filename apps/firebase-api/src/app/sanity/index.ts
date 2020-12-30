import admin from 'firebase-admin';

// TODO: Integrate sentry for logging
import { logger } from 'firebase-functions';
import { queries, SANITY_QUERY } from './utils/queries';
import sanity from './utils/sanity';

const getSanityData = (query: SANITY_QUERY, env, params) => {
  const client = sanity(env);
  const queryString = query.query(params);

  return client.fetch(queryString);
};

/**
 * @data.method - method
 * @data.env - enviroment
 * @data.course, lesson, concept, extra query params
 */
export default async (data, context) => {
  try {
    const { method, env, params } = data;

    // Make sure query is valid
    if (!queries[method]) {
      return { error: 'Query not found' };
    }

    const query: SANITY_QUERY = queries[method];

    // Make sure user is logged in if auth is true
    if (query.auth) {
      if (!context.auth || !context.auth.uid) {
        return { error: 'Insufficient permission' }
      }
    }

    // TODO: check if user is allowed to access a specific course/lesson

    // Get sanity data
    const sanityData = await getSanityData(query, env, params);

    return sanityData;
  } catch (error) {
    return { error };
  }
};
