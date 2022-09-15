import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import AnswerModel from 'quizzes-addon/models/resource/answer';
import ResourceModel from 'quizzes-addon/models/resource/resource';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleForComponent(
  'player/questions/qz-true-false',
  'Integration | Component | player/questions/qz true false',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
      this.inject.service('i18n');
    }
  }
);

test('True or false question layout', function(assert) {
  assert.expect(9);

  const question = ResourceModel.create({
    //true false
    id: '569906aa3ec3bb39969acbe6',
    type: QUESTION_TYPES.trueFalse,
    body: 'True False Question',
    correctAnswer: Ember.A([AnswerModel.create({ value: '1', text: 'True' })]),
    answers: Ember.A([
      AnswerModel.create({ value: '1', text: 'True' }),
      AnswerModel.create({ value: '2', text: 'False' })
    ]),
    sequence: 2
  });

  let answers = [];
  this.set('question', question);
  this.on('myOnAnswerChanged', function(question, answer) {
    //called 2 times
    assert.deepEqual(
      answer,
      answers,
      'Answer changed, but the answers are not in the correct order'
    );
  });

  this.on('myOnAnswerCompleted', function(question, answer) {
    //called 2 times
    assert.deepEqual(
      answer,
      answers,
      'Answer changed, but the answers are not in the correct order'
    );
  });

  this.render(hbs`{{player/questions/qz-true-false question=question
        onAnswerChanged='myOnAnswerChanged' onAnswerCompleted='myOnAnswerCompleted'}}`);

  var $component = this.$(); //component dom element
  T.exists(assert, $component.find('.instructions'), 'Missing instructions');
  assert.equal(
    $component.find('.answer-choices .radio').length,
    2,
    'Missing answer choices'
  );
  assert.equal(
    $component.find('.answer-choices .radio input[type=radio]').length,
    2,
    'Missing answer choices radio inputs'
  );
  assert.equal(
    $component
      .find('.answer-choices .radio:eq(0)')
      .text()
      .trim(),
    '(A)True',
    'Incorrect Message'
  );
  assert.equal(
    $component
      .find('.answer-choices .radio:eq(1)')
      .text()
      .trim(),
    '(B)False',
    'Incorrect Message'
  );

  //select a radio button
  answers = [{ value: '2' }];
  $component.find('.answer-choices .radio input[type=radio]:eq(1)').click();

  answers = [{ value: '1' }];
  $component.find('.answer-choices .radio input[type=radio]:eq(0)').click();
});

test('True or false question layout - read only', function(assert) {
  assert.expect(2);

  const question = ResourceModel.create({
    //true false
    id: '569906aa3ec3bb39969acbe6',
    type: QUESTION_TYPES.trueFalse,
    body: 'True False Question',
    correctAnswer: Ember.A([AnswerModel.create({ value: '1', text: 'True' })]),
    answers: Ember.A([
      AnswerModel.create({ value: '1', text: 'True' }),
      AnswerModel.create({ value: '2', text: 'False' })
    ]),
    sequence: 2
  });

  this.set('question', question);

  this.render(
    hbs`{{player/questions/qz-true-false question=question readOnly=true}}`
  );

  var $component = this.$(); //component dom element
  assert.equal(
    $component.find('.answer-choices .radio.disabled').length,
    2,
    'Missing answer choices'
  );
  assert.equal(
    $component.find('.answer-choices .radio input[disabled]').length,
    2,
    'Missing answer choices radio inputs'
  );
});

test('True or false question layout - with user answer', function(assert) {
  assert.expect(4);

  const question = ResourceModel.create({
    //true false
    id: '569906aa3ec3bb39969acbe6',
    type: QUESTION_TYPES.trueFalse,
    body: 'True False Question',
    correctAnswer: Ember.A([AnswerModel.create({ value: '1', text: 'True' })]),
    answers: Ember.A([
      AnswerModel.create({ value: '1', text: 'True' }),
      AnswerModel.create({ value: '2', text: 'False' })
    ]),
    sequence: 2
  });
  const answers = [{ value: '2' }];
  this.on('changeAnswer', function(question, answer) {
    assert.deepEqual(
      answer,
      answers,
      'Answer changed, but the answers are not correct'
    );
  });
  this.on('loadAnswer', function(question, answer) {
    assert.deepEqual(
      answer,
      answers,
      'Answer loaded, but the answers are not correct'
    );
  });
  this.set('question', question);
  this.set('userAnswer', [{ value: '2' }]);

  this.render(hbs`{{player/questions/qz-true-false question=question
                    userAnswer=userAnswer
                    onAnswerChanged='changeAnswer'
                    onAnswerLoaded='loadAnswer'}}`);

  var $component = this.$(); //component dom element
  assert.equal(
    $component.find('.answer-choices .radio').length,
    2,
    'Missing answer choices'
  );
  assert.ok(
    $component.find('.answer-choices .radio:eq(1) input:checked').length,
    'Answer choice 2 should be selected'
  );
});

test('True or false question layout - False as correct answer', function(assert) {
  assert.expect(2);

  const question = ResourceModel.create({
    //true false
    id: '569906aa3ec3bb39969acbe6',
    type: QUESTION_TYPES.trueFalse,
    body: 'True False Question',
    correctAnswer: Ember.A([AnswerModel.create({ value: '1', text: 'True' })]),
    answers: Ember.A([
      AnswerModel.create({ value: '1', text: 'True' }),
      AnswerModel.create({ value: '2', text: 'False' })
    ]),
    sequence: 2
  });

  this.set('question', question);

  this.render(hbs`{{player/questions/qz-true-false question=question}}`);

  var $component = this.$(); //component dom element
  assert.equal(
    $component.find('.answer-choices .radio:eq(0) input[type=radio]').val(),
    '1',
    'Incorrect value for true value'
  );
  assert.equal(
    $component.find('.answer-choices .radio:eq(1) input[type=radio]').val(),
    '2',
    'Incorrect value for false value'
  );
});
