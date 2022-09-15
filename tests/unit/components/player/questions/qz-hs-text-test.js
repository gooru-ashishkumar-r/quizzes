import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import AnswerModel from 'quizzes-addon/utils/question/answer-object';
import ResourceModel from 'quizzes-addon/models/resource/resource';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleForComponent(
  'player/questions/qz-hs-text',
  'Unit | Component | player/questions/qz hs text',
  {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true
  }
);
test('answers', function(assert) {
  const component = this.subject();
  const question = ResourceModel.create({
    id: '569906aadfa0072204f7c7c7',
    type: QUESTION_TYPES.hotSpotText,
    body: 'Hot spot text',
    answers: Ember.A([
      AnswerModel.create({
        value: '1',
        text: 'An aquifer'
      })
    ]),
    sequence: 1
  });
  component.set('question', question);
  assert.deepEqual(
    component.get('answers'),
    [{ value: '1', text: 'An aquifer' }],
    'Incorrect answers'
  );
});

test('setAnswers', function(assert) {
  const component = this.subject();
  const userAnswer = [{ value: 1 }];

  component.set('userAnswer', userAnswer);
  component.setAnswers();
  assert.deepEqual(
    component.get('selectedAnswers'),
    [{ value: 1 }],
    'Incorrect answers'
  );
});

test('notify on load and change', function(assert) {
  assert.expect(2);
  const component = this.subject({
    notifyAnswerChanged: answerId =>
      assert.deepEqual(
        answerId,
        [{ value: 1 }, { value: 3 }],
        'Answer should match in answer changed'
      ),
    notifyAnswerLoaded: answerId =>
      assert.deepEqual(
        answerId,
        [{ value: 1 }, { value: 3 }],
        'Answer should match in answer loaded'
      ),
    notifyAnswerCompleted: () =>
      assert.ok(false, 'Answer completed should not be called'),
    notifyAnswerCleared: () =>
      assert.ok(false, 'Answer cleared should be called')
  });
  component.set('selectedAnswers', [{ value: 1 }, { value: 3 }]);
  component.notify([{ value: 1 }, { value: 3 }]);
});

test('notify clear and change', function(assert) {
  assert.expect(2);
  const component = this.subject({
    notifyAnswerChanged: answerId =>
      assert.deepEqual(answerId, [], 'Answer should match in answer changed'),
    notifyAnswerLoaded: () =>
      assert.ok(false, 'Answer cleared should be called'),
    notifyAnswerCompleted: () =>
      assert.ok(false, 'Answer completed should not be called'),
    notifyAnswerCleared: answer =>
      assert.deepEqual(answer, [], 'Answer should be cleared')
  });
  component.set('selectedAnswers', []);
  component.notify([]);
});
