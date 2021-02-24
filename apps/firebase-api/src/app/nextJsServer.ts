import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import next from "next";

import path from 'path';

// const dev = process.env.NODE_ENV !== "production";
const dev = false;

const app = next({
  dev,
  dir: "apps/courses-ssr",
  conf: { distDir: 'dist/.next' },
});
const handle = app.getRequestHandler();

const server = functions.https.onRequest((request, response) => {
  // log the page.js file or resource being requested
  console.log("File: " + request.originalUrl);
  return app.prepare().then(() => handle(request, response));
});

export default server;
