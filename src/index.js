/* jshint esversion: 6 */

const express = require('express'),
  app = express(),
  port = 8001 || process.env.PORT;

app.get('/healthcheck', (req, resp) => {
  resp.json({
    message: 'OK'
  });
});

app.listen(port, () => {
  console.log(`App started at ${port}`);
});

