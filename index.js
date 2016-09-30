'use strict'

const moment = require('moment');

const apple = require('./apple');
const logger = require('./logger');

logger.info('start..');
setInterval(() => {
  apple.scan();
  logger.info(moment().format('YYYY-MM-DD HH:mm:ss'));
}, 1000 * 30);
