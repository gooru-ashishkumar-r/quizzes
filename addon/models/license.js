import Ember from 'ember';

/**
 * License model
 *
 * @typedef {Object} License
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
  description: null,

  /**
   * @property {string}
   */
  code: null
});
