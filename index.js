'use strict'

const _ = require('lodash');
const rp = require('request-promise');
const moment = require('moment');
const logger = require('./logger');

logger.info('start..');

const Stores = {
  SHIBUYA: 'R119',
  OMOTESANDO: 'R224',
  GINZA: 'R079'
};

const Models = {
  IPHONE7_JB_128: 'MNCP2J/A',
  IPHONE7_JB_256: 'MNCV2J/A',
  IPHONE7_BLACK_32: 'MNCE2J/A',
  IPHONE7_BLACK_128: 'MNCK2J/A',
  IPHONE7_BLACK_256: 'MNCQ2J/A',
  IPHONE7_SILVER_32: 'MNCF2J/A',
  IPHONE7_SILVER_128: 'MNCL2J/A',
  IPHONE7_SILVER_256: 'MNCR2J/A',
  IPHONE7_GOLD_32: 'MNCG2J/A',
  IPHONE7_GOLD_128: 'MNCM2J/A',
  IPHONE7_GOLD_256: 'MNCT2J/A',
  IPHONE7_ROSE_32: 'MNCJ2J/A',
  IPHONE7_ROSE_128: 'MNCN2J/A',
  IPHONE7_ROSE_256: 'MNCU2J/A',
  IPHONE7_PLUS_JB_128: 'MN6K2J/A',
  IPHONE7_PLUS_JB_256: 'MN6Q2J/A',
  IPHONE7_PLUS_BLACK_32: 'MNR92J/A',
  IPHONE7_PLUS_BLACK_128: 'MN6F2J/A',
  IPHONE7_PLUS_BLACK_256: 'MN6L2J/A',
  IPHONE7_PLUS_SILVER_32: 'MNRA2J/A',
  IPHONE7_PLUS_SILVER_128: 'MN6G2J/A',
  IPHONE7_PLUS_SILVER_256: 'MN6M2J/A',
  IPHONE7_PLUS_GOLD_32: 'MNRC2J/A',
  IPHONE7_PLUS_GOLD_128: 'MN6H2J/A',
  IPHONE7_PLUS_GOLD_256: 'MN6N2J/A',
  IPHONE7_PLUS_ROSE_32: 'MNRD2J/A',
  IPHONE7_PLUS_ROSE_128: 'MN6J2J/A',
  IPHONE7_PLUS_ROSE_256: 'MN6P2J/A'
};

const options = {
  uri: 'https://reserve.cdn-apple.com/JP/ja_JP/reserve/iPhone/availability.json',
  headers: { 'User-Agent': 'Request-Promise' },
  json: true
};

function check() {
  rp(options)
    .then(json => {
      _.each(Stores, store => {
        const storeName = _.capitalize(_.findKey(Stores, v => {
          return v === store;
        }));
        const arr = [`${storeName}`];
        _.each(Models, model => {
          const status = json[store][model];
          if (status === 'UNLOCKED') {
            const modelName = _.findKey(Models, m => { return m === model; });
            const str = `    ${modelName}`;
            if (modelName.includes('__JB__')) {
              arr.push(str);
            }
            // arr.push(modelName.includes('__JB__') ? `${str} *****` : str);
          }
        });
        if (1 < arr.length) {
          logger.info(arr.join('\n'));
        }
      });
      logger.info(moment().format());
      return;
    })
    .catch(err => {
      logger.error(err.message);
    });
}

setInterval(check, 1000 * 30);
