import { noTags } from 'quizzes-addon/helpers/no-tags';
import { module, test } from 'qunit';

module('Unit | Helper | no tags');

// Replace this with your real tests.
test('Sanitize tag text default behavior', function(assert) {
  const result = noTags(
    {},
    { text: 'Text <span>having</span> <br>more than <br>10 characters' }
  );
  assert.equal(result, 'Text having more than 10 characters', 'Wrong text');
});

test('Sanitize tag text default behavior', function(assert) {
  const result = noTags({}, { text: 'Text having more than 10 characters' });
  assert.equal(result, 'Text having more than 10 characters', 'Wrong text');
});
