/**
 * Logger
 * @description :: Setup application Logger using Winston
 * @info        :: https://github.com/winstonjs/winston
**/

const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: format.combine(
    format.colorize(),
    format.splat(),
    format.simple()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'error.log', level: 'error' }),
  ]
});

module.exports = logger;
