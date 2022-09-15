import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import Ember from 'ember';
import AnswerModel from 'quizzes-addon/models/resource/answer';
import ResourceModel from 'quizzes-addon/models/resource/resource';
import QuestionResult from 'quizzes-addon/models/result/question';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleForComponent(
  '/reports/assessment/questions/qz-multiple-answer',
  'Integration | Component | /reports/assessment/questions/qz multiple answer',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
      this.inject.service('i18n');
    }
  }
);

test('Multiple Answer Correct Answer', function(assert) {
  const questionResult = QuestionResult.create({
    resource: ResourceModel.create({
      id: '569906aa20b7dfae1bcd5',
      type: QUESTION_TYPES.multipleAnswer,
      body: 'Sample Question MA',
      correctAnswer: Ember.A([
        AnswerModel.create({ value: '2', text: 'Answer 2' }),
        AnswerModel.create({ value: '3', text: 'Answer 3' })
      ]),
      answers: Ember.A([
        AnswerModel.create({ value: '1', text: 'Answer 1' }),
        AnswerModel.create({ value: '2', text: 'Answer 2' }),
        AnswerModel.create({ value: '3', text: 'Answer 3' })
      ])
    })
  });
  const showCorrect = true;
  this.set('question', questionResult);
  this.set('showCorrect', showCorrect);
  this.render(
    hbs`{{reports/assessment/questions/qz-multiple-answer question=question showCorrect=showCorrect}}`
  );
  const $component = this.$(); //component dom element
  const $multipleAnswer = $component.find(
    '.reports.assessment.questions.qz-multiple-answer'
  );

  T.exists(
    assert,
    $multipleAnswer.find(
      'li:eq(1) span.no-selected.correct i.radio_button_checked'
    ),
    'The first answer should be checked as no-selected and is correct'
  );
  T.exists(
    assert,
    $multipleAnswer.find(
      'li:eq(2) span.selected.correct i.radio_button_checked'
    ),
    'The second answer should be checked as selected and is correct'
  );
  T.exists(
    assert,
    $multipleAnswer.find(
      'li:eq(3) span.selected.correct i.radio_button_checked'
    ),
    'The third answer should be checked as selected and is correct'
  );
  T.notExists(
    assert,
    $multipleAnswer.find('li span.incorrect i.radio_button_checked'),
    'Should not be incorrect answers at all'
  );
});

test('Multiple Answer Your Answer Incorrect', function(assert) {
  const userAnswer = Ember.A([{ value: '3' }]);
  const questionResult = QuestionResult.create({
    resource: ResourceModel.create({
      id: '569906aa20b7dfae1bcd5',
      type: QUESTION_TYPES.multipleAnswer,
      body: 'Sample Question MA',
      correctAnswer: Ember.A([
        AnswerModel.create({ value: '2', text: 'Answer 2' }),
        AnswerModel.create({ value: '3', text: 'Answer 3' })
      ]),
      answers: Ember.A([
        AnswerModel.create({ value: '1', text: 'Answer 1' }),
        AnswerModel.create({ value: '2', text: 'Answer 2' }),
        AnswerModel.create({ value: '3', text: 'Answer 3' })
      ])
    })
  });
  this.set('userAnswer', userAnswer);
  this.set('question', questionResult);

  this.render(
    hbs`{{reports/assessment/questions/qz-multiple-answer question=question userAnswer=userAnswer}}`
  );
  const $component = this.$(); //component dom element
  const $multipleAnswer = $component.find(
    '.reports.assessment.questions.qz-multiple-answer'
  );

  T.exists(
    assert,
    $multipleAnswer.find(
      'li:eq(1) span.no-selected.correct i.radio_button_checked'
    ),
    'The first answer should be checked as no-selected and is correct'
  );
  T.exists(
    assert,
    $multipleAnswer.find('li:eq(2) span.no-selected.incorrect'),
    'The second answer should be checked as no-selected and is incorrect'
  );
  T.exists(
    assert,
    $multipleAnswer.find('li:eq(3) span.selected.correct'),
    'The third answer should be checked as selected and is correct'
  );
});

test('Multiple Answer Your Answer Correct', function(assert) {
  const userAnswer = Ember.A([{ value: '2' }, { value: '3' }]);
  const questionResult = QuestionResult.create({
    resource: ResourceModel.create({
      id: '569906aa20b7dfae1bcd5',
      type: QUESTION_TYPES.multipleAnswer,
      body: 'Sample Question MA',
      correctAnswer: Ember.A([
        AnswerModel.create({ value: '2', text: 'Answer 2' }),
        AnswerModel.create({ value: '3', text: 'Answer 3' })
      ]),
      answers: Ember.A([
        AnswerModel.create({ value: '1', text: 'Answer 1' }),
        AnswerModel.create({ value: '2', text: 'Answer 2' }),
        AnswerModel.create({ value: '3', text: 'Answer 3' })
      ])
    })
  });
  this.set('userAnswer', userAnswer);
  this.set('question', questionResult);

  this.render(
    hbs`{{reports/assessment/questions/qz-multiple-answer question=question userAnswer=userAnswer}}`
  );
  const $component = this.$(); //component dom element
  const $multipleAnswer = $component.find(
    '.reports.assessment.questions.qz-multiple-answer'
  );

  T.exists(
    assert,
    $multipleAnswer.find('li:eq(1) span.no-selected.correct'),
    'The first answer should be checked as no-selected and is correct'
  );
  T.exists(
    assert,
    $multipleAnswer.find('li:eq(2) span.selected.correct'),
    'The second answer should be checked as selected and is correct'
  );
  T.exists(
    assert,
    $multipleAnswer.find('li:eq(3) span.selected.correct'),
    'The third answer should be checked as selected and is correct'
  );
  T.notExists(
    assert,
    $multipleAnswer.find('li span.incorrect'),
    'Should not be incorrect answers at all'
  );
});

test('Multiple Answer anonymous', function(assert) {
  const userAnswer = Ember.A([{ value: '2' }, { value: '3' }]);
  const questionResult = QuestionResult.create({
    resource: ResourceModel.create({
      id: '569906aa20b7dfae1bcd5',
      type: QUESTION_TYPES.multipleAnswer,
      body: 'Sample Question MA',
      correctAnswer: Ember.A([
        AnswerModel.create({ value: '2', text: 'Answer 2' }),
        AnswerModel.create({ value: '3', text: 'Answer 3' })
      ]),
      answers: Ember.A([
        AnswerModel.create({ value: '1', text: 'Answer 1' }),
        AnswerModel.create({ value: '2', text: 'Answer 2' }),
        AnswerModel.create({ value: '3', text: 'Answer 3' })
      ])
    })
  });
  this.set('userAnswer', userAnswer);
  this.set('question', questionResult);

  this.render(
    hbs`{{reports/assessment/questions/qz-multiple-answer question=question userAnswer=userAnswer anonymous=true}}`
  );
  const $component = this.$(); //component dom element
  const $multipleAnswer = $component.find(
    '.reports.assessment.questions.qz-multiple-answer'
  );

  T.exists(
    assert,
    $multipleAnswer.find('li:eq(1) span.anonymous'),
    'The first answer should be anonymous'
  );
  T.exists(
    assert,
    $multipleAnswer.find('li:eq(2) span.anonymous'),
    'The second answer should be anonymous'
  );
  T.exists(
    assert,
    $multipleAnswer.find('li:eq(3) span.anonymous'),
    'The third answer should be anonymous'
  );
});
