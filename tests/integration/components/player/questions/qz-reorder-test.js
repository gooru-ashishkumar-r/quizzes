import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import AnswerModel from 'quizzes-addon/utils/question/answer-object';
import ResourceModel from 'quizzes-addon/models/resource/resource';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleForComponent(
  'player/questions/qz-reorder',
  'Integration | Component | player/questions/qz reorder',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
      this.inject.service('i18n');
    }
  }
);

test('Reorder question layout', function(assert) {
  const question = ResourceModel.create({
    id: '569906aadfa0072204f7c7c7',
    type: QUESTION_TYPES.hotTextReorder,
    body: 'Reorder Question',
    hints: [],
    explanation: 'Sample explanation text',
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

  this.render(hbs`{{player/questions/qz-reorder question=question}}`);

  var $component = this.$();

  assert.ok($component.find('.instructions'), 'Missing instructions');
  T.exists(
    assert,
    $component.find('.sortable.show'),
    'The options should be shuffled'
  );
  assert.equal(
    $component.find('.sortable li').length,
    3,
    'Incorrect number of answer choices'
  );
  assert.ok(
    $component.find('.sortable li:first-child').hasClass('ui-sortable-handle'),
    'Class added by sortable plugin is missing'
  );
});

test('Notifications work after reordering questions', function(assert) {
  const question = ResourceModel.create({
    id: '569906aadfa0072204f7c7c7',
    type: QUESTION_TYPES.hotTextReorder,
    body: 'Reorder Question',
    hints: [],
    explanation: 'Sample explanation text',
    answers: Ember.A([
      AnswerModel.create({
        value: 1,
        text: 'An aquifer'
      }),
      AnswerModel.create({
        value: 2,
        text: 'A well'
      }),
      AnswerModel.create({
        value: 3,
        text: 'A pump'
      })
    ]),
    sequence: 1
  });

  var answers = Ember.A([
    {
      value: 2
    },
    {
      value: 1
    },
    {
      value: 3
    }
  ]);

  this.set('question', question);

  this.on('changeAnswer', function(question, answer) {
    //called 3 times
    assert.deepEqual(
      answer,
      answers,
      'Answer changed, but the answers are not in the correct order'
    );
  });

  this.on('completeAnswer', function(question, answer) {
    //called 2 times
    assert.deepEqual(
      answer,
      answers,
      'Answer completed, but the answers are not in the correct order'
    );
  });

  this.on('loadAnswer', function(question, answer) {
    assert.deepEqual(
      answer,
      answers,
      'Answer loaded, but the answers are not in the correct order'
    );
  });

  this.set('userAnswer', answers);

  this.render(hbs`{{player/questions/qz-reorder question=question
                    onAnswerChanged='changeAnswer'
                    onAnswerCompleted='completeAnswer'
                    onAnswerLoaded='loadAnswer'
                    userAnswer=userAnswer}}`);

  var $component = this.$(); //component dom element

  assert.equal(
    $component.find('.sortable li:first-child').data('id'),
    2,
    'First answer choice, value is incorrect'
  );
  assert.equal(
    $component.find('.sortable li:last-child').data('id'),
    3,
    'Last answer choice, value is incorrect'
  );

  // Move first item to be the last
  $component
    .find('.sortable li:first-child')
    .insertAfter('.sortable li:last-child');

  answers = Ember.A([
    {
      value: 1
    },
    {
      value: 3
    },
    {
      value: 2
    }
  ]);
  $component.find('.sortable').trigger('sortupdate');

  // Move current first item to be the second one
  $component
    .find('.sortable li:first-child')
    .insertBefore('.sortable li:last-child');
  answers = Ember.A([
    {
      value: 3
    },
    {
      value: 1
    },
    {
      value: 2
    }
  ]);
  $component.find('.sortable').trigger('sortupdate');
});

test('Reorder question layout - read only', function(assert) {
  const question = ResourceModel.create({
    id: '569906aadfa0072204f7c7c7',
    type: QUESTION_TYPES.hotTextReorder,
    body: 'Reorder Question',
    hints: [],
    explanation: 'Sample explanation text',
    answers: Ember.A([
      AnswerModel.create({
        value: 1,
        text: 'An aquifer'
      }),
      AnswerModel.create({
        value: 2,
        text: 'A well'
      }),
      AnswerModel.create({
        value: 3,
        text: 'A pump'
      })
    ]),
    sequence: 1
  });

  this.set('question', question);

  const readOnly = true;
  this.set('readOnly', readOnly);

  this.render(
    hbs`{{player/questions/qz-reorder question=question readOnly=readOnly}}`
  );

  var $component = this.$(); //component dom element
  assert.equal(
    $component.find('.sortable.disabled').length,
    1,
    'Sortable should be disabled'
  );
});

test('Reorder question layout - with user answer', function(assert) {
  assert.expect(5);
  const question = ResourceModel.create({
    id: '569906aadfa0072204f7c7c7',
    type: QUESTION_TYPES.hotTextReorder,
    body: 'Reorder Question',
    hints: [],
    explanation: 'Sample explanation text',
    answers: Ember.A([
      AnswerModel.create({
        value: 1,
        text: 'An aquifer'
      }),
      AnswerModel.create({
        value: 2,
        text: 'A well'
      }),
      AnswerModel.create({
        value: 3,
        text: 'A pump'
      })
    ]),
    sequence: 1
  });

  var answers = Ember.A([
    {
      value: 2
    },
    {
      value: 1
    },
    {
      value: 3
    }
  ]);

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
  this.set('userAnswer', answers);

  this.render(hbs`{{player/questions/qz-reorder question=question
                    userAnswer=userAnswer
                    onAnswerChanged='changeAnswer'
                    onAnswerLoaded='loadAnswer'}}`);

  var $component = this.$(); //component dom element
  assert.equal(
    $component.find('.sortable li').length,
    3,
    '3 Sortable items should be found'
  );
  assert.equal(
    $component.find('.sortable li:first-child').data('id'),
    2,
    'First answer choice, data-id value is incorrect'
  );
  assert.equal(
    $component.find('.sortable li:last-child').data('id'),
    3,
    'Last answer choice, data-id value is incorrect'
  );
});
