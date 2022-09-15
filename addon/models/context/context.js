import Ember from 'ember';

/**
 * Context model
 * typedef {Object} Context
 */
const Context = Ember.Object.extend({
  /**
   * @property {number} attempts
   */
  attempts: null,

  /**
   * @property {string}
   */
  id: null,

  /**
   * @property {string}
   */
  classId: null,

  /**
   * @property {string} title
   */
  title: null,

  /**
   * @property {string}
   */
  description: '',

  /**
   * @property {}
   */
  standards: [],

  /**
   * @property {boolean}
   */
  isActive: false,

  /**
   * @property {boolean}
   */
  isCollection: false,

  /**
   * @property {Collection}
   */
  collection: null,

  /**
   * @property {String}
   */
  collectionId: null,

  /**
   * @property {Object}
   */
  contextMapping: {},

  /**
   * @property {boolean}
   */
  hasStarted: false
});

export default Context;
