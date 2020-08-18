'use strict';

const bodyParser = require('body-parser');
const express = require('express');

const PORT = 3000;

// Initialize logger
const logger = require('./src/loaders/logger');

const app = express();

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
