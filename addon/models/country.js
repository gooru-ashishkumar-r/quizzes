import Ember from 'ember';

/**
 * Country model
 *
 * @typedef {Object} Country
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
