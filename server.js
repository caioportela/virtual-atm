'use strict';

const bodyParser = require('body-parser');
const express = require('express');

const PORT = 3000;

// Initialize logger
const logger = require('./src/loaders/logger');

// Initialize responses
const responses = require('./src/loaders/responses');

// Initialize models
require('./src/models');

const app = express();

app.use(responses);
app.use(bodyParser.json());

// Initialize routes
require('./src/routes')(app);

if(process.env.NODE_ENV === 'test') {
  logger.info('Exporting app for testing');
  logger.level = 'crit';

  module.exports = app;
} else {
  app.listen(PORT, () => {
    logger.info(`Running on http://localhost:${PORT}`);
  });
}
