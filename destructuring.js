'use strict';

/**
 * Node v4.0.0 not supported
 */

var [a, , b] = [1, 2, 3];
assert(a === 1);
assert(b === 3);

function showName({ first: x, last: y }) {
  console.log(`${x} ${y}`);
}
showName({ first: 'Taro', last: 'Yamada' });
