import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import Ember from 'ember';
import AnswerModel from 'quizzes-addon/models/resource/answer';
import ResourceModel from 'quizzes-addon/models/resource/resource';
import QuestionResult from 'quizzes-addon/models/result/question';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleForComponent(
  'reports/assessment/questions/qz-hot-text-highlight',
  'Integration | Component | reports/assessment/questions/qz-hot-text-highlight',
  {
    integration: true
  }
);

test('Hot Text Highlight User Answer', function(assert) {
  const questionResult = QuestionResult.create({
    resource: ResourceModel.create({
      id: '569906aa20b7dfae1bcd5',
      type: QUESTION_TYPES.hotTextHighlightSentence,
      body: 'Sentence 1. Sentence 2. Sentence 3. Sentence 4.  Sentence 5',
      correctAnswer: Ember.A([
        AnswerModel.create({ value: 'Sentence 2.,12' }),
        AnswerModel.create({ value: 'Sentence 3.,24' })
      ])
    })
  });

  var userAnswer = [
    { value: 'Sentence 2.,12' },
    { value: 'Sentence 3.,24' },
    { value: 'Sentence 4.,36' }
  ];
  this.set('question', questionResult);
  this.set('userAnswer', userAnswer);

  this.render(
    hbs`{{reports/assessment/questions/qz-hot-text-highlight question=question userAnswer=userAnswer}}`
  );
  const $component = this.$(); //component dom element
  const $ht_hl = $component.find(
    '.reports.assessment.questions.qz-hot-text-highlight'
  );

  T.exists(assert, $ht_hl, 'Missing  component');
  const $correctAnswers = $ht_hl.find('span.correct');
  assert.equal(
    $correctAnswers.length,
    2,
    'There are no correct answers, there should be 2'
  );

  const $incorrectAnswers = $ht_hl.find('span.incorrect');
  assert.equal(
    $incorrectAnswers.length,
    1,
    'There are no incorrect answers, there should be 1'
  );
});

test('Hot Text Highlight Correct Answer', function(assert) {
  const questionResult = QuestionResult.create({
    resource: ResourceModel.create({
      id: '569906aa20b7dfae1bcd5',
      type: QUESTION_TYPES.hotTextHighlightSentence,
      body: 'Sentence 1. Sentence 2. Sentence 3. Sentence 4.  Sentence 5',
      correctAnswer: Ember.A([
        AnswerModel.create({ value: 'Sentence 2.,12' }),
        AnswerModel.create({ value: 'Sentence 3.,24' })
      ])
    })
  });

  var userAnswer = [{ value: 'Sentence 2.,12' }, { value: 'Sentence 3.,24' }];
  this.set('question', questionResult);
  this.set('userAnswer', userAnswer);

  this.render(
    hbs`{{reports/assessment/questions/qz-hot-text-highlight question=question showCorrect=true}}`
  );
  const $component = this.$(); //component dom element
  const $ht_hl = $component.find(
    '.reports.assessment.questions.qz-hot-text-highlight'
  );

  T.exists(assert, $ht_hl, 'Missing  component');
  const $correctAnswers = $ht_hl.find('span.correct');
  assert.equal(
    $correctAnswers.length,
    2,
    'There are no correct answers, there should be 3'
  );

  const $incorrectAnswers = $ht_hl.find('span.incorrect');
  assert.equal(
    $incorrectAnswers.length,
    0,
    'There are incorrect answers, there should be 0'
  );
});

test('Hot Text Highlight Anonymous', function(assert) {
  const questionResult = QuestionResult.create({
    resource: ResourceModel.create({
      id: '569906aa20b7dfae1bcd5',
      type: QUESTION_TYPES.hotTextHighlightSentence,
      body: 'Sentence 1. Sentence 2. Sentence 3. Sentence 4.  Sentence 5',
      correctAnswer: Ember.A([
        AnswerModel.create({ value: 'Sentence 2.,12' }),
        AnswerModel.create({ value: 'Sentence 3.,24' })
      ])
    })
  });

  var userAnswer = [{ value: 'Sentence 2.,12' }, { value: 'Sentence 3.,24' }];
  this.set('question', questionResult);
  this.set('userAnswer', userAnswer);

  this.render(
    hbs`{{reports/assessment/questions/qz-hot-text-highlight question=question showCorrect=true anonymous=true}}`
  );
  const $component = this.$(); //component dom element
  const $ht_hl = $component.find(
    '.reports.assessment.questions.qz-hot-text-highlight'
  );
  const $correctAnswers = $ht_hl.find('span.anonymous');
  assert.equal(
    $correctAnswers.length,
    2,
    'There are no correct answers, there should be 3'
  );
});
