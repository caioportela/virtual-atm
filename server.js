'use strict';

const bodyParser = require('body-parser');
const express = require('express');

const PORT = 3000;

// Initialize logger
const logger = require('./src/loaders/logger');

const app = express();

app.use(bodyParser.json());

app.listen(PORT, () => {
  logger.debug(`Running on http://localhost:${PORT}`);
});
