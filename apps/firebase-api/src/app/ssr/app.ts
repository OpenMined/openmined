import express from 'express';
import path from 'path'
import fs from 'fs'

// require('babel-register')({
//   ignore: /\/(build|node_modules)\//,
//   presets: ['@nrwl/react/babel']
// })

// routes
// const index = require('./routes/index');
import universalLoader from './universal'

const app = express();

// // Support post requests with body data (doesn't support multipart, use multer)
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))

// app.use('/', index)


// Always return the main index.html, so react-router render the route in the client
app.use('/', universalLoader)

// Serve static assets
app.use(express.static(path.join(__dirname, '../courses')))

export default app;
