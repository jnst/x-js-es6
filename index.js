'use strict';

const moment = require('moment');

const apple = require('./lib/apple');
const logger = require('./lib/logger');

logger.info('start..');
setInterval(() => {
  apple.scan();
  logger.info(moment().format('YYYY-MM-DD HH:mm:ss'));
}, 1000 * 30);
