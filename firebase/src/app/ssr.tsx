import React from 'react';
import path from 'path';
import fs from 'fs';

export default (req, res) => {
  const hours = (new Date().getHours() % 12) + 1;

  const courses = fs.readFileSync(
    path.join(__dirname, '../courses/index.html'),
    {
      encoding: 'utf-8',
    }
  );

  console.log(courses);

  res.status(200).send(`<!doctype html>
    <head>
      <title>Time</title>
    </head>
    <body>
      ${'BONG '.repeat(hours)}
    </body>
  </html>`);
};
