import Ember from 'ember';
import { getQuestionUtil } from 'quizzes-addon/config/quizzes-question';

/**
 * Quizzes question base component
 *
 * This component contains convenience methods, properties and functionality to share across
 * all question type components
 *
 * @module
 * @see components/player/questions/*.js
 * @augments Ember/Component
 * @typedef {Object} QuestionComponent
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Indicate if the question has a user answer
   * @property {Boolean}
   */
  hasUserAnswer: Ember.computed('userAnswer', function() {
    return this.get('userAnswer') && this.get('userAnswer.length');
  }),

  /**
   * Text for action in instructions
   * @property {string}
   */
  instructionsActionTextKey: 'common.save',

  /**
   * @property {String|Function} onAnswerChanged - event handler for when the question answer is changed
   */
  onAnswerChanged: null,

  /**
   * @property {String|Function} onAnswerCleared - event handler for when the question answer is cleared
   */
  onAnswerCleared: null,

  /**
   * @property {String|Function} onAnswerCompleted - event handler for when the question answer is completed
   */
  onAnswerCompleted: null,

  /**
   * @property {String|Function} onAnswerLoaded - event handler for when the question answer is loaded from BE
   */
  onAnswerLoaded: null,

  /**
   * Question information
   * @property {Resource} question
   */
  question: null,

  /**
   * Question Util based on the question type
   * @property {QuestionUtil}
   */
  questionUtil: Ember.computed('question', function() {
    const question = this.get('question');
    const type = question.get('type');
    return getQuestionUtil(type).create({ question });
  }),

  /**
   * Indicates if the question is readOnly
   * @property {boolean} readOnly
   */
  readOnly: null,

  /**
   * @property {string} user answer
   * @see quizzes/utils/question/multiplce-choice.js
   */
  userAnswer: null,

  // -------------------------------------------------------------------------
  // Observers
  // -------------------------------------------------------------------------
  // Observers

  /**
   * Refresh items when the question changes
   */

  refreshAnswers: Ember.observer('question.id', function() {
    if (typeof this.setAnswers === 'function') {
      this.setAnswers();
    }
  }),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Notifies answer completion
   * @param {*} answer question answer
   * @param {boolean} correct
   */
  notifyAnswerChanged: function(answer) {
    const question = this.get('question');
    this.sendAction('onAnswerChanged', question, answer);
  },

  /**
   * Notifies answer completion
   * @param {*} answer question answer
   */
  notifyAnswerCleared: function(answer) {
    const question = this.get('question');
    this.sendAction('onAnswerCleared', question, answer);
  },

  /**
   * Notifies answer completion
   * @param {*} answer question answer
   * @param {boolean} correct
   */
  notifyAnswerCompleted: function(answer) {
    const question = this.get('question');
    this.sendAction('onAnswerCompleted', question, answer);
  },

  /**
   * Notifies answer was loaded from BE
   */
  notifyAnswerLoaded: function(answer) {
    const question = this.get('question');
    this.sendAction('onAnswerLoaded', question, answer);
  }
});
