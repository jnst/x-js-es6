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
    if (unlocked(status)) {
      stockedStores.push(modelId);
    }
  });
}

function printModels(storeName, modelIds) {
  if (!_.isEmpty(modelIds)) {
    logger.info(storeName);
    _.each(modelIds, modelId => {
      logger.info(toModelName(modelId));
    });
  }
}

function toStoreName(storeId) {
  return _.capitalize(_.findKey(Store, v => { return v === storeId; }));
}

function toModelName(modelId) {
  return _.findKey(Model, m => { return m === modelId; });
}

function unlocked(status) {
  return status === 'UNLOCKED';
}

exports.request = request;
exports.scanByStore = scanByStore;
exports.toStoreName = toStoreName;
exports.toModelName = toModelName;
exports.unlocked = unlocked;
