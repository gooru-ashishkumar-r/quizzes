import { moduleForComponent, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import Ember from 'ember';
import Answer from 'quizzes-addon/models/resource/answer';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleForComponent(
  'reports/assessment/questions/qz-reorder',
  'Integration | Component | reports/assessment/questions/qz reorder',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
      this.inject.service('i18n');
    }
  }
);

skip('Reoder Question - Show Correct Answer', function(assert) {
  var question = Ember.Object.create({
    type: QUESTION_TYPES.hotTextReorder,
    question: {
      answers: Ember.A([
        Answer.create({ value: 'crc', text: 'Costa Rica' }),
        Answer.create({ value: 'bra', text: 'Brasil' }),
        Answer.create({ value: 'pan', text: 'Panamá' }),
        Answer.create({ value: 'chi', text: 'Chile' })
      ]),
      correctAnswer: Ember.A([
        Answer.create({ value: 'crc', text: 'Costa Rica' }),
        Answer.create({ value: 'bra', text: 'Brasil' }),
        Answer.create({ value: 'pan', text: 'Panamá' }),
        Answer.create({ value: 'chi', text: 'Chile' })
      ])
    }
  });
  var showCorrect = true;
  this.set('question', question);
  this.set('showCorrect', showCorrect);
  this.set('userAnswers', question.question.correctAnswer);

  this.render(
    hbs`{{reports/assessment/questions/qz-reorder question=question showCorrect=showCorrect}}`
  );

  const $component = this.$(); //component dom element
  T.exists(
    assert,
    $component.find('li:nth-child(1) span.correct'),
    'Answer 1 should be correct'
  );
  assert.equal(
    T.text($component.find('li:nth-child(1) span.correct')),
    '1',
    'Wrong order text for answer 1'
  );
  assert.equal(
    T.text($component.find('li:nth-child(1) span.answer-text')),
    'Costa Rica',
    'Wrong text for answer 1'
  );

  T.exists(
    assert,
    $component.find('li:nth-child(2) span.correct'),
    'Answer 2 should be correct'
  );
  assert.equal(
    T.text($component.find('li:nth-child(2) span.correct')),
    '2',
    'Wrong order text for answer 2'
  );
  assert.equal(
    T.text($component.find('li:nth-child(2) span.answer-text')),
    'Brasil',
    'Wrong text for answer 2'
  );

  T.exists(
    assert,
    $component.find('li:nth-child(3) span.correct'),
    'Answer 3 should be correct'
  );
  assert.equal(
    T.text($component.find('li:nth-child(3) span.correct')),
    '3',
    'Wrong order text for answer 3'
  );
  assert.equal(
    T.text($component.find('li:nth-child(3) span.answer-text')),
    'Panamá',
    'Wrong text for answer 3'
  );

  T.exists(
    assert,
    $component.find('li:nth-child(4) span.correct'),
    'Answer 4 should be correct'
  );
  assert.equal(
    T.text($component.find('li:nth-child(4) span.correct')),
    '4',
    'Wrong order text for answer 4'
  );
  assert.equal(
    T.text($component.find('li:nth-child(4) span.answer-text')),
    'Chile',
    'Wrong text for answer 4'
  );
});

skip('Reoder Question - User answer correct', function(assert) {
  var question = Ember.Object.create({
    type: QUESTION_TYPES.hotTextReorder,
    question: {
      answers: Ember.A([
        Answer.create({ value: 'crc', text: 'Costa Rica' }),
        Answer.create({ value: 'bra', text: 'Brasil' }),
        Answer.create({ value: 'pan', text: 'Panamá' }),
        Answer.create({ value: 'chi', text: 'Chile' })
      ]),
      correctAnswer: Ember.A([
        Answer.create({ value: 'crc', text: 'Costa Rica' }),
        Answer.create({ value: 'bra', text: 'Brasil' }),
        Answer.create({ value: 'pan', text: 'Panamá' }),
        Answer.create({ value: 'chi', text: 'Chile' })
      ])
    }
  });
  var showCorrect = true;
  this.set('question', question);
  this.set('showCorrect', showCorrect);
  this.set('userAnswer', [
    { value: 'crc' },
    { value: 'bra' },
    { value: 'pan' },
    { value: 'chi' }
  ]);

  this.render(
    hbs`{{reports/assessment/questions/qz-reorder question=question userAnswer=userAnswer}}`
  );

  const $component = this.$(); //component dom element
  T.exists(
    assert,
    $component.find('li:nth-child(1) span.correct'),
    'Answer 1 should be correct'
  );
  assert.equal(
    T.text($component.find('li:nth-child(1) span.correct')),
    '1',
    'Wrong order text for answer 1'
  );
  assert.equal(
    T.text($component.find('li:nth-child(1) span.answer-text')),
    'Costa Rica',
    'Wrong text for answer 1'
  );

  T.exists(
    assert,
    $component.find('li:nth-child(2) span.correct'),
    'Answer 2 should be correct'
  );
  assert.equal(
    T.text($component.find('li:nth-child(2) span.correct')),
    '2',
    'Wrong order text for answer 2'
  );
  assert.equal(
    T.text($component.find('li:nth-child(2) span.answer-text')),
    'Brasil',
    'Wrong text for answer 2'
  );

  T.exists(
    assert,
    $component.find('li:nth-child(3) span.correct'),
    'Answer 3 should be correct'
  );
  assert.equal(
    T.text($component.find('li:nth-child(3) span.correct')),
    '3',
    'Wrong order text for answer 3'
  );
  assert.equal(
    T.text($component.find('li:nth-child(3) span.answer-text')),
    'Panamá',
    'Wrong text for answer 3'
  );

  T.exists(
    assert,
    $component.find('li:nth-child(4) span.correct'),
    'Answer 4 should be correct'
  );
  assert.equal(
    T.text($component.find('li:nth-child(4) span.correct')),
    '4',
    'Wrong order text for answer 4'
  );
  assert.equal(
    T.text($component.find('li:nth-child(4) span.answer-text')),
    'Chile',
    'Wrong text for answer 4'
  );
});

skip('Reoder Question - User answer all incorrect', function(assert) {
  var question = Ember.Object.create({
    type: QUESTION_TYPES.hotTextReorder,
    question: {
      answers: Ember.A([
        Answer.create({ value: 'crc', text: 'Costa Rica' }),
        Answer.create({ value: 'bra', text: 'Brasil' }),
        Answer.create({ value: 'pan', text: 'Panamá' }),
        Answer.create({ value: 'chi', text: 'Chile' })
      ]),
      correctAnswer: Ember.A([
        Answer.create({ value: 'crc', text: 'Costa Rica' }),
        Answer.create({ value: 'bra', text: 'Brasil' }),
        Answer.create({ value: 'pan', text: 'Panamá' }),
        Answer.create({ value: 'chi', text: 'Chile' })
      ])
    }
  });
  var showCorrect = true;
  this.set('question', question);
  this.set('showCorrect', showCorrect);
  this.set('userAnswer', [
    { value: 'pan' },
    { value: 'chi' },
    { value: 'bra' },
    { value: 'crc' }
  ]);

  this.render(
    hbs`{{reports/assessment/questions/qz-reorder question=question userAnswer=userAnswer}}`
  );

  const $component = this.$(); //component dom element
  T.exists(
    assert,
    $component.find('li:nth-child(1) span.incorrect'),
    'Answer 1 should be incorrect'
  );
  assert.equal(
    T.text($component.find('li:nth-child(1) span.incorrect')),
    '4',
    'Wrong order text for answer 1'
  );
  assert.equal(
    T.text($component.find('li:nth-child(1) span.answer-text')),
    'Costa Rica',
    'Wrong text for answer 1'
  );

  T.exists(
    assert,
    $component.find('li:nth-child(2) span.incorrect'),
    'Answer 2 should be incorrect'
  );
  assert.equal(
    T.text($component.find('li:nth-child(2) span.incorrect')),
    '3',
    'Wrong order text for answer 2'
  );
  assert.equal(
    T.text($component.find('li:nth-child(2) span.answer-text')),
    'Brasil',
    'Wrong text for answer 2'
  );

  T.exists(
    assert,
    $component.find('li:nth-child(3) span.incorrect'),
    'Answer 3 should be incorrect'
  );
  assert.equal(
    T.text($component.find('li:nth-child(3) span.incorrect')),
    '1',
    'Wrong order text for answer 3'
  );
  assert.equal(
    T.text($component.find('li:nth-child(3) span.answer-text')),
    'Panamá',
    'Wrong text for answer 3'
  );

  T.exists(
    assert,
    $component.find('li:nth-child(4) span.incorrect'),
    'Answer 4 should be incorrect'
  );
  assert.equal(
    T.text($component.find('li:nth-child(4) span.incorrect')),
    '2',
    'Wrong order text for answer 4'
  );
  assert.equal(
    T.text($component.find('li:nth-child(4) span.answer-text')),
    'Chile',
    'Wrong text for answer 4'
  );
});

skip('Reorder Question - User answer some incorrect', function(assert) {
  var question = Ember.Object.create({
    type: QUESTION_TYPES.hotTextReorder,
    question: {
      answers: Ember.A([
        Answer.create({ value: 'crc', text: 'Costa Rica' }),
        Answer.create({ value: 'bra', text: 'Brasil' }),
        Answer.create({ value: 'pan', text: 'Panamá' }),
        Answer.create({ value: 'chi', text: 'Chile' })
      ]),
      correctAnswer: Ember.A([
        Answer.create({ value: 'crc', text: 'Costa Rica' }),
        Answer.create({ value: 'bra', text: 'Brasil' }),
        Answer.create({ value: 'pan', text: 'Panamá' }),
        Answer.create({ value: 'chi', text: 'Chile' })
      ])
    }
  });

  var showCorrect = true;
  this.set('question', question);
  this.set('showCorrect', showCorrect);
  this.set('userAnswer', [
    { value: 'crc' },
    { value: 'pan' },
    { value: 'bra' },
    { value: 'chi' }
  ]);

  this.render(
    hbs`{{reports/assessment/questions/qz-reorder question=question userAnswer=userAnswer}}`
  );

  const $component = this.$(); //component dom element
  T.exists(
    assert,
    $component.find('li:nth-child(1) span.correct'),
    'Answer 1 should be correct'
  );
  assert.equal(
    T.text($component.find('li:nth-child(1) span.correct')),
    '1',
    'Wrong order text for answer 1'
  );
  assert.equal(
    T.text($component.find('li:nth-child(1) span.answer-text')),
    'Costa Rica',
    'Wrong text for answer 1'
  );

  T.exists(
    assert,
    $component.find('li:nth-child(2) span.incorrect'),
    'Answer 2 should be incorrect'
  );
  assert.equal(
    T.text($component.find('li:nth-child(2) span.incorrect')),
    '3',
    'Wrong order text for answer 2'
  );
  assert.equal(
    T.text($component.find('li:nth-child(2) span.answer-text')),
    'Brasil',
    'Wrong text for answer 2'
  );

  T.exists(
    assert,
    $component.find('li:nth-child(3) span.incorrect'),
    'Answer 3 should be incorrect'
  );
  assert.equal(
    T.text($component.find('li:nth-child(3) span.incorrect')),
    '2',
    'Wrong order text for answer 3'
  );
  assert.equal(
    T.text($component.find('li:nth-child(3) span.answer-text')),
    'Panamá',
    'Wrong text for answer 3'
  );

  T.exists(
    assert,
    $component.find('li:nth-child(4) span.correct'),
    'Answer 4 should be correct'
  );
  assert.equal(
    T.text($component.find('li:nth-child(4) span.correct')),
    '4',
    'Wrong order text for answer 4'
  );
  assert.equal(
    T.text($component.find('li:nth-child(4) span.answer-text')),
    'Chile',
    'Wrong text for answer 4'
  );
});
