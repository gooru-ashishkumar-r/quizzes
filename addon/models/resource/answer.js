import Ember from 'ember';

/**
 * @typedef {Object} Answer
 */
export default Ember.Object.extend({
  /**
   * if the answer should not be shuffled
   * @property {boolean} isFixed
   */
  isFixed: null,

  /**
   * Text to show when showing the question
   * @property {string} text
   */
  text: null,

  /**
   * Value to check with the correct response
   * @property {string} value
   */
  value: null,

  /**
   * List of possible struggles assocaited with answer
   * @property {array} struggles
   */
  struggles: Ember.A()
});
