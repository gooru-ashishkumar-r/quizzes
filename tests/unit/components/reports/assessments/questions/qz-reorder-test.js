import { moduleForComponent, skip } from 'ember-qunit';
import Answer from 'quizzes-addon/models/resource/answer';
import Ember from 'ember';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleForComponent(
  'reports/assessment/questions/qz-reorder',
  'Unit | Component | reports/assessment/questions/qz reorder',
  {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true
  }
);
skip('answers when show correct', function(assert) {
  const component = this.subject();
  var question = Ember.Object.create({
    type: QUESTION_TYPES.hotTextReorder,
    question: {
      answers: Ember.A([
        Answer.create({ value: 'crc', text: 'Costa Rica' }),
        Answer.create({ value: 'bra', text: 'Brasil' }),
        Answer.create({ value: 'pan', text: 'Panamá' }),
        Answer.create({ value: 'chi', text: 'Chile' })
      ]),
      correctAnswer: Ember.A([
        Answer.create({ value: 'crc', text: 'Costa Rica' }),
        Answer.create({ value: 'bra', text: 'Brasil' }),
        Answer.create({ value: 'pan', text: 'Panamá' }),
        Answer.create({ value: 'chi', text: 'Chile' })
      ])
    }
  });
  const expectedAnswers = Ember.A([
    {
      selectedOrder: 1,
      text: 'Costa Rica',
      correct: true
    },
    {
      selectedOrder: 2,
      text: 'Brasil',
      correct: true
    },
    {
      selectedOrder: 3,
      text: 'Panamá',
      correct: true
    },
    {
      selectedOrder: 4,
      text: 'Chile',
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

skip('answers show user answers', function(assert) {
  const component = this.subject();
  var question = Ember.Object.create({
    type: QUESTION_TYPES.hotTextReorder,
    question: {
      answers: Ember.A([
        Answer.create({ value: 'crc', text: 'Costa Rica' }),
        Answer.create({ value: 'bra', text: 'Brasil' }),
        Answer.create({ value: 'pan', text: 'Panamá' }),
        Answer.create({ value: 'chi', text: 'Chile' })
      ]),
      correctAnswer: Ember.A([
        Answer.create({ value: 'crc', text: 'Costa Rica' }),
        Answer.create({ value: 'bra', text: 'Brasil' }),
        Answer.create({ value: 'pan', text: 'Panamá' }),
        Answer.create({ value: 'chi', text: 'Chile' })
      ])
    }
  });
  const expectedAnswers = Ember.A([
    {
      selectedOrder: 4,
      text: 'Costa Rica',
      correct: false
    },
    {
      selectedOrder: 3,
      text: 'Brasil',
      correct: false
    },
    {
      selectedOrder: 1,
      text: 'Panamá',
      correct: false
    },
    {
      selectedOrder: 2,
      text: 'Chile',
      correct: false
    }
  ]);
  component.set('question', question);
  component.set('userAnswer', [
    { value: 'pan' },
    { value: 'chi' },
    { value: 'bra' },
    { value: 'crc' }
  ]);
  assert.deepEqual(
    component.get('answers'),
    expectedAnswers,
    'Incorrect answers'
  );
});
