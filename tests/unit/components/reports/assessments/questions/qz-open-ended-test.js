import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import Resource from 'quizzes-addon/models/resource/resource';

moduleForComponent(
  'reports/assessment/questions/qz-open-ended',
  'Unit | Component | reports/assessment/questions/qz open ended',
  {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true
  }
);

test('answer when show correct', function(assert) {
  const component = this.subject();
  var question = Ember.Object.create({
    question: Resource.create({
      correctAnswer: [{ value: 'answer' }]
    })
  });
  const expectedAnswers = 'answer';
  component.set('showCorrect', true);
  component.set('question', question);
  assert.deepEqual(
    component.get('answer'),
    expectedAnswers,
    'Incorrect answers'
  );
});

test('answers show user answers', function(assert) {
  const component = this.subject();
  var question = Ember.Object.create({
    question: Resource.create({
      correctAnswer: [{ value: 'answer' }]
    })
  });
  const expectedAnswers = 'user-answer';
  component.set('showCorrect', false);
  component.set('question', question);
  component.set('userAnswer', [{ value: 'user-answer' }]);
  assert.deepEqual(
    component.get('answer'),
    expectedAnswers,
    'Incorrect answers'
  );
});
