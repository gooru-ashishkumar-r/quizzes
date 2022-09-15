import Ember from 'ember';
import {
  averageReaction,
  correctAnswers,
  correctPercentage,
  totalTimeSpent
} from 'quizzes-addon/utils/question-result';
import QuestionResult from 'quizzes-addon/models/result/question';
import { module, test } from 'qunit';

module('Unit | Utility | question-result');

test('Average Reaction', function(assert) {
  const questions = Ember.A([
    QuestionResult.create({
      question: {},
      score: 100,
      timeSpent: 10, //seconds
      reaction: 5,
      answer: 1
    }),
    QuestionResult.create({
      question: {},
      score: 0,
      timeSpent: 25, //seconds
      reaction: 2,
      answer: 1
    })
  ]);
  assert.equal(averageReaction(questions), 4, 'Average reaction should be 4');
});

test('Correct Answers', function(assert) {
  const questions = Ember.A([
    QuestionResult.create({
      question: {},
      score: 100,
      timeSpent: 10, //seconds
      reaction: 5,
      answer: 1
    }),
    QuestionResult.create({
      question: {},
      score: 0,
      timeSpent: 25, //seconds
      reaction: 2,
      answer: 1
    })
  ]);
  assert.equal(correctAnswers(questions), 1, 'Correct answer should be 1');
});

test('Correct Percentage', function(assert) {
  const questions = Ember.A([
    QuestionResult.create({
      question: {},
      score: 100, //correct
      timeSpent: 10,
      reaction: 5,
      answer: 1
    }),
    QuestionResult.create({
      question: {},
      score: 0, //incorrect
      timeSpent: 25,
      reaction: 2,
      answer: 1
    }),
    QuestionResult.create({
      question: {},
      score: 0, //incorrect
      timeSpent: 25,
      reaction: 2,
      answer: null //skipped
    })
  ]);
  assert.equal(
    correctPercentage(questions),
    33,
    'Correct Percentage should be 33'
  );
});

test('Total Time Spent', function(assert) {
  const questions = Ember.A([
    QuestionResult.create({
      question: {},
      score: 100,
      timeSpent: 10, //seconds
      reaction: 5,
      answer: 1
    }),
    QuestionResult.create({
      question: {},
      score: 0,
      timeSpent: 25, //seconds
      reaction: 2,
      answer: 1
    })
  ]);
  assert.equal(totalTimeSpent(questions), 35, 'Total time spent should be 35');
});

// TODO fix when working on how to represent not started, dates and attempts
/*test('Stats having not started, not started should be ignored', function (assert) {
  const questions = Ember.A([
    QuestionResult.create({
      question: {},
      score: 100,
      timeSpent: 10, //seconds
      reaction: 5,
      answer: 1
    }),
    QuestionResult.create({
      question: {},
      score: 0,
      timeSpent: 25, //seconds
      reaction: 4,
      answer: 1
    }),
    QuestionResult.create({
      question: {},
      score: 0,
      timeSpent: 25, //seconds
      reaction: 4,
      answer: 1
    }),
    QuestionResult.create({
      question: {},
      score: 0,
      timeSpent: 25, //seconds
      reaction: 5,
      answer: 1
    }),
    QuestionResult.create(), //not started
    QuestionResult.create()
  ]);
  let totals = stats(questions);

  assert.equal(totals.get('total'), 6, 'Wrong total');
  assert.equal(totals.get('totalCorrect'), 1, 'Wrong correct');
  assert.equal(totals.get('correctPercentage'), 25, 'Wrong correct percentage');
  assert.equal(totals.get('correctPercentageFromTotal'), 16.7, 'Wrong correct percentage from total');
  assert.equal(totals.get('totalIncorrect'), 3, 'Wrong incorrect');
  assert.equal(totals.get('incorrectPercentage'), 75, 'Wrong incorrect percentage');
  assert.equal(totals.get('incorrectPercentageFromTotal'), 50, 'Wrong incorrect percentage from total');
  assert.equal(totals.get('totalSkipped'), 2, 'Wrong skipped');
  assert.equal(totals.get('skippedPercentage'), 33, 'Wrong skipped percentage');
  assert.equal(totals.get('totalNotStarted'), 2, 'Wrong not started');
  assert.equal(totals.get('notStartedPercentage'), 33, 'Wrong not started percentage');
  assert.equal(totals.get('totalCompleted'), 4, 'Wrong not started');
  assert.equal(totals.get('completedPercentage'), 67, 'Wrong completed percentage');
  assert.equal(totals.get('totalTimeSpent'), 85, 'Wrong total time spent');
  assert.equal(totals.get('averageReaction'), 5, 'Wrong average reaction');
});

test('Stats when all completed', function (assert) {
  const questions = Ember.A([
    QuestionResult.create({
      question: {},
      score: 100,
      timeSpent: 10, //seconds
      reaction: 5,
      answer: 1
    }),
    QuestionResult.create({
      question: {},
      score: 0,
      timeSpent: 25, //seconds
      reaction: 4,
      answer: 1
    }),
    QuestionResult.create({
      question: {},
      score: 0,
      timeSpent: 25, //seconds
      reaction: 4,
      answer: 1
    }),
    QuestionResult.create({
      question: {},
      score: 0,
      timeSpent: 25, //seconds
      reaction: 5,
      answer: null //skipped
    }),
    QuestionResult.create({
      question: {},
      score: 0,
      timeSpent: 25, //seconds
      reaction: 5,
      answer: null //skipped
    })
  ]);
  let totals = stats(questions);

  assert.equal(totals.get('total'), 5, 'Wrong total');
  assert.equal(totals.get('totalCorrect'), 1, 'Wrong correct');
  assert.equal(totals.get('correctPercentage'), 20, 'Wrong correct percentage');
  assert.equal(totals.get('correctPercentageFromTotal'), 20, 'Wrong correct percentage from total');
  assert.equal(totals.get('totalIncorrect'), 4, 'Wrong incorrect, 2 incorrect + 2 skipped');
  assert.equal(totals.get('incorrectPercentage'), 80, 'Wrong incorrect percentage');
  assert.equal(totals.get('incorrectPercentageFromTotal'), 80, 'Wrong incorrect percentage from total');
  assert.equal(totals.get('totalSkipped'), 2, 'Wrong skipped');
  assert.equal(totals.get('skippedPercentage'), 40, 'Wrong skipped percentage');
  assert.equal(totals.get('totalNotStarted'), 0, 'Wrong not started');
  assert.equal(totals.get('notStartedPercentage'), 0, 'Wrong not started percentage');
  assert.equal(totals.get('totalCompleted'), 5, 'Wrong not started');
  assert.equal(totals.get('completedPercentage'), 100, 'Wrong not completed percentage');
  assert.equal(totals.get('totalTimeSpent'), 110, 'Wrong total time spent');
  assert.equal(totals.get('averageReaction'), 5, 'Wrong average reaction');
});

test('completedResults', function (assert) {
  const questions = Ember.A([
    QuestionResult.create({
      score: 100,
      timeSpent: 10, //seconds
      reaction: 5,
      answer: 1
    }),
    QuestionResult.create({
      score: 0,
      timeSpent: 25, //seconds
      reaction: 4,
      answer: 1
    }),
    QuestionResult.create({
      score: 0,
      timeSpent: 25, //seconds
      reaction: 4,
      answer: 1
    }),
    QuestionResult.create({
      score: 0,
      timeSpent: 25, //seconds
      reaction: 5,
      answer: null //skipped
    }),
    QuestionResult.create(),
    QuestionResult.create()
  ]);
  let completed = completedResults(questions);

  assert.equal(completed.get('length'), 4, 'Wrong total. 1 correct + 2 incorrect + 1 skipped');
});

test('answeredResults', function (assert) {
  const questions = Ember.A([
    QuestionResult.create({
      score: 100,
      timeSpent: 10, //seconds
      reaction: 5,
      answer: 1
    }),
    QuestionResult.create({
      score: 0,
      timeSpent: 25, //seconds
      reaction: 4,
      answer: 1
    }),
    QuestionResult.create({
      score: 0,
      timeSpent: 25, //seconds
      reaction: 4,
      answer: 1
    }),
    QuestionResult.create({
      score: 0,
      timeSpent: 25, //seconds
      reaction: 5,
      answer: null //skipped
    }),
    QuestionResult.create(),
    QuestionResult.create()
  ]);
  let answered = answeredResults(questions);

  assert.equal(answered.get('length'), 3, 'Wrong total. 1 correct + 2 incorrect');
});

test('sortResults', function (assert) {
  const questions = Ember.A([
    QuestionResult.create({
      score: 100,
      timeSpent: 10, //seconds
      reaction: 5,
      answer: 1,
      submittedAt: new Date('October 13, 2014 11:40:00')
    }),
    QuestionResult.create({
      score: 0,
      timeSpent: 25, //seconds
      reaction: 4,
      answer: 1,
      submittedAt: new Date('October 13, 2014 11:20:00')
    }),
    QuestionResult.create({
      score: 0,
      timeSpent: 25, //seconds
      reaction: 4,
      answer: 1,
      submittedAt: new Date('October 13, 2014 11:10:00')
    }),
    QuestionResult.create({
      score: 0,
      timeSpent: 25, //seconds
      reaction: 5,
      answer: 1,
      submittedAt: new Date('October 13, 2014 11:50:00')
    }),
    QuestionResult.create(),
    QuestionResult.create()
  ]);
  let sorted = sortResults(questions);
  let dates = sorted.map(function(questionResult){
    return questionResult.get('submittedAt');
  });

  assert.deepEqual(dates, [
    null,
    null,
    new Date('October 13, 2014 11:10:00'),
    new Date('October 13, 2014 11:20:00'),
    new Date('October 13, 2014 11:40:00'),
    new Date('October 13, 2014 11:50:00')
  ], 'Wrong dates');
});

test('userAnswers', function (assert) {
  const results = Ember.A([
    QuestionResult.create({
      score: 100,
      timeSpent: 10, //seconds
      reaction: 5,
      answer: 1,
      submittedAt: new Date('October 13, 2014 11:40:00')
    }),
    QuestionResult.create({
      score: 0,
      timeSpent: 25, //seconds
      reaction: 4,
      answer: 2,
      submittedAt: new Date('October 13, 2014 11:20:00')
    }),
    QuestionResult.create({
      score: 0,
      timeSpent: 25, //seconds
      reaction: 4,
      answer: 3,
      submittedAt: new Date('October 13, 2014 11:10:00')
    }),
    QuestionResult.create({
      score: 100,
      timeSpent: 0, //seconds
      reaction: 0,
      answer: null,  //skipped
      submittedAt: new Date('October 13, 2014 11:50:00')
    }),
    QuestionResult.create(),
    QuestionResult.create()
  ]);
  let answers = userAnswers(results);
  assert.equal(answers.length, 3, 'Wrong total answers, 3 provided');
  assert.deepEqual(answers, [3,2,1], 'Wrong answers');
});

test('attemptStatus', function (assert) {
  let correct = QuestionResult.create({
    score: 100,
    timeSpent: 10, //seconds
    reaction: 5,
    answer: 1,
    startedAt: new Date('October 13, 2014 11:40:00'),
    submittedAt: new Date('October 13, 2014 11:40:00')
  });
  assert.equal(correct.get('attemptStatus'), 'correct', 'Wrong status for correct');


  let incorrect = QuestionResult.create({
    score: 0,
    timeSpent: 25, //seconds
    reaction: 4,
    answer: 2,
    startedAt: new Date('October 13, 2014 11:40:00'),
    submittedAt: new Date('October 13, 2014 11:20:00')
  });
  assert.equal(incorrect.get('attemptStatus'), 'incorrect', 'Wrong status for incorrect');

  let skipped = QuestionResult.create({
    score: 0,
    timeSpent: 0, //seconds
    reaction: 0,
    answer: null,  //skipped
    startedAt: new Date('October 13, 2014 11:40:00'),
    submittedAt: new Date('October 13, 2014 11:50:00')
  });
  assert.equal(skipped.get('attemptStatus'), 'skipped', 'Wrong status for skipped');

  let pending = QuestionResult.create({
    score: 0,
    timeSpent: 0, //seconds
    reaction: 0,
    answer: null,  //skipped
    startedAt: new Date('October 13, 2014 11:40:00'),
    submittedAt: null
  });
  assert.equal(pending.get('attemptStatus'), 'skipped', 'Wrong status for pending');
});*/
