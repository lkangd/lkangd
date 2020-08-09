const express = require('express');
const postPayload = require('../post-payload');

const port = process.env.API_PORT;

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

if (port) {
  let exitTimer = null;
  const updateExitTimer = () => {
    exitTimer && clearTimeout(exitTimer);
    exitTimer = setTimeout(() => process.exit(), 1000 * 60);
  };
  postPayload.processed.forEach(({ route, payload }) => {
    app.get(`/api${route}`, async (req, res) => {
      try {
        updateExitTimer();
        res.json(payload);
      } catch (e) {
        console.log('e :', e);
      }
    });
  });
  app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
  });
} else {
  postPayload.processed.forEach(({ route, payload }) => {
    app.get(route, async (req, res) => {
      try {
        res.json(payload);
      } catch (e) {
        console.log('e :', e);
      }
    });
  });
}

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app,
};
