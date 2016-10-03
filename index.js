'use strict';

const moment = require('moment');
const cron = require('node-cron');

const apple = require('./lib/apple');
const logger = require('./lib/logger');

const task = cron.schedule('0,30 * * * * *', () => {
  apple.scan();
  logger.info(moment().format('YYYY-MM-DD HH:mm:ss'));
});
task.start();
