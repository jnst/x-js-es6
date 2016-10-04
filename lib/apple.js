'use strict';

const _ = require('lodash');
const rp = require('request-promise');

const logger = require('./logger');
const Store = require('./enum/store');
const Model = require('./enum/model');

const options = {
  uri: 'https://reserve.cdn-apple.com/JP/ja_JP/reserve/iPhone/availability.json',
  headers: { 'User-Agent': 'Request-Promise' },
  json: true
};

exports.scan = function() {
  request(json => {
    const shibuyaStockedModelIds = scanByStore(json, Store.SHIBUYA);
    const omotesandoStockedModelIds = scanByStore(json, Store.OMOTESANDO);
    const ginzaStockedModelIds = scanByStore(json, Store.GINZA);
    printModels(Store.SHIBUYA, shibuyaStockedModelIds);
    printModels(Store.OMOTESANDO, omotesandoStockedModelIds);
    printModels(Store.GINZA, ginzaStockedModelIds);
  });
};

function request(callback) {
  rp(options)
    .then(callback)
    .catch(err => logger.error(err.message));
}

function scanByStore(json, store) {
  if (_.isEmpty(json)) return []; // available.json is empty at 22:00
  const stockedStores = [];
  _.each(Model, modelId => {
    if (isJetBlackPlus128(modelId)) {
      const status = json[store][modelId];
      if (available(status)) {
        stockedStores.push(modelId);
      }
    }
  });
  return stockedStores;
}

function printModels(storeId, modelIds) {
  if (!_.isEmpty(modelIds)) {
    logger.info(toStoreName(storeId));
    _.each(modelIds, modelId => {
      logger.info(`  ${toModelName(modelId)}`);
      logger.info(`  ${createPurchaseURL(storeId, modelId)}`);
    });
  }
}

function toStoreName(storeId) {
  switch (storeId) {
  case Store.GINZA:
    return '銀座';
  case Store.SHIBUYA:
    return '渋谷';
  case Store.OMOTESANDO:
    return '表参道';
  default:
    return '未登録';
  }
}

function toModelName(modelId) {
  return _.findKey(Model, m => { return m === modelId; });
}

function available(status) {
  return status === 'UNLOCKED' || status === 'ALL';
}

function isJetBlackPlus128(modelId) {
  return modelId === Model.IPHONE7_PLUS_JB_128;
}

// https://reserve-jp.apple.com/JP/ja_JP/reserve/iPhone?partNumber=MNCL2J%2FA&channel=&rv=&path=&sourceID=&iPP=false&appleCare=&iUID=&iuToken=&carrier=&store=R150
// https://reserve.cdn-apple.com/JP/ja_JP/reserve/iPhone/availability?channel=&returnURL=&store=R224&unavailable=MN6K2J%2FA&partNumber=MN6K2J%2FA
function createPurchaseURL(storeId, modelId) {
  return `https://reserve-jp.apple.com/JP/ja_JP/reserve/iPhone?partNumber=${encodeURIComponent(modelId)}&store=${storeId}`;
}
