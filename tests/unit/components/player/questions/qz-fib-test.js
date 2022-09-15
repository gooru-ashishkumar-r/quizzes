import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import AnswerModel from 'quizzes-addon/utils/question/answer-object';
import ResourceModel from 'quizzes-addon/models/resource/resource';

moduleForComponent(
  'player/questions/qz-fib',
  'Unit | Component | player/questions/qz fib',
  {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true
  }
);

test('answers without user answer', function(assert) {
  const component = this.subject();
  component.set('question', ResourceModel.create({ body: 'The sun is []' }));
  assert.equal(
    component.get('answers'),
    'The sun is <input type=\'text\' value=\'\' />'
  );
});

test('answers with user answer', function(assert) {
  const component = this.subject();
  const question = ResourceModel.create({
    body: 'The sun is []',
    answers: Ember.A([
      AnswerModel.create({
        value: 'yellow',
        text: 'yellow'
      })
    ]),
    hasAnswers: true
  });
  component.set('question', question);
  component.set('userAnswer', [{ value: 'yellow' }]);
  assert.equal(
    component.get('answers'),
    'The sun is <input type=\'text\' value=\'yellow\' />'
  );
});

test('answers with malformed sqrt math expression', function(assert) {
  const component = this.subject();
  component.set('question', ResourceModel.create({ body: 'sqrt[]{125} = []' }));
  assert.equal(
    component.get('answers'),
    'sqrt[]{125} = <input type=\'text\' value=\'\' />'
  );
});

test('answers with user answer and malformed sqrt math expression', function(
  assert
) {
  const component = this.subject();
  const question = ResourceModel.create({
    body: 'sqrt[]{125} = []',
    answers: Ember.A([
      AnswerModel.create({
        value: '5',
        text: '5'
      })
    ]),
    hasAnswers: true
  });
  component.set('question', question);
  component.set('userAnswer', [{ value: '5' }]);
  assert.equal(
    component.get('answers'),
    'sqrt[]{125} = <input type=\'text\' value=\'5\' />'
  );
});
