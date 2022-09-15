import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import AnswerModel from 'quizzes-addon/models/resource/answer';
import ResourceModel from 'quizzes-addon/models/resource/resource';
import QuestionResult from 'quizzes-addon/models/result/question';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleForComponent(
  'reports/assessment/questions/qz-open-ended',
  'Integration | Component | reports/assessment/questions/qz-open-ended',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('Open ended Layout showing correct answer', function(assert) {
  assert.expect(2);

  const showCorrect = true;
  const questionResult = QuestionResult.create({
    resource: ResourceModel.create({
      id: '569906aa20b7dfae1bcd5',
      type: QUESTION_TYPES.openEnded,
      body: 'Sample Question MA',
      correctAnswer: Ember.A([AnswerModel.create({ value: 'Correct answer' })])
    })
  });
  this.set('question', questionResult);
  this.set('showCorrect', showCorrect);

  this.render(
    hbs`{{reports/assessment/questions/qz-open-ended showCorrect=showCorrect question=question}}`
  );

  const $component = this.$(); //component dom element
  const $answer = $component.find('.answer');

  T.exists(assert, $answer, 'Missing answer');
  assert.equal(T.text($answer), 'Correct answer', 'Wrong correct answer');
});

test('Open ended Layout showing user answer', function(assert) {
  assert.expect(2);
  const questionResult = QuestionResult.create({
    resource: ResourceModel.create({
      id: '569906aa20b7dfae1bcd5',
      type: QUESTION_TYPES.openEnded,
      body: 'Sample Question MA',
      correctAnswer: Ember.A([AnswerModel.create({ value: 'Correct answer' })])
    })
  });
  this.set('question', questionResult);
  this.set('answer', [{ value: 'My Answer' }]);

  this.render(
    hbs`{{reports/assessment/questions/qz-open-ended question=question userAnswer=answer}}`
  );

  const $component = this.$(); //component dom element
  const $answer = $component.find('.answer');

  T.exists(assert, $answer, 'Missing answer');
  assert.equal(T.text($answer), 'My Answer', 'Wrong answer text');
});

test('Open ended Layout when no answer provided', function(assert) {
  assert.expect(2);

  const questionResult = QuestionResult.create({
    resource: ResourceModel.create({
      id: '569906aa20b7dfae1bcd5',
      type: QUESTION_TYPES.openEnded,
      body: 'Sample Question MA',
      correctAnswer: Ember.A([AnswerModel.create({ value: 'Correct answer' })])
    })
  });

  this.set('question', questionResult);
  this.render(
    hbs`{{reports/assessment/questions/qz-open-ended question=question userAnswer=answer}}`
  );

  const $component = this.$(); //component dom element
  const $answer = $component.find('.answer');

  T.exists(assert, $answer, 'Missing answer');
  assert.equal(T.text($answer), '', 'Wrong answer text');
});

test('Open ended Layout showing user answer support math expression', function(
  assert
) {
  const questionResult = QuestionResult.create({
    resource: ResourceModel.create({
      id: '569906aa20b7dfae1bcd5',
      type: QUESTION_TYPES.openEnded,
      body: 'Sample Question MA',
      correctAnswer: Ember.A([AnswerModel.create({ value: 'Correct answer' })])
    })
  });
  this.set('question', questionResult);
  this.set('answer', [{ value: 'My Answer' }]);

  this.render(
    hbs`{{reports/assessment/questions/qz-open-ended question=question userAnswer=answer}}`
  );

  const $component = this.$();
  const $mathExpression = $component.find('.gru-math-text');

  T.exists(assert, $mathExpression, 'Missing support to math expression');
});
