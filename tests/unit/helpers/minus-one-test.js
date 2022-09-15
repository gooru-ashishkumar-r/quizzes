import { minusOne } from 'dummy/helpers/minus-one';
import { module, test } from 'qunit';

module('Unit | Helper | minus one');

test('Hepler:minusOne', function(assert) {
  let result = minusOne([42]);
  assert.equal(result, '+41', 'Wrong minus one value');
});
