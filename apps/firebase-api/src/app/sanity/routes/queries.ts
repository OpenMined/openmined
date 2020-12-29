import { Request, Response, NextFunction } from 'express';
import { queries, SANITY_QUERY } from '../utils/queries';
import { verifyAuthToken } from '../middlewares/validate-firebase-token';
import sanity from '../utils/sanity';

const getSanityData = (query: SANITY_QUERY, data) => {
  const { env, ...params } = data;
  const client = sanity(env);
  const queryString = query.query(params);

  return client.fetch(queryString);
};

export const runQuery = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { method } = request.params;
    const data = request.body;

    // Make sure query is valid
    if (!queries[method]) {
      return response.status(404).json({ error: 'Query not found' });
    }

    const query: SANITY_QUERY = queries[method];

    // Make sure user is logged in if auth is true
    let currentUser = null;
    if (query.auth) {
      currentUser = await verifyAuthToken(request.headers);

      if (!currentUser) {
        return response.status(403).json({ error: 'Insufficient permission' });
      }
    }

    // TODO: check if user is allowed to access a specific course/lesson

    // Get sanity data
    const sanityData = await getSanityData(query, data);

    response.json({ data: sanityData });
  } catch (err) {
    next(err);
  }
};
