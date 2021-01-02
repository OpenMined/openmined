// TODO: Integrate sentry for logging
import { queries, SANITY_QUERY } from './utils/queries';
import sanity from './utils/sanity';

const determineAdmin = (context) => {
  if (process.env.NX_SANITY_ADMINS && context.auth && context.auth.uid) {
    const uid = context.auth.uid;
    const admins = process.env.NX_SANITY_ADMINS.split(',');

    if (admins.length > 0 && admins.includes(uid)) return true;
  }

  return false;
};

const getSanityData = (query: SANITY_QUERY, params, isAdmin) => {
  const client = sanity();
  const queryString = query.query({ ...params, isAdmin });

  return client.fetch(queryString);
};

/**
 * @data.method - method
 * @data.course, lesson, concept, extra query params
 */
export default async (data, context) => {
  try {
    const { method, params } = data;

    // Make sure query is valid
    if (!queries[method]) {
      return { error: 'Query not found' };
    }

    const query: SANITY_QUERY = queries[method];

    // Make sure user is logged in if auth is true
    if (query.auth) {
      if (!context.auth || !context.auth.uid) {
        return { error: 'Insufficient permission' };
      }
    }

    // TODO: Check if user is allowed to access a specific course/lesson

    // Determine if the user is an admin
    const isAdmin = determineAdmin(context);

    // Get sanity data
    const sanityData = await getSanityData(query, params, isAdmin);

    return sanityData;
  } catch (error) {
    return { error };
  }
};
