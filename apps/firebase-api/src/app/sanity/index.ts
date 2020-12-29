import routes from './routes';

const express = require('express');
const cookieParser = require('cookie-parser')();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')({
  origin: true,
  credentials: true,
});

// Create Express application
const app = express();

// This must be the first middleware
app.use(bodyParser.urlencoded({ limit: 1024 * 1024 * 20, extended: true }));
app.use(bodyParser.json({ limit: 1024 * 1024 * 20, type: 'application/json' }));
app.use(cors);
app.use(cookieParser);
routes(app);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.json({ error: err });
  return next(err);
});

export default app;
