'use strict';

const co = require('co');

co(function* () {
  yield asyncFn();
  yield asyncFn();
  yield asyncFn();
  yield Promise.reject(new Error('Intentional Error'));
}).catch(err => {
  console.error(`test: ${err.message}`);
});

function asyncFn() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`time: ${Date.now()}`);
      resolve();
    }, 500);
  });
}
