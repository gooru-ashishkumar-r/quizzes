import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import AnswerModel from 'quizzes-addon/models/resource/answer';
import ResourceModel from 'quizzes-addon/models/resource/resource';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleForComponent(
  'player/questions/qz-single-choice',
  'Integration | Component | player/questions/qz single choice',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
      this.inject.service('i18n');
    }
  }
);

test('Single choice question layout', function(assert) {
  assert.expect(10);
  const question = ResourceModel.create({
    id: '569906aa20b7dfae1bcd5',
    type: QUESTION_TYPES.singleChoice,
    body: 'Sample Question SC',
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

  let answers = [];

  this.set('question', question);
  this.on('myOnAnswerChanged', function(question, answer) {
    //called 2 times
    assert.deepEqual(
      answer,
      answers,
      'Answer changed, but the answers are not correct'
    );
  });

  this.on('myOnAnswerCompleted', function(question, answer) {
    //called 2 times
    assert.deepEqual(
      answer,
      answers,
      'Answer completed, but the answers are not correct'
    );
  });

  this.render(hbs`{{player/questions/qz-single-choice question=question
        onAnswerChanged='myOnAnswerChanged' onAnswerCompleted='myOnAnswerCompleted'}}`);

  var $component = this.$(); //component dom element
  T.exists(assert, $component.find('.instructions'), 'Missing instructions');
  assert.equal(
    $component.find('.answer-choices .radio').length,
    3,
    'Missing answer choices'
  );
  assert.equal(
    $component.find('.answer-choices .radio input[type=radio]').length,
    3,
    'Missing answer choices radio inputs'
  );
  assert.ok(
    $component
      .find('.answer-choices .radio:eq(0)')
      .html()
      .indexOf('(A)An aquifer'),
    'Incorrect Message'
  );
  assert.ok(
    $component.find('.answer-choices .radio:eq(1)').html().indexOf('(B)A well'),
    'Incorrect Message'
  );
  assert.ok(
    $component.find('.answer-choices .radio:eq(2)').html().indexOf('(C)A pump'),
    'Incorrect Message'
  );

  //select a radio button
  answers = [{ value: '2' }];
  $component.find('.answer-choices .radio input[type=radio]:eq(1)').click();

  answers = [{ value: '1' }];
  $component.find('.answer-choices .radio input[type=radio]:eq(0)').click();
});

test('Single choice question layout - read only', function(assert) {
  assert.expect(2);
  const question = ResourceModel.create({
    id: '569906aa20b7dfae1bcd5',
    type: QUESTION_TYPES.singleChoice,
    body: 'Sample Question SC',
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
    hbs`{{player/questions/qz-single-choice question=question readOnly=true}}`
  );

  var $component = this.$(); //component dom element
  assert.equal(
    $component.find('.answer-choices .radio.disabled').length,
    3,
    'Missing answer choices'
  );
  assert.equal(
    $component.find('.answer-choices .radio input[disabled]').length,
    3,
    'Missing answer choices radio inputs'
  );
});

test('Single choice question with user answer', function(assert) {
  assert.expect(5);
  const question = ResourceModel.create({
    id: '569906aa20b7dfae1bcd5',
    type: QUESTION_TYPES.singleChoice,
    body: 'Sample Question SC',
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
  this.set('userAnswer', [
    {
      value: '2'
    }
  ]);
  this.render(hbs`{{player/questions/qz-single-choice question=question
                    userAnswer=userAnswer
                    onAnswerChanged='changeAnswer'
                    onAnswerLoaded='loadAnswer'}}`);

  var $component = this.$(); //component dom element
  T.exists(assert, $component.find('.instructions'), 'Missing instructions');
  assert.equal(
    $component.find('.answer-choices .radio').length,
    3,
    'Missing answer choices'
  );
  assert.ok(
    $component.find('.answer-choices .radio:eq(1) input:checked').length,
    'Answer choice 2 should be selected'
  );
});
