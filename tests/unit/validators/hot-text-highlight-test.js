import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';
import Answer from 'quizzes-addon/models/resource/answer';

moduleFor(
  'validator:hot-text-highlight',
  'Unit | Validator | hot-text-highlight',
  {
    needs: ['validator:messages']
  }
);

test('check if brackets are balanced using bracketsAreBalanced()', function(
  assert
) {
  var validator = this.subject();
  const correctlyBalanced = 'The quick brown fox [jumps] over the lazy dog';
  const incorrectlyBalanced =
    'The quick brown fox [jumps[ over] t]he] ]lazy dog';

  assert.ok(
    validator.bracketsAreBalanced(correctlyBalanced),
    'String is not bracket balanced'
  );
  assert.notOk(
    validator.bracketsAreBalanced(incorrectlyBalanced),
    'String is bracket balanced'
  );
});

test('check if selections are valid using validateSelections()', function(
  assert
) {
  var validator = this.subject();
  var answerText = 'The [quick] brown fox [jumps] over the lazy dog';

  assert.ok(
    validator.validateSelections(answerText, 'word'),
    'Answer is valid with words'
  );

  answerText = 'The [quick] brown fox []jumps over the lazy dog';
  assert.notOk(
    validator.validateSelections(answerText, 'word'),
    'Answer is invalid due to empty selection'
  );

  answerText = '[The quick brown fox jumps over the lazy dog.] The end.';
  assert.ok(
    validator.validateSelections(answerText, 'sentence'),
    'Answer is valid with a sentence'
  );

  answerText = '[The quick brown fox jumps over the lazy dog].';
  assert.notOk(
    validator.validateSelections(answerText, 'sentence'),
    'Answer is invalid due to missing point.'
  );
});

test('check if answer is correct with words selection', function(assert) {
  var validator = this.subject();
  var answer = Answer.create(Ember.getOwner(validator).ownerInjection(), {
    text: 'The quick brown fox [jumps] over the lazy dog',
    type: 'text',
    isCorrect: true,
    highlightType: 'word'
  });
  var options = {
    answerNotSelectedKey: 'common.errors.highlight-text-not-selected',
    wrongFormatKey: 'common.errors.highlight-text-wrong-format'
  };
  var i18n = Ember.Object.create({
    t: function(string) {
      return { string: string };
    }
  });
  validator.set('i18n', i18n);

  assert.ok(
    validator.validate(answer.get('text'), options, answer),
    'Answer is correct'
  );

  answer.set('text', 'The quick brown fox [jumps[ over the lazy dog');
  assert.equal(
    validator.validate(answer.get('text'), options, answer),
    options.wrongFormatKey,
    'Answer is not correct due to unbalanced brackets'
  );

  answer.set('text', '');
  assert.equal(
    validator.validate(answer.get('text'), options, answer),
    options.answerNotSelectedKey,
    'Answer is not correct due to empty text'
  );

  answer.set('text', 'The quick brown fox jumps over the lazy dog');
  assert.equal(
    validator.validate(answer.get('text'), options, answer),
    options.answerNotSelectedKey,
    'Answer is not correct due to not defined selections'
  );

  answer.set('text', '[The quick brown fox jumps over the lazy dog.] The end.');
  assert.equal(
    validator.validate(answer.get('text'), options, answer),
    options.wrongFormatKey,
    'Answer is not correct due to sentence inside the brackets'
  );
});

test('check if answer is correct with sentence selection', function(assert) {
  var validator = this.subject();
  var answer = Answer.create(Ember.getOwner(validator).ownerInjection(), {
    text: '[The quick brown fox jumps over the lazy dog.] The end.',
    type: 'text',
    isCorrect: true,
    highlightType: 'sentence'
  });
  var options = {
    answerNotSelectedKey: 'common.errors.highlight-text-not-selected',
    wrongFormatKey: 'common.errors.highlight-text-wrong-format'
  };
  var i18n = Ember.Object.create({
    t: function(string) {
      return { string: string };
    }
  });
  validator.set('i18n', i18n);

  assert.ok(
    validator.validate(answer.get('text'), options, answer),
    'Answer is correct'
  );

  answer.set(
    'text',
    '[The quick brown fox jumps[ over the lazy dog.] The end.'
  );
  assert.equal(
    validator.validate(answer.get('text'), options, answer),
    options.wrongFormatKey,
    'Answer is not correct due to unbalanced brackets'
  );

  answer.set('text', '');
  assert.equal(
    validator.validate(answer.get('text'), options, answer),
    options.answerNotSelectedKey,
    'Answer is not correct due to empty text'
  );

  answer.set('text', 'The quick brown fox jumps over the lazy dog. The End.');
  assert.equal(
    validator.validate(answer.get('text'), options, answer),
    options.answerNotSelectedKey,
    'Answer is not correct due to not defined selections'
  );

  answer.set(
    'text',
    'The quick [brown] fox jumps over the [lazy] dog. The end.'
  );
  assert.equal(
    validator.validate(answer.get('text'), options, answer),
    options.wrongFormatKey,
    'Answer is not correct due to word selections'
  );

  answer.set('text', '[The quick brown fox jumps over the lazy dog]. The end.');
  assert.equal(
    validator.validate(answer.get('text'), options, answer),
    options.wrongFormatKey,
    'Answer is not correct due to missing end period in the selection'
  );
});
