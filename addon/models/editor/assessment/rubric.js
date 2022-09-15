import Ember from 'ember';

/**
 * Rubric model
 * typedef {Object} Rubric
 */
export default Ember.Object.extend({
  /**
   * @property {string} URL
   */
  url: '',
  /**
   * @property {string} mimeType
   */
  mimeType: 'application/pdf,image/*',
  /**
   * @property {Category[]} categories
   */
  categories: Ember.A([])
});
