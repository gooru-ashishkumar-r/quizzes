import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleForComponent(
  'player/questions/qz-open-ended',
  'Integration | Component | player/questions/qz open ended',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('Open ended layout', function(assert) {
  assert.expect(4);

  const question = Ember.Object.create({
    id: '569906aa7fe0695bfd409731',
    type: QUESTION_TYPES.openEnded,
    text: 'Sample Question OE',
    answers: [],
    sequence: 9
  });
  this.set('question', question);
  this.render(hbs`{{player/questions/qz-open-ended question=question}}`);

  var $component = this.$(); //component dom element
  T.exists(assert, $component.find('.instructions'), 'Missing instructions');
  T.exists(assert, $component.find('textarea'), 'Missing textarea');
  T.exists(
    assert,
    $component.find('.help-block span'),
    'Missing character limit'
  );
  assert.equal(
    $component.find('.help-block span').text(),
    '1000',
    'Initial character limit should be 1000'
  );
});

test('Open ended enter response', function(assert) {
  assert.expect(6);

  const question = Ember.Object.create({
    id: '569906aa7fe0695bfd409731',
    type: QUESTION_TYPES.openEnded,
    text: 'Sample Question OE',
    answers: [],
    sequence: 9
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
    //called 1 time
    assert.deepEqual(
      answer,
      answers,
      'Answer completed, but the answers are not correct'
    );
  });

  this.on('myOnAnswerCleared', function(question, answer) {
    //called 1 time
    assert.deepEqual(
      answer,
      answers,
      'Answer cleared, but the answers are not correct'
    );
  });

  this.render(hbs`{{player/questions/qz-open-ended question=question
        onAnswerChanged='myOnAnswerChanged'
        onAnswerCleared='myOnAnswerCleared'
        onAnswerCompleted='myOnAnswerCompleted'}}`);

  const $component = this.$(); //component dom element

  //enter response
  answers = [{ value: 'test' }];
  $component.find('textarea').val('test');
  $component.find('textarea').change();
  assert.equal(
    $component.find('.help-block span').text(),
    '996',
    'Character limit should be 996'
  );

  //clear response
  answers = [{ value: '' }];
  $component.find('textarea').val('');
  $component.find('textarea').change();
  assert.equal(
    $component.find('.help-block span').text(),
    '1000',
    'Character limit should be 1000'
  );
});

test('Open ended layout - read only', function(assert) {
  assert.expect(1);

  const question = Ember.Object.create({
    id: '569906aa7fe0695bfd409731',
    type: QUESTION_TYPES.openEnded,
    text: 'Sample Question OE',
    answers: [],
    sequence: 9
  });

  this.set('question', question);
  this.render(
    hbs`{{player/questions/qz-open-ended question=question readOnly=true}}`
  );

  var $component = this.$(); //component dom element
  T.exists(assert, $component.find('textarea[disabled]'), 'Missing textarea');
});

test('Open ended layout - with user answer', function(assert) {
  assert.expect(4);

  const question = Ember.Object.create({
    id: '569906aa7fe0695bfd409731',
    type: QUESTION_TYPES.openEnded,
    text: 'Sample Question OE',
    answers: [],
    sequence: 9
  });

  const answers = [{ value: 'test' }];
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
  this.set('userAnswer', [{ value: 'test' }]);
  this.render(hbs`{{player/questions/qz-open-ended question=question
                    userAnswer=userAnswer
                    onAnswerChanged='changeAnswer'
                    onAnswerLoaded='loadAnswer'}}`);

  var $component = this.$(); //component dom element
  T.exists(assert, $component.find('textarea'), 'Missing textarea');
  assert.equal($component.find('textarea').val(), 'test', 'Wrong user answer');
});
