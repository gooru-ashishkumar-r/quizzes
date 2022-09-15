import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import AnswerModel from 'quizzes-addon/utils/question/answer-object';

moduleForComponent(
  'player/questions/qz-reorder',
  'Unit | Component | player/questions/qz reorder',
  {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true
  }
);
test('answers', function(assert) {
  const component = this.subject();
  const answers = Ember.A([
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
  ]);
  component.set('answers', answers);
  assert.equal(component.get('answers'), answers, 'Incorrect answers');
});
