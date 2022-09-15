import Ember from 'ember';
import { average, roundFloat } from 'quizzes-addon/utils/math';

/**
 * Utility methods to handle stats for QuestionResult instances
 */

/**
  * Returns stats for a set of question results
  * @param {QuestionResult[]} questionResults
  * @returns {{ total: number, correct: number, incorrect: number, skipped: number, notStarted: number}}
  */
export function stats(questionResults) {
  const total = questionResults.length;
  let correct = 0;
  let incorrect = 0;
  let skipped = 0;
  let started = 0;
  let timeSpent = 0;
  const reactions = [];
  let isOpenEnded = false;
  let openEndedPercentageTotal = 0;
  questionResults.forEach(function(item) {
    correct += item.get('correct') ? 1 : 0;
    incorrect += item.get('incorrect') ? 1 : 0;
    skipped += item.get('skipped') ? 1 : 0;
    started += item.get('started') ? 1 : 0;
    timeSpent += item.get('timeSpent');
    isOpenEnded = item.get('resource.type') === 'extended_text';
    if (item.get('reaction')) {
      reactions.push(item.get('reaction'));
    }
  });

  const notStarted = total - started;
  const completed = correct + incorrect; //incorrect should include skipped ones
  //OE question should not be calculated
  if (isOpenEnded) {
    correct = incorrect = 0;
    //show full blue panel bar
    openEndedPercentageTotal = 100;
  }

  return Ember.Object.create({
    total,
    totalCorrect: correct,
    correctPercentage: completed ? roundFloat(correct / completed * 100) : null,
    correctPercentageFromTotal: roundFloat(correct / total * 100, 1), //percentage including not started
    totalIncorrect: incorrect,
    incorrectPercentage: completed
      ? roundFloat(incorrect / completed * 100)
      : null,
    incorrectPercentageFromTotal: roundFloat(incorrect / total * 100, 1), //percentage including not started
    totalSkipped: skipped,
    skippedPercentage: roundFloat(skipped / total * 100),
    totalNotStarted: notStarted,
    notStartedPercentage: roundFloat(notStarted / total * 100),
    totalCompleted: completed,
    completedPercentage: roundFloat(completed / total * 100),
    averageReaction: reactions.length ? roundFloat(average(reactions)) : null,
    totalTimeSpent: timeSpent,
    isOpenEnded,
    openEndedPercentageTotal
  });
}

/**
 * Average user reaction to the questions in the assessment
 * @param {QuestionResult[]} questionsResults
 * @prop {Number} averageReaction
 */
export function averageReaction(questionsResults) {
  const totals = stats(questionsResults);
  return totals.get('averageReaction');
}

/**
 * Number of questions answered correctly in this attempt
 * @param {QuestionResult[]} questionsResults
 * @prop {Number}
 */
export function correctAnswers(questionsResults) {
  const totals = stats(questionsResults);
  return totals.get('totalCorrect');
}

/**
 * Percentage of correct answers vs. the total number of questions
 * @param {QuestionResult[]} questionsResults
 * @param {boolean} includeAll, when true it calculates the percentage based on all questions, not only the answered
 * @prop {Number}
 */
export function correctPercentage(questionsResults, includeAll = false) {
  const totals = stats(questionsResults);
  return includeAll
    ? totals.get('correctPercentageFromTotal')
    : totals.get('correctPercentage');
}
/**
 * Total number of seconds spent completing the current attempt
 * @param {QuestionResult[]} questionsResults
 * @prop {Number}
 */
export function totalTimeSpent(questionsResults) {
  const totals = stats(questionsResults);
  return totals.get('totalTimeSpent');
}

/**
 * Total number of results completed
 * @param {QuestionResult[]} questionsResults
 * @prop {number}
 */
export function totalCompleted(questionsResults) {
  const totals = stats(questionsResults);
  return totals.get('totalCompleted');
}

/**
 * Total number of results completed
 * @param {QuestionResult[]} questionsResults
 * @prop {number}
 */
export function totalNotStarted(questionsResults) {
  const totals = stats(questionsResults);
  return totals.get('totalNotStarted');
}

/**
 * Returns only completed results
 * @param {QuestionResult[]} questionsResults
 * @prop {QuestionResult[]}
 */
export function completedResults(questionsResults) {
  return questionsResults.filter(questionResult =>
    questionResult.get('completed')
  );
}

/**
 * Returns only answered results
 * @param {QuestionResult[]} questionsResults
 * @prop {QuestionResult[]}
 */
export function answeredResults(questionsResults) {
  return questionsResults.filter(questionResult =>
    questionResult.get('started')
  );
}

/**
 * Sort results by submittedAt field, ascending
 * @param {QuestionResult[]} questionsResults
 * @prop {QuestionResult[]}
 */
export function sortResults(questionsResults) {
  return questionsResults.sortBy('submittedAt');
}

/**
 * Returns valid user answers
 * @param {QuestionResult[]} questionResults
 * @return {*} user answers
 */
export function userAnswers(questionResults) {
  return questionResults.map(questionResult => questionResult.get('answer'));
}
