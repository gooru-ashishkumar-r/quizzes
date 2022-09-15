import Ember from 'ember';

/**
 * Audience model
 *
 * @typedef {Object} Audience
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
   * @property {number}
   */
  order: null
});
