import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import AnswerModel from 'quizzes-addon/utils/question/answer-object';
import ResourceModel from 'quizzes-addon/models/resource/resource';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleForComponent(
  'reports/assessment/questions/qz-fib',
  'Unit | Component | reports/assessment/questions/qz-fib',
  {
    integration: false
  }
);

test('mergeArrays', function(assert) {
  assert.expect(9);

  var component = this.subject();
  const answers = Ember.A([
    Ember.Object.create({ text: 'green', class: 'answer correct' }),
    Ember.Object.create({ text: 'blue', class: 'answer incorrect' })
  ]);

  const sentences = Ember.A([
    Ember.Object.create({ text: 'The mountain is', class: 'sentence' }),
    Ember.Object.create({ text: 'and the sky', class: 'sentence' })
  ]);

  var merge = component.mergeArrays(sentences, answers);
  assert.equal(
    merge.length,
    5,
    'Should have 5 items, empty items are excluded'
  );
  assert.equal(merge[0].get('text'), 'The mountain is', 'Wrong item text');
  assert.equal(merge[0].get('class'), 'sentence', 'Wrong item class');
  assert.equal(merge[1].get('text'), 'green', 'Wrong item text');
  assert.equal(merge[1].get('class'), 'answer correct', 'Wrong item class');
  assert.equal(merge[2].get('text'), 'and the sky', 'Wrong item text');
  assert.equal(merge[2].get('class'), 'sentence', 'Wrong item class');
  assert.equal(merge[3].get('text'), 'blue', 'Wrong item text');
  assert.equal(merge[3].get('class'), 'answer incorrect', 'Wrong item class');
});

test('answers show correct answer', function(assert) {
  const component = this.subject();
  var question = Ember.Object.create({
    question: ResourceModel.create({
      type: QUESTION_TYPES.fib,
      body: 'The mountain is []',
      answers: Ember.A([
        AnswerModel.create({
          value: 'green',
          text: 'green'
        })
      ]),
      correctAnswer: Ember.A([AnswerModel.create({ value: 'green' })]),
      sequence: 1
    })
  });
  component.set('question', question);
  component.set('showCorrect', true);
  assert.equal(
    component.get('answer')[0].text,
    'The mountain is ',
    'Incorrect text'
  );
  assert.equal(component.get('answer')[0].class, 'sentence', 'Incorrect class');
  assert.equal(component.get('answer')[1].text, 'green', 'Incorrect text');
  assert.equal(
    component.get('answer')[1].class,
    'answer correct',
    'Incorrect class,should be correct'
  );
});

test('answers show user answer anonymous', function(assert) {
  const component = this.subject();
  var question = Ember.Object.create({
    question: ResourceModel.create({
      type: QUESTION_TYPES.fib,
      body: 'The mountain is []',
      answers: Ember.A([
        AnswerModel.create({
          value: 'green',
          text: 'green'
        })
      ]),
      correctAnswer: Ember.A([AnswerModel.create({ value: 'green' })]),
      sequence: 1
    })
  });
  var userAnswer = Ember.A([{ value: 'green' }]);

  component.set('question', question);
  component.set('userAnswer', userAnswer);
  component.set('anonymous', true);

  assert.equal(
    component.get('answer')[0].text,
    'The mountain is ',
    'Incorrect text'
  );
  assert.equal(component.get('answer')[0].class, 'sentence', 'Incorrect class');
  assert.equal(component.get('answer')[1].text, 'green', 'Incorrect text');
  assert.equal(
    component.get('answer')[1].class,
    'answer anonymous',
    'Class should be anonymous'
  );
});

test('answers show user answer correct, even with case differences', function(
  assert
) {
  const component = this.subject();
  var question = Ember.Object.create({
    question: ResourceModel.create({
      type: QUESTION_TYPES.fib,
      body: 'The mountain is []',
      answers: Ember.A([
        AnswerModel.create({
          value: 'green',
          text: 'green'
        })
      ]),
      correctAnswer: Ember.A([AnswerModel.create({ value: 'Green' })]),
      sequence: 1
    })
  });
  var userAnswer = Ember.A([{ value: 'green' }]);

  component.set('question', question);
  component.set('userAnswer', userAnswer);

  assert.equal(
    component.get('answer')[0].text,
    'The mountain is ',
    'Incorrect text'
  );
  assert.equal(component.get('answer')[0].class, 'sentence', 'Incorrect class');
  assert.equal(component.get('answer')[1].text, 'green', 'Incorrect text');
  assert.equal(
    component.get('answer')[1].class,
    'answer correct',
    'Class should be correct'
  );
});

test('answers show user answer incorrect', function(assert) {
  const component = this.subject();
  var question = Ember.Object.create({
    question: ResourceModel.create({
      type: QUESTION_TYPES.fib,
      body: 'The mountain is []',
      answers: Ember.A([
        AnswerModel.create({
          value: 'green',
          text: 'green'
        })
      ]),
      correctAnswer: Ember.A([AnswerModel.create({ value: 'green' })]),
      sequence: 1
    })
  });
  var userAnswer = Ember.A([{ value: 'blue' }]);

  component.set('question', question);
  component.set('userAnswer', userAnswer);

  assert.equal(
    component.get('answer')[0].text,
    'The mountain is ',
    'Incorrect text'
  );
  assert.equal(component.get('answer')[0].class, 'sentence', 'Incorrect class');
  assert.equal(component.get('answer')[1].text, 'blue', 'Incorrect text');
  assert.equal(
    component.get('answer')[1].class,
    'answer incorrect',
    'Class should be incorrect'
  );
});
