const express = require('express');
const postPayload = require('../post-payload');

// Create express instance
const app = express();

postPayload.processed.forEach(({ route, payload }) => {
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
