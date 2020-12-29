// Middleware to get the auth information from request
// import validateFirebaseToken from '../middlewares/validateFirebaseToken';

import * as queries from './queries';

export default (app) => {
  app.post('/runQuery/:method', queries.runQuery);
};
