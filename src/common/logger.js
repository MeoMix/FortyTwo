const { createLogger, format, transports } = require('winston');
const { omit, isEmpty } = require('lodash');
const moment = require('moment');

const defaultFormats = format.combine(
  format.printf(info => {
    // Capture extra information logged as: logger.info('...', { foo: 'bar' })
    const extra = omit(info, ['level', 'message', 'splat']);

    return `${info.level} ${moment().format(`hh:mm:ss:SSS`)}: ${info.message}${isEmpty(extra) ? '' : JSON.stringify(extra)}`;
  })
);

const logger = createLogger({
  transports: [
    new transports.Console({
      level: 'info',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      format: defaultFormats
    }),
    // new transports.File({
    //   level: 'profit',
    //   filename: 'profit.log',
    //   maxSize: 5000000,
    //   maxFiles: 50,
    //   format: defaultFormats
    // }),
    // new transports.File({
    //   level: 'error',
    //   filename: 'error.log',
    //   maxSize: 5000000,
    //   maxFiles: 50,
    //   format: defaultFormats
    // }),
    // new transports.File({
    //   level: 'debug',
    //   filename: 'debug.log',
    //   maxSize: 5000000,
    //   maxFiles: 50,
    //   format: defaultFormats
    // })
  ]
  
});

module.exports = logger;