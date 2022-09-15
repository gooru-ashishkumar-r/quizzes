import { fractional } from 'quizzes-addon/helpers/fractional';
import { module, test } from 'qunit';

module('Unit | Helper | fractional');

test('Fractional Helper', function(assert) {
  const result = fractional({}, { numerator: 1, denominator: 2 });
  assert.equal(
    result.string,
    '<span class="top">1</span><span class="bottom">2</span>',
    'Wrong response'
  );
});

test('Fractional Helper With Expression', function(assert) {
  const result = fractional({}, { expression: '1/2' });
  assert.equal(
    result.string,
    '<span class="top">1</span><span class="bottom">2</span>',
    'Wrong response'
  );
});
