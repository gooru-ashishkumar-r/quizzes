import Ember from 'ember';
import ResourceResult from './resource';

/**
 * Model for a brief summary of the status of a question after it was answered by a user.
 *
 * @typedef {Object} QuestionResult
 *
 */
export default ResourceResult.extend({
  /**
   * @property {Object} answer - Answer provided by the user
   */
  answer: null,

  /**
   * If user did not answer the question or did not view the resource, then status will be skipped.
   * Values: correct / incorrect / skipped
   *
   * This value can be null for “start” event. Required for “stop” event.
   *
   * @property {String}
   */
  attemptStatus: Ember.computed(
    'correct',
    'skipped',
    'isResource',
    'isOpenEnded',
    'isScientific',
    function() {
      const correct = this.get('correct');
      const skipped = this.get('skipped');
      const isResource = this.get('isResource');
      const isOpenEnded = this.get('isOpenEnded');
      const isScientific = this.get('isScientific');
      let status = 'started';
      if (isResource || isOpenEnded || isScientific) {
        status = skipped ? 'skipped' : 'started';
      } else {
        status = correct ? 'correct' : skipped ? 'skipped' : 'incorrect';
      }
      return status;
    }
  ),

  /**
   * @property {boolean} correct - Was the answer provided for this question correct?
   */
  correct: Ember.computed.equal('score', 100),

  /**
   * @property {boolean} incorrect - Was the answer provided for this question incorrect?
   */
  incorrect: Ember.computed.not('correct'),

  /**
   * @property {boolean} isOpenEnded - If the question is openEnded
   */
  isOpenEnded: Ember.computed.alias('question.isOpenEnded'),

  /**
   * @property {boolean} isScientific - If the question is scientific
   */
  isScientific: Ember.computed('question', function() {
    let question = this.get('question');
    return (
      question.get('isScientificFreeResponse') ||
      question.get('isScientificFIB')
    );
  }),

  /**
   * @property {number} resource - the question
   */
  question: Ember.computed.alias('resource'),

  /**
   * @property {number} questionId - ID of the question
   */
  questionId: Ember.computed.alias('resourceId'),

  /**
   * @property {number} reaction - user reaction to the resource
   */
  reaction: 0,

  /**
   * @property {number} score - Resource score
   */
  score: 0,

  /**
   * @property {boolean} started
   */
  skipped: true,

  /**
   * @property {boolean} started
   */
  started: Ember.computed.bool('answer'),

  /**
   * @property {boolean} submitted - if the question is already submitted
   */
  submitted: false,

  baseResourceId: null,

  subResources: Ember.A([]),

  // -------------------------------------------------------------------------
  // Methods

  clear: function() {
    this._super(...arguments);
    this.set('answer', null);
    this.set('score', 0);
  }
});
