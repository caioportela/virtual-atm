/**
* Controllers
* @description :: Setup route controllers
**/

const fs = require('fs');
const path = require('path');
const logger = require('../loaders/logger');

const basename = path.basename(__filename);

const files = fs.readdirSync(__dirname).filter((file) => {
  return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
});

const controllers = {};

files.forEach((file) => {
  const filename = path.parse(file).name;
  const controller = require(path.join(__dirname, file));

  logger.debug(`Loading Controller: ${filename}`);
  controllers[filename] = controller;
});

module.exports = controllers;
