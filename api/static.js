const path = require('path');
const express = require('express');

// Create express instance
const app = express();

// Setting CORS
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  next();
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', req.url));
});

// Export the server middleware
module.exports = {
  path: '/static',
  handler: app,
};
