'use strict';

const _ = require('lodash');
const assert = require('assert');
const apple = require('../lib/apple');

describe('apple', () => {

  it('#request', () => {
    apple.request(json => {
      assert.equal(true, _.isPlainObject(json));
    });
  });

});
