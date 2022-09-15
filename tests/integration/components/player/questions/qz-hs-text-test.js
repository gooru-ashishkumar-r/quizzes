import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';
import AnswerModel from 'quizzes-addon/utils/question/answer-object';
import ResourceModel from 'quizzes-addon/models/resource/resource';

moduleForComponent(
  'player/questions/qz-hs-text',
  'Integration | Component | player/questions/qz hs text',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
      this.inject.service('i18n');
    }
  }
);

test('Layout', function(assert) {
  const question = ResourceModel.create({
    id: '569906aadfa0072204f7c7c7',
    type: QUESTION_TYPES.hotSpotText,
    body: 'Hot spot text',
    answers: Ember.A([
      AnswerModel.create({
        value: '1',
        text: 'An aquifer'
      }),
      AnswerModel.create({
        value: '2',
        text: 'A well'
      }),
      AnswerModel.create({
        value: '3',
        text: 'A pump'
      })
    ]),
    sequence: 1
  });

  this.set('question', question);

  this.render(hbs`{{player/questions/qz-hs-text question=question}}`);

  const $component = this.$(); //component dom element
  const $answersContainer = $component.find('.answer-choices');

  assert.ok($component.find('.instructions'), 'Missing instructions');
  assert.equal(
    $answersContainer.find('li.answer').length,
    3,
    'Incorrect number of answer choices'
  );

  assert.equal(
    $answersContainer.find('li.answer:first-child').data('id'),
    '1',
    'First answer choice, data-id value is incorrect'
  );
  assert.equal(
    $answersContainer
      .find('li.answer:first-child span.gru-math-text')
      .text()
      .trim(),
    'An aquifer',
    'First answer choice does not have the right text'
  );
  assert.equal(
    $answersContainer.find('li.answer:last-child').data('id'),
    '3',
    'Last answer choice, data-id value is incorrect'
  );
  assert.equal(
    $answersContainer
      .find('li.answer:last-child span.gru-math-text')
      .text()
      .trim(),
    'A pump',
    'Last answer choice does not have the right text'
  );
});

test('Selecting answers', function(assert) {
  const question = ResourceModel.create({
    id: '569906aadfa0072204f7c7c7',
    type: QUESTION_TYPES.hotSpotText,
    body: 'Hot spot text',
    answers: Ember.A([
      AnswerModel.create({
        value: '1',
        text: 'An aquifer'
      }),
      AnswerModel.create({
        value: '2',
        text: 'A well'
      }),
      AnswerModel.create({
        value: '3',
        text: 'A pump'
      })
    ]),
    sequence: 1
  });

  this.set('question', question);

  this.render(hbs`{{player/questions/qz-hs-text question=question}}`);

  const $answers = this.$('li.answer');
  const $firstAnswer = $answers.eq(0);
  const $secondAnswer = $answers.eq(1);

  assert.equal(
    this.$('li.selected').length,
    0,
    'Initial number of answers selected is incorrect'
  );

  $firstAnswer.click();
  assert.ok(
    $firstAnswer.hasClass('selected'),
    'First answer should have been selected'
  );

  $secondAnswer.click();
  assert.ok(
    $secondAnswer.hasClass('selected'),
    'Second answer should have been selected'
  );
  assert.equal(
    this.$('li.selected').length,
    2,
    'Incorrect number of answers selected'
  );

  $firstAnswer.click();
  assert.ok(
    !$firstAnswer.hasClass('selected'),
    'First answer should have been deselected'
  );
  assert.equal(
    this.$('li.selected').length,
    1,
    'Incorrect number of answers selected'
  );

  $secondAnswer.click();
  assert.ok(
    !$secondAnswer.hasClass('selected'),
    'Second answer should have been deselected'
  );
  assert.equal(
    this.$('li.selected').length,
    0,
    'Incorrect number of answers selected'
  );
});

test('Notifications work after selecting questions', function(assert) {
  var answers = [];
  const question = ResourceModel.create({
    id: '569906aadfa0072204f7c7c7',
    type: QUESTION_TYPES.hotSpotText,
    body: 'Hot spot text',
    answers: Ember.A([
      AnswerModel.create({
        value: '1',
        text: 'An aquifer'
      }),
      AnswerModel.create({
        value: '2',
        text: 'A well'
      }),
      AnswerModel.create({
        value: '3',
        text: 'A pump'
      })
    ]),
    sequence: 1
  });

  this.set('question', question);

  this.on('changeAnswer', function(question, answer) {
    assert.deepEqual(
      answer,
      answers,
      'Answer changed, but the answers are not correct'
    );
  });

  this.on('completeAnswer', function(question, answer) {
    assert.deepEqual(
      answer,
      answers,
      'Answer completed, but the answers are not correct'
    );
  });

  this.on('clearAnswer', function(question, answer) {
    assert.deepEqual(
      answer,
      answers,
      'Answer cleared, but the answers are not correct'
    );
  });

  this.render(hbs`{{player/questions/qz-hs-text question=question
                    onAnswerChanged='changeAnswer'
                    onAnswerCompleted='completeAnswer'
                    onAnswerCleared='clearAnswer' }}`);

  const $answers = this.$('li.answer');

  // Select first answer
  answers = [{ value: 1 }];
  $answers.eq(0).click();

  // Two answers selected
  answers = [{ value: 1 }, { value: 3 }];
  $answers.eq(2).click();

  // Tree answers selected
  answers = [{ value: 1 }, { value: 3 }, { value: 2 }];
  $answers.eq(1).click();

  // Now, test deselecting all answers
  answers = [{ value: 1 }, { value: 3 }];
  $answers.eq(1).click();

  answers = [{ value: 1 }];
  $answers.eq(2).click();

  // Send onAnswerCleared notification
  answers = [];
  $answers.eq(0).click();
});

test('Layout - read only', function(assert) {
  const question = ResourceModel.create({
    id: '569906aadfa0072204f7c7c7',
    type: QUESTION_TYPES.hotSpotText,
    body: 'Hot spot text',
    answers: Ember.A([
      AnswerModel.create({
        value: '1',
        text: 'An aquifer'
      }),
      AnswerModel.create({
        value: '2',
        text: 'A well'
      }),
      AnswerModel.create({
        value: '3',
        text: 'A pump'
      })
    ]),
    sequence: 1
  });

  this.set('question', question);

  this.render(
    hbs`{{player/questions/qz-hs-text question=question readOnly=true}}`
  );

  const $component = this.$(); //component dom element
  const $answersContainer = $component.find('.answer-choices');

  assert.ok($component.find('.instructions'), 'Missing instructions');
  assert.equal(
    $answersContainer.find('li.answer.disabled').length,
    3,
    'Incorrect number of answer choices'
  );
});

test('Layout - with user answer', function(assert) {
  assert.expect(5);
  const question = ResourceModel.create({
    id: '569906aadfa0072204f7c7c7',
    type: QUESTION_TYPES.hotSpotText,
    body: 'Hot spot text',
    answers: Ember.A([
      AnswerModel.create({
        value: '1',
        text: 'An aquifer'
      }),
      AnswerModel.create({
        value: '2',
        text: 'A well'
      }),
      AnswerModel.create({
        value: '3',
        text: 'A pump'
      })
    ]),
    sequence: 1
  });

  const answers = [{ value: 1 }, { value: 3 }];
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
  this.set('userAnswer', [{ value: 1 }, { value: 3 }]);

  this.render(hbs`{{player/questions/qz-hs-text question=question
                    userAnswer=userAnswer
                    onAnswerChanged='changeAnswer'
                    onAnswerLoaded='loadAnswer'}}`);

  const $component = this.$(); //component dom element
  const $answersContainer = $component.find('.answer-choices');

  assert.ok($component.find('.instructions'), 'Missing instructions');
  assert.equal(
    $answersContainer.find('li.answer').length,
    3,
    'Incorrect number of answer choices'
  );
  assert.equal(
    $answersContainer.find('li.answer.selected').length,
    2,
    '2 should be selected'
  );
});
