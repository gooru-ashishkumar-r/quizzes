import Ember from 'ember';

/**
 * It defines the answer object structure that is send to BE
 *
 * @typedef {Object} AnswerObject
 */
export default Ember.Object.extend({
  /**
   * Answer text
   * @property {string}
   */
  text: null,

  /**
   * @property {boolean}
   */
  correct: Ember.computed('status', {
    get() {
      return this.get('status') === 'correct';
    },
    set(key, value) {
      this.set('status', value ? 'correct' : 'incorrect');
      return value;
    }
  }),

  /**
   * Answer status, correct or incorrect
   * @property {string}
   */
  status: null,

  /**
   * Answer order
   * @property {number}
   */
  order: null,
  /**
   * Answer id
   * @property {string}
   */
  answerId: null,

  /**
   * Skipped?
   * @property {boolean}
   */
  skip: null
});
