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
    printModels('渋谷', shibuyaStockedModelIds);
    printModels('表参道', omotesandoStockedModelIds);
    printModels('銀座', ginzaStockedModelIds);
  });
};

function request(callback) {
  rp(options)
    .then(callback)
    .catch(err => logger.error(err.message));
}

function scanByStore(json, store) {
  const stockedStores = [];
  _.each(Model, modelId => {
    const status = json[store][modelId];
    if (available(status)) {
      stockedStores.push(modelId);
    }
  });
  return stockedStores;
}

function printModels(storeName, modelIds) {
  let exists = false;
  if (!_.isEmpty(modelIds)) {
    logger.info(storeName);
    _.each(modelIds, modelId => {
      if (isJetBlack(modelId)) {
        logger.info(`  ${toModelName(modelId)}`);
        exists = true;
      }
    });
  }
  if (exists) {
    logger.info('  https://reserve.cdn-apple.com/JP/ja_JP/reserve/iPhone/availability');
  }
}

function toStoreName(storeId) {
  return _.capitalize(_.findKey(Store, v => { return v === storeId; }));
}

function toModelName(modelId) {
  return _.findKey(Model, m => { return m === modelId; });
}

function available(status) {
  return status === 'UNLOCKED' || status === 'ALL';
}

function isJetBlack(modelId) {
  return (modelId === Model.IPHONE7_JB_128) ||
    (modelId === Model.IPHONE7_JB_256) ||
    (modelId === Model.IPHONE7_PLUS_JB_128) ||
    (modelId === Model.IPHONE7_PLUS_JB_256);
}

exports.request = request;
exports.scanByStore = scanByStore;
exports.toStoreName = toStoreName;
exports.toModelName = toModelName;
exports.available = available;
