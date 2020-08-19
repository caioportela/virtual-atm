/**
 * Responses
 * @description :: Setup application responses
**/

const fs = require('fs');
const path = require('path');
const logger = require('../loaders/logger');

const basename = path.basename(__filename);
const responsesPath = `${__dirname}/../responses`;

const files = fs.readdirSync(responsesPath).filter((file) => {
  return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
});

const formatters = {};

files.forEach((file) => {
  const name = path.parse(file).name;
  logger.debug(`Loading Response Formatter: ${name}`);

  formatters[name] = require(path.join(responsesPath, file));
});

function generateFormats(req, res, next) {
  for(let title in formatters) {
    const formatter = formatters[title];
    res[title] = formatter.bind({ res });
  }

  next();
}

module.exports = generateFormats;
