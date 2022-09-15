import AnswerObject from 'quizzes-addon/utils/question/answer-object';
import { module, test } from 'qunit';

module('Unit | Utility | answer object');

// --------------- Answer Object
test('Answer Object - correct', function(assert) {
  let answerObject = AnswerObject.create({ status: null });
  //when status is null
  assert.ok(!answerObject.get('correct'), 'Should not be correct');

  answerObject = AnswerObject.create({ status: 'incorrect' });
  //when status is initialize as incorrect
  assert.ok(!answerObject.get('correct'), 'Should not be correct');

  answerObject = AnswerObject.create({ status: 'correct' });
  //when status is initialize as correct
  assert.ok(answerObject.get('correct'), 'Should be correct');

  //when status is changed to incorrect
  answerObject.set('status', 'incorrect');
  assert.ok(!answerObject.get('correct'), 'Should not be correct');

  //when status is changed to correct
  answerObject.set('status', 'correct');
  assert.ok(answerObject.get('correct'), 'Should be correct');
});
