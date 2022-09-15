import Ember from 'ember';

/**
 * Error model
 *
 * @typedef {Object} Error
 */
export default Ember.Object.extend({
  /**
   * @property {string}
   */
  description: null,

  /**
   * @property {{ status: number, url: string, response: string}}
   */
  endpoint: null,

  /**
   * @property {number}
   */
  timestamp: null,

  /**
   * @property {string}
   */
  userId: null,

  /**
   * Save extra information about the error
   * @property {*}
   */
  details: null,

  /**
   * @property {string}
   */
  type: null
});
