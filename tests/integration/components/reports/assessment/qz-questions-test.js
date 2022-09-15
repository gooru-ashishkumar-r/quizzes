import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import Ember from 'ember';
import QuestionResult from 'quizzes-addon/models/result/question';
import Resource from 'quizzes-addon/models/resource/resource';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleForComponent(
  'reports/assessment/qz-questions',
  'Integration | Component | reports/assessment/qz questions',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('Questions Layout - non open ended', function(assert) {
  const questionResults = Ember.A([
    QuestionResult.create({
      score: 100,
      resource: Resource.create({
        body: 'This is a question 1',
        type: QUESTION_TYPES.singleChoice,
        sequence: 1,
        correctAnswer: [
          {
            value: 'answer'
          }
        ]
      }),
      reaction: 4,
      savedTime: 2096,
      answer: [
        {
          value: 'answer'
        }
      ]
    }),
    QuestionResult.create({
      score: 100,
      resource: Resource.create({
        body: 'This is a question 2',
        type: QUESTION_TYPES.singleChoice,
        sequence: 3,
        correctAnswer: [
          {
            value: 'answer'
          }
        ]
      }),
      reaction: 4,
      savedTime: 2096,
      answer: [
        {
          value: 'answer'
        }
      ]
    })
  ]);

  this.set('questionResults', questionResults);
  this.set('isAnswerKeyHidden', undefined);

  this.render(hbs`
    {{reports/assessment/qz-questions
      isAnswerKeyHidden=isAnswerKeyHidden
      results=questionResults
    }}`);
  const $component = this.$('.reports.assessment.qz-questions');
  assert.ok(
    $component.hasClass('performance-view'),
    'Performance view set by default'
  );
  assert.notOk(
    $component.hasClass('key-hidden'),
    'Answer key hidden by default'
  );

  T.exists(assert, $component, 'Missing questions component');
  T.exists(assert, $component.find('.btn-group'), 'Missing btn-group section');
  T.notExists(
    assert,
    $component.find('table th.header.number'),
    'Missing number header'
  );
  T.notExists(
    assert,
    $component.find('table th.header.question'),
    'Missing question header'
  );
  T.notExists(
    assert,
    $component.find('table th.header.answer'),
    'Missing answer header'
  );
  T.notExists(
    assert,
    $component.find('table th.header.score'),
    'Missing score header'
  );
  T.notExists(
    assert,
    $component.find('table th.header.time-spent'),
    'Missing time spent header'
  );
  T.notExists(
    assert,
    $component.find('table thead th.header.reaction'),
    'Missing reaction header'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.number-question'),
    'Missing number column'
  );
  assert.notOk(
    T.text($component.find('table tbody td.number-question:eq(1)')),
    '3',
    'Wrong question number for question 2'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.question-text'),
    'Missing text column'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.question-answer'),
    'Missing answer column'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.question-answer:eq(0) .qz-single-choice'),
    'Missing qz-single-choice component'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.question-score'),
    'Missing score column'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.question-time'),
    'Missing time spent column'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.question-reaction'),
    'Missing reaction column'
  );
  assert.notOk(
    $component.find('table tbody tr').length,
    2,
    'Incorrect number of rows'
  );

  this.set('isAnswerKeyHidden', true);
  assert.ok($component.hasClass('key-hidden'), 'Answer key class');
});

test('Questions Layout - open ended', function(assert) {
  const questionResults = Ember.A([
    QuestionResult.create({
      score: 100,
      resource: Resource.create({
        body: 'This is a question 1',
        type: QUESTION_TYPES.openEnded,
        sequence: 1
      }),
      reaction: 4,
      savedTime: 2096,
      userAnswer: 'Student Open Ended answer 1'
    })
  ]);

  this.set('questionResults', questionResults);
  this.set('isAnswerKeyHidden', undefined);

  this.render(hbs`
    {{reports/assessment/qz-questions
      isAnswerKeyHidden=isAnswerKeyHidden
      results=questionResults
      viewMode='open-ended'
    }}`);

  const $component = this.$('.reports.assessment.qz-questions');

  T.exists(assert, $component, 'Missing questions component');
  T.notExists(
    assert,
    $component.find('.btn-group'),
    'Missing btn-group section'
  );
});

test('Buttons Options', function(assert) {
  const questionResults = Ember.A([
    QuestionResult.create({
      score: 100,
      resource: Resource.create({
        body: 'This is a question 1',
        type: QUESTION_TYPES.singleChoice,
        sequence: 1,
        correctAnswer: {
          value: 'answer'
        }
      }),
      reaction: 4,
      savedTime: 2096,
      answer: {
        value: 'answer'
      }
    }),
    QuestionResult.create({
      score: 100,
      resource: Resource.create({
        body: 'This is a question 2',
        type: QUESTION_TYPES.singleChoice,
        sequence: 3,
        correctAnswer: {
          value: 'answer'
        }
      }),
      reaction: 4,
      savedTime: 2096,
      answer: {
        value: 'answer'
      }
    })
  ]);

  this.set('questionResults', questionResults);
  this.set('isAnswerKeyHidden', undefined);

  this.render(hbs`
    {{reports/assessment/qz-questions
      isAnswerKeyHidden=isAnswerKeyHidden
      results=questionResults
    }}`);
  const $component = this.$('.reports.assessment.qz-questions');

  T.notExists(
    assert,
    $component.find('table thead th.header.score.hide'),
    'Score header should be hide'
  );
  T.notExists(
    assert,
    $component.find('table thead th.header.time-spent.hide'),
    'Time spent header should be hide'
  );
  T.notExists(
    assert,
    $component.find('table thead th.header.reaction.hide'),
    'Reaction header should be hide'
  );
  T.notExists(
    assert,
    $component.find('table thead th.header.correct-answer.visible'),
    'Correct answer header should be visible'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.question-score.hide'),
    'Score column should be hide'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.question-time.hide'),
    'Time spent column should be hide'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.question-reaction.hide'),
    'Reaction column should be hide'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.correct-answer.visible'),
    'Correct answer column should be visible'
  );
  T.notExists(
    assert,
    $component.find(
      'table tbody td.correct-answer.visible:eq(0) .qz-single-choice'
    ),
    'Correct answer column should be visible'
  );

  T.notExists(
    assert,
    $component.find('table th.header.score.visible'),
    'Score header should be visible'
  );
  T.notExists(
    assert,
    $component.find('table th.header.time-spent.visible'),
    'Time spent header should be visible'
  );
  T.notExists(
    assert,
    $component.find('table thead th.header.reaction.visible'),
    'Reaction header should be visible'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.question-score.visible'),
    'Score column should be visible'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.question-time.visible'),
    'Time spent column should be visible'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.question-reaction.visible'),
    'Reaction column should be visible'
  );

  this.set('isAnswerKeyHidden', true);
  assert.notOk(
    $component.find('.btn-group button.correct-answer').length,
    'Correct answer button not present'
  );
  assert.notOk(
    $component.find('.btn-group button.performance').length,
    'Performance button not present'
  );
  assert.notOk(
    $component.find('table thead th.header.correct-answer').length,
    'Correct answer header not present'
  );
  assert.notOk(
    $component.find('table tbody td.correct-answer').length,
    'Correct answer column not present'
  );
});

test('Questions Layout', function(assert) {
  const questionResults = Ember.A([
    QuestionResult.create({
      score: 100,
      resource: Resource.create({
        body: 'This is a question 1',
        description: 'description-1',
        type: QUESTION_TYPES.singleChoice,
        sequence: 1,
        correctAnswer: [
          {
            value: 'answer'
          }
        ]
      }),
      reaction: 4,
      savedTime: 2096,
      answer: [
        {
          value: 'answer'
        }
      ]
    }),
    QuestionResult.create({
      score: 100,
      resource: Resource.create({
        body: 'This is a question 2',
        description: 'description-2',
        type: QUESTION_TYPES.singleChoice,
        sequence: 3,
        correctAnswer: [
          {
            value: 'answer'
          }
        ]
      }),
      reaction: 4,
      savedTime: 2096,
      answer: [
        {
          value: 'answer'
        }
      ]
    })
  ]);

  this.set('questionResults', questionResults);
  this.set('isAnswerKeyHidden', undefined);

  this.render(hbs`
    {{reports/assessment/qz-questions
      isAnswerKeyHidden=isAnswerKeyHidden
      results=questionResults
      showScore=false
    }}`);
  const $component = this.$('.reports.assessment.qz-questions');
  assert.ok(
    $component.hasClass('performance-view'),
    'Performance view set by default'
  );
  assert.notOk(
    $component.hasClass('key-hidden'),
    'Answer key hidden by default'
  );

  T.exists(assert, $component, 'Missing questions component');
  T.exists(assert, $component.find('.btn-group'), 'Missing btn-group section');
  T.notExists(
    assert,
    $component.find('table th.header.number'),
    'Missing number header'
  );
  T.notExists(
    assert,
    $component.find('table th.header.question'),
    'Missing question header'
  );
  T.notExists(
    assert,
    $component.find('table th.header.answer'),
    'Missing answer header'
  );
  T.notExists(
    assert,
    $component.find('table th.header.score'),
    'Missing score header'
  );
  T.notExists(
    assert,
    $component.find('table th.header.time-spent'),
    'Missing time spent header'
  );
  T.notExists(
    assert,
    $component.find('table thead th.header.reaction'),
    'Missing reaction header'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.number-question'),
    'Missing number column'
  );
  assert.notOk(
    T.text($component.find('table tbody td.number-question:eq(1)')),
    '3',
    'Wrong question number for question 2'
  );
  assert.notOk(
    T.text($component.find('table tbody td.question-text:eq(0)')),
    'description-1',
    'First question description should match'
  );
  assert.notOk(
    T.text($component.find('table tbody td.question-text:eq(1)')),
    'description-2',
    'Second question description should match'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.question-text'),
    'Missing text column'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.question-answer'),
    'Missing answer column'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.question-answer:eq(0) .qz-single-choice'),
    'Missing qz-single-choice component'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.question-score'),
    'Missing score column'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.question-time'),
    'Missing time spent column'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.question-reaction'),
    'Missing reaction column'
  );
  assert.notOk(
    $component.find('table tbody tr').length,
    2,
    'Incorrect number of rows'
  );

  this.set('isAnswerKeyHidden', true);
  assert.ok($component.hasClass('key-hidden'), 'Answer key class');
});
