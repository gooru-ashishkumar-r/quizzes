import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import AnswerModel from 'quizzes-addon/models/resource/answer';
import ResourceModel from 'quizzes-addon/models/resource/resource';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleForComponent(
  'player/questions/qz-multiple-answer',
  'Integration | Component | player/questions/qz multiple answer',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
      this.inject.service('i18n');
    }
  }
);

test('Multiple answer question layout', function(assert) {
  assert.expect(6);
  const question = ResourceModel.create({
    id: '569906aa20b7dfae1bcd5',
    type: QUESTION_TYPES.multipleAnswer,
    body: 'Sample Question SC',
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
    ])
  });

  this.set('question', question);
  this.render(hbs`{{player/questions/qz-multiple-answer question=question}}`);
  const $component = this.$(); //component dom element
  T.exists(assert, $component.find('.instructions'), 'Missing instructions');
  assert.equal(
    $component.find('.answer-choices tbody tr').length,
    3,
    'Missing answer choices'
  );
  assert.equal(
    $component.find('.answer-choices tr input[type=radio]').length,
    6,
    'Missing answer choices radio inputs'
  );
  assert.ok(
    $component
      .find('.answer-choices tbody tr:eq(0) td:eq(2)')
      .html()
      .indexOf('(A)An aquifer'),
    'Incorrect Message'
  );
  assert.ok(
    $component
      .find('.answer-choices tbody tr:eq(1) td:eq(2)')
      .html()
      .indexOf('(B)A well'),
    'Incorrect Message'
  );
  assert.ok(
    $component
      .find('.answer-choices tbody tr:eq(2) td:eq(2)')
      .html()
      .indexOf('(C)A pump'),
    'Incorrect Message'
  );
});

test('Multiple answer question events', function(assert) {
  assert.expect(6);

  const question = ResourceModel.create({
    id: '569906aa20b7dfae1bcd5',
    type: QUESTION_TYPES.multipleAnswer,
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
    ])
  });

  let answers = [];
  this.set('question', question);
  this.on('myOnAnswerChanged', function(question, answer) {
    //called 4 times
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

  this.render(hbs`{{player/questions/qz-multiple-answer question=question
        onAnswerChanged='myOnAnswerChanged' onAnswerCompleted='myOnAnswerCompleted'}}`);

  const $component = this.$(); //component dom element

  //select a radio button
  answers = [{ value: '1' }];
  $component
    .find('.answer-choices tbody tr:eq(0) input[type=radio]:eq(0)')
    .click(); //Yes
  answers = [{ value: '1' }, { value: '2' }];
  $component
    .find('.answer-choices tbody tr:eq(1) input[type=radio]:eq(0)')
    .click(); //Yes
  answers = [{ value: '1' }, { value: '2' }, { value: '3' }];
  $component
    .find('.answer-choices tbody tr:eq(2) input[type=radio]:eq(0)')
    .click(); //Yes
  answers = [{ value: '1' }, { value: '3' }];
  $component
    .find('.answer-choices tbody tr:eq(1) input[type=radio]:eq(1)')
    .click(); //No
});

test('Multiple answer question layout - read only', function(assert) {
  assert.expect(2);

  const question = ResourceModel.create({
    id: '569906aa20b7dfae1bcd5',
    type: QUESTION_TYPES.multipleAnswer,
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
    ])
  });

  this.set('question', question);
  this.render(
    hbs`{{player/questions/qz-multiple-answer question=question readOnly=true}}`
  );

  const $component = this.$(); //component dom element
  T.exists(assert, $component.find('.instructions'), 'Missing instructions');
  assert.equal(
    $component.find('.answer-choices tr input[disabled]').length,
    6,
    'Missing answer choices radio inputs'
  );
});

test('Multiple answer question layout - with user answer', function(assert) {
  assert.expect(7);
  const question = ResourceModel.create({
    id: '569906aa20b7dfae1bcd5',
    type: QUESTION_TYPES.multipleAnswer,
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
    ])
  });

  const answers = [{ value: '1' }];
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
  this.set('userAnswer', [{ value: '1' }]);

  this.render(hbs`{{player/questions/qz-multiple-answer question=question
                    userAnswer=userAnswer
                    onAnswerChanged='changeAnswer'
                    onAnswerLoaded='loadAnswer'}}`);

  const $component = this.$(); //component dom element
  T.exists(assert, $component.find('.instructions'), 'Missing instructions');
  assert.equal(
    $component.find('.answer-choices tbody tr input').length,
    6,
    'Missing answer choices radio inputs'
  );
  assert.equal(
    $component.find('.answer-choices tbody tr:eq(0) input:checked').val(),
    'yes|1',
    'Wrong selection for answer 1'
  );
  assert.equal(
    $component.find('.answer-choices tbody tr:eq(1) input:checked').val(),
    'no|2',
    'Wrong selection for answer 1'
  );
  assert.equal(
    $component.find('.answer-choices tbody tr:eq(2) input:checked').val(),
    'no|3',
    'Wrong selection for answer 1'
  );
});
