'use strict';

const assert = require('assert');

try {
  const x = 1;
  x = 2;
} catch(err) {
  assert(err.message === 'Assignment to constant variable.');
}
