/* Open ended is not supported
import Ember from 'ember';
import AnswerObject from 'quizzes-addon/utils/question/answer-object';
import OpenEndedUtil from 'quizzes-addon/utils/question/open-ended';
import { module, test } from 'qunit';

module('Unit | Utility | open ended');

// --------------- Open Ended tests
test('Open Ended - getCorrectAnswer no correct answer provided', function (assert) {
  let question = Ember.Object.create({});
  let questionUtil = OpenEndedUtil.create({question: question});
  assert.ok(!questionUtil.getCorrectAnswer(), "OE always return false");
});

test('Open Ended - isCorrect', function (assert) {
  let question = Ember.Object.create({});
  let questionUtil = OpenEndedUtil.create({question: question});

  assert.ok(questionUtil.isCorrect("any text"), "OE answers are always correct");
  assert.ok(questionUtil.isCorrect("any other"), "OE answers are always correc");
});

test('Open Ended - distribution', function (assert) {
  let questionUtil = OpenEndedUtil.create({question: null});

  let distribution = questionUtil.distribution(["text1", "text2", "text3"]);

  let keys = distribution.map(function (item) {
    return item.get("key");
  }).toArray();
  let counts = distribution.map(function (item) {
    return item.get("count");
  }).toArray();

  assert.deepEqual(keys, ["text1", "text2", "text3"], "Wrong keys");
  assert.deepEqual(counts, [1, 1, 1], "Wrong counts");
});

test('Open Ended - answerKey', function (assert) {
  let questionUtil = OpenEndedUtil.create({question: null});

  let key = questionUtil.answerKey("any text");
  assert.equal(key, "any text", "Wrong key");
});

test('Open Ended - toAnswerObjects', function (assert) {
  let question = Ember.Object.create();
  let questionUtil = OpenEndedUtil.create({question: question});

  let answerObjects = questionUtil.toAnswerObjects("Some text here");
  assert.equal(answerObjects.length, 1, "Only 1 answer object should be found");

  let answerObject = answerObjects.get("firstObject");
  assert.equal(answerObject.get("answerId"), 0, "Wrong answerId");
  assert.equal(answerObject.get("skip"), false, "Wrong skipped");
  assert.equal(answerObject.get("order"), 0, "Wrong order");
  assert.equal(answerObject.get("status"), null, "Wrong status");
  assert.equal(answerObject.get("text"), 'Some text here', "Wrong status");
});

test('Open Ended - toUserAnswer', function (assert) {
  let question = Ember.Object.create();
  let questionUtil = OpenEndedUtil.create({question: question});

  let answerObject = AnswerObject.create({ text: "Some text here" });
  let userAnswer = questionUtil.toUserAnswer(Ember.A([answerObject]));
  assert.equal(userAnswer, "Some text here", "Wrong userAnswer");
});
*/
