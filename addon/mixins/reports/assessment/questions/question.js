import Ember from 'ember';

/**
 * This mixin is only used by the assessment report question components
 * It has the default definition and convenience methods for all question types
 * @see reports/assessment/questions/qz-single-choice.js
 */
export default Ember.Mixin.create({
  // -------------------------------------------------------------------------
  // Properties

  /**
   * Question information
   * @property {Resource} question
   */
  question: null,

  /**
   * @property {Answer[]} selected user answer
   */
  userAnswer: Ember.computed.alias('question.answer'),

  /**
   * @property {boolean} indicates if it should display the correct question answer
   */
  showCorrect: null,

  /**
   * @property {boolean} indicates if it is in anonymous mode
   */
  anonymous: null
});
