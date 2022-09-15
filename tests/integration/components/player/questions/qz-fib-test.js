import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import AnswerModel from 'quizzes-addon/utils/question/answer-object';
import ResourceModel from 'quizzes-addon/models/resource/resource';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleForComponent(
  'player/questions/qz-fib',
  'Integration | Component | player/questions/qz fib',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('Fill in the blanks layout', function(assert) {
  assert.expect(3);
  const question = ResourceModel.create({
    id: '569906aacea8416665209d53',
    type: QUESTION_TYPES.fib,
    body: 'The sun is [] and the moon []',
    hints: [],
    explanation: 'Sample explanation text',
    answers: Ember.A([
      AnswerModel.create({
        value: 'yellow',
        text: 'yellow'
      }),
      AnswerModel.create({
        value: 'white',
        text: 'white'
      })
    ]),
    sequence: 1,
    hasAnswers: true
  });

  this.set('question', question);
  this.render(hbs`{{player/questions/qz-fib question=question}}`);

  var $component = this.$(); //component dom element
  T.exists(assert, $component.find('.instructions'), 'Missing instructions');
  T.exists(
    assert,
    $component.find('.fib-answers'),
    'Missing fill in the blanks answers'
  );
  assert.equal(
    $component.find('.fib-answers input').length,
    2,
    'Incorrect number of inputs'
  );
});

test('Fill in the blanks events', function(assert) {
  assert.expect(8);

  const question = ResourceModel.create({
    id: '569906aacea8416665209d53',
    type: QUESTION_TYPES.fib,
    body: 'The sun is [] and the moon []',
    hints: [],
    explanation: 'Sample explanation text',
    answers: Ember.A([
      AnswerModel.create({
        value: 'yellow',
        text: 'yellow'
      }),
      AnswerModel.create({
        value: 'white',
        text: 'white'
      })
    ]),
    sequence: 1,
    hasAnswers: true
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
    //called 3 times
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

  this.render(hbs`{{player/questions/qz-fib question=question
        onAnswerChanged='myOnAnswerChanged'
        onAnswerCleared='myOnAnswerCleared'
        onAnswerCompleted='myOnAnswerCompleted'}}`);

  var $component = this.$(); //component dom element
  //enter response
  answers = [{ value: 'yellow' }, { value: '' }];
  $component.find('.fib-answers input:eq(0)').first().val('yellow');
  $component.find('.fib-answers input').first().keyup();

  //enter response
  answers = [{ value: 'yellow' }, { value: 'white' }];
  $component.find('.fib-answers input:eq(1)').first().val('white');
  $component.find('.fib-answers input').first().keyup();

  //clear response
  answers = [{ value: '' }, { value: 'white' }];
  $component.find('.fib-answers input:eq(0)').first().val('');
  $component.find('.fib-answers input').first().keyup();

  //clear response
  answers = [{ value: '' }, { value: '' }];
  $component.find('.fib-answers input:eq(1)').first().val('');
  $component.find('.fib-answers input').first().keyup();
});

test('Fill in the blanks layout - read only', function(assert) {
  assert.expect(1);
  const question = ResourceModel.create({
    id: '569906aacea8416665209d53',
    type: QUESTION_TYPES.fib,
    body: 'The sun is [] and the moon []',
    hints: [],
    explanation: 'Sample explanation text',
    answers: Ember.A([
      AnswerModel.create({
        value: 'yellow',
        text: 'yellow'
      }),
      AnswerModel.create({
        value: 'white',
        text: 'white'
      })
    ]),
    sequence: 1,
    hasAnswers: true
  });

  this.set('question', question);
  this.render(hbs`{{player/questions/qz-fib question=question readOnly=true}}`);

  var $component = this.$(); //component dom element
  assert.equal(
    $component.find('.fib-answers input[disabled]').length,
    2,
    'Incorrect number of inputs'
  );
});

test('Fill in the blanks layout - with user answer', function(assert) {
  assert.expect(5);
  const question = ResourceModel.create({
    id: '569906aacea8416665209d53',
    type: QUESTION_TYPES.fib,
    body: 'The sun is [] and the moon []',
    hints: [],
    explanation: 'Sample explanation text',
    answers: Ember.A([
      AnswerModel.create({
        value: 'yellow',
        text: 'yellow'
      }),
      AnswerModel.create({
        value: 'white',
        text: 'white'
      })
    ]),
    sequence: 1,
    hasAnswers: true
  });

  const answers = [{ value: 'amarillo' }, { value: 'gris' }];
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
  this.set('userAnswer', [{ value: 'amarillo' }, { value: 'gris' }]);
  this.render(hbs`{{player/questions/qz-fib question=question
                    userAnswer=userAnswer
                    onAnswerChanged='changeAnswer'
                    onAnswerLoaded='loadAnswer'}}`);

  var $component = this.$(); //component dom element
  assert.equal(
    $component.find('.fib-answers input').length,
    2,
    'Incorrect number of inputs'
  );
  assert.equal(
    $component.find('.fib-answers input:eq(0)').val(),
    'amarillo',
    'Wrong answer for input 1'
  );
  assert.equal(
    $component.find('.fib-answers input:eq(1)').val(),
    'gris',
    'Wrong answer for input 2'
  );
});

test('Fill in the blanks layout - with user answer and malformed math expression', function(
  assert
) {
  assert.expect(5);
  const question = ResourceModel.create({
    id: '569906aacea8416665209d53',
    type: QUESTION_TYPES.fib,
    body: 'sqrt[]{25} = [] * []',
    hints: [],
    explanation: 'Sample explanation text',
    answers: Ember.A([
      AnswerModel.create({
        value: '5',
        text: '5'
      }),
      AnswerModel.create({
        value: '1',
        text: '1'
      })
    ]),
    sequence: 1,
    hasAnswers: true
  });

  const answers = [{ value: '3' }, { value: '2' }];
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
  this.set('userAnswer', [{ value: '3' }, { value: '2' }]);
  this.render(hbs`{{player/questions/qz-fib question=question
                    userAnswer=userAnswer
                    onAnswerChanged='changeAnswer'
                    onAnswerLoaded='loadAnswer'}}`);

  var $component = this.$(); //component dom element
  assert.equal(
    $component.find('.fib-answers input').length,
    2,
    'Incorrect number of inputs'
  );
  assert.equal(
    $component.find('.fib-answers input:eq(0)').val(),
    '3',
    'Wrong answer for input 1'
  );
  assert.equal(
    $component.find('.fib-answers input:eq(1)').val(),
    '2',
    'Wrong answer for input 2'
  );
});

test('Set two questions', function(assert) {
  assert.expect(2);

  const question = ResourceModel.create({
    id: '569906aacea8416665209d53',
    type: QUESTION_TYPES.fib,
    body: 'The sun is [] and the moon []',
    hints: [],
    explanation: 'Sample explanation text',
    answers: Ember.A([
      AnswerModel.create({
        value: 'yellow',
        text: 'yellow'
      }),
      AnswerModel.create({
        value: 'white',
        text: 'white'
      })
    ]),
    sequence: 1,
    hasAnswers: true
  });

  const question1 = ResourceModel.create({
    id: '569906aacea8416665209d53',
    type: QUESTION_TYPES.fib,
    body: 'The sun is[] ,the moon[] and the stars[]',
    hints: [],
    explanation: 'Sample explanation text',
    answers: Ember.A([
      AnswerModel.create({
        value: 'yellow',
        text: 'yellow'
      }),
      AnswerModel.create({
        value: 'white',
        text: 'white'
      })
    ]),
    sequence: 1,
    hasAnswers: true
  });

  this.set('question', question);
  this.render(hbs`{{player/questions/qz-fib question=question}}`);

  var $component = this.$(); //component dom element
  assert.equal(
    $component.find('.fib-answers').text().trim(),
    'The sun is  and the moon',
    'Incorrect answer'
  );

  this.set('question', question1);

  assert.equal(
    $component.find('.fib-answers').text().trim(),
    'The sun is ,the moon and the stars',
    'Incorrect answer'
  );
});
