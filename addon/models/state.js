import Ember from 'ember';

/**
 * State model
 *
 * @typedef {Object} State
 */
export default Ember.Object.extend({
  /**
   * @property {string}
   */
  id: null,

  /**
   * @property {string}
   */
  name: null,

  /**
   * @property {string}
   */
  code: null
});
