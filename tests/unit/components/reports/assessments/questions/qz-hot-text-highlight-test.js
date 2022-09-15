import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import Resource from 'quizzes-addon/models/resource/resource';

moduleForComponent(
  'reports/assessment/questions/qz-hot-text-highlight',
  'Unit | Component | reports/assessment/questions/qz hot text highlight',
  {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true
  }
);

test('items when show correct', function(assert) {
  const mapItems = ({ index, text, selected, correct }) => ({
    index,
    text,
    selected,
    correct
  });
  const component = this.subject();
  var question = Ember.Object.create({
    question: Resource.create({
      correctAnswer: [{ value: 'Sentence 1.,0' }, { value: 'Sentence 3.,24' }],
      body: 'Sentence 1. Sentence 2. Sentence 3. Sentence 4. Sentence 5'
    })
  });
  const expectedItems = Ember.A([
    {
      selected: true,
      text: 'Sentence 1.',
      index: 0,
      correct: true
    },
    {
      selected: false,
      text: 'Sentence 2.',
      index: 12,
      correct: true
    },
    {
      selected: true,
      text: 'Sentence 3.',
      index: 24,
      correct: true
    },
    {
      selected: false,
      text: 'Sentence 4.',
      index: 36,
      correct: true
    },
    {
      selected: false,
      text: 'Sentence 5',
      index: 48,
      correct: true
    }
  ]);
  component.set('showCorrect', true);
  component.set('question', question);
  assert.deepEqual(
    component.get('items').map(mapItems),
    expectedItems,
    'Incorrect answers'
  );
});

test('items show user answers', function(assert) {
  const mapItems = ({ index, text, selected, correct }) => ({
    index,
    text,
    selected,
    correct
  });
  const component = this.subject();
  var question = Ember.Object.create({
    question: Resource.create({
      correctAnswer: [{ value: 'Sentence 1.,0' }, { value: 'Sentence 3.,24' }],
      body: 'Sentence 1. Sentence 2. Sentence 3. Sentence 4. Sentence 5'
    })
  });
  const expectedItems = Ember.A([
    {
      selected: false,
      text: 'Sentence 1.',
      index: 0,
      correct: true
    },
    {
      selected: true,
      text: 'Sentence 2.',
      index: 12,
      correct: false
    },
    {
      selected: true,
      text: 'Sentence 3.',
      index: 24,
      correct: true
    },
    {
      selected: false,
      text: 'Sentence 4.',
      index: 36,
      correct: true
    },
    {
      selected: false,
      text: 'Sentence 5',
      index: 48,
      correct: true
    }
  ]);
  component.set('showCorrect', false);
  component.set('question', question);
  component.set('userAnswer', [
    { value: 'Sentence 2.,12' },
    { value: 'Sentence 3.,24' }
  ]);
  assert.deepEqual(
    component.get('items').map(mapItems),
    expectedItems,
    'Incorrect answers'
  );
});
