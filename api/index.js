const express = require('express');
const postPayload = require('../post-payload');

// Create express instance
const app = express();

// Setting CORS
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

postPayload.processing().forEach(({ route, payload }) => {
  app.get(route, async (req, res) => {
    try {
      res.json(payload);
    } catch (e) {
      console.log('e :', e);
    }
  });
});

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app,
};
