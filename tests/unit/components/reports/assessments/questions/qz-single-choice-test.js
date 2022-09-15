import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import Answer from 'quizzes-addon/models/resource/answer';
import Resource from 'quizzes-addon/models/resource/resource';

moduleForComponent(
  'reports/assessment/questions/qz-single-choice',
  'Unit | Component | reports/assessment/questions/qz single choice',
  {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true
  }
);

test('answers when show correct', function(assert) {
  const component = this.subject();
  var question = Ember.Object.create({
    question: Resource.create({
      correctAnswer: [{ value: '3' }],
      answers: Ember.A([
        Answer.create({ value: '1', text: 'Answer 1' }),
        Answer.create({ value: '2', text: 'Answer 2' }),
        Answer.create({ value: '3', text: 'Answer 3' })
      ])
    })
  });
  const expectedAnswers = Ember.A([
    {
      selected: false,
      text: 'Answer 1',
      correct: true
    },
    {
      selected: false,
      text: 'Answer 2',
      correct: true
    },
    {
      selected: true,
      text: 'Answer 3',
      correct: true
    }
  ]);
  component.set('showCorrect', true);
  component.set('question', question);
  assert.deepEqual(
    component.get('answers'),
    expectedAnswers,
    'Incorrect answers'
  );
});

test('answers when show correct when null', function(assert) {
  const component = this.subject();
  var question = Ember.Object.create({
    question: Resource.create({
      correctAnswer: null,
      answers: Ember.A([
        Answer.create({ value: '1', text: 'Answer 1' }),
        Answer.create({ value: '2', text: 'Answer 2' }),
        Answer.create({ value: '3', text: 'Answer 3' })
      ])
    })
  });
  const expectedAnswers = Ember.A([
    {
      selected: false,
      text: 'Answer 1',
      correct: true
    },
    {
      selected: false,
      text: 'Answer 2',
      correct: true
    },
    {
      selected: false,
      text: 'Answer 3',
      correct: true
    }
  ]);
  component.set('showCorrect', true);
  component.set('question', question);
  assert.deepEqual(
    component.get('answers'),
    expectedAnswers,
    'Incorrect answers'
  );
});

test('answers show user answers', function(assert) {
  const component = this.subject();
  var question = Ember.Object.create({
    correct: false,
    question: Resource.create({
      correctAnswer: [{ value: '3' }],
      answers: Ember.A([
        Answer.create({ value: '1', text: 'Answer 1' }),
        Answer.create({ value: '2', text: 'Answer 2' }),
        Answer.create({ value: '3', text: 'Answer 3' })
      ])
    })
  });
  const expectedAnswers = Ember.A([
    {
      selected: false,
      text: 'Answer 1',
      correct: false
    },
    {
      selected: true,
      text: 'Answer 2',
      correct: false
    },
    {
      selected: false,
      text: 'Answer 3',
      correct: false
    }
  ]);
  component.set('showCorrect', false);
  component.set('question', question);
  component.set('userAnswer', [{ value: '2' }]);
  assert.deepEqual(
    component.get('answers'),
    expectedAnswers,
    'Incorrect answers'
  );
});
