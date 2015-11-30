'use strict';

const assert = require('assert');

let x = 1;

if (true) {
  let x = 2;
  assert(x === 2)
}

assert(x === 1);
