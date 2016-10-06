'use strict';

const cron = require('node-cron');
const apple = require('./lib/apple');

cron.schedule('0,30 * * * * *', apple.scan, true).start();
