import Ember from 'ember';

/**
 * Category panel
 *
 * Panel that displays a title, a description and a call to action
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-category-panel'],

  classNameBindings: ['component-class'],

  /**
   * Specific component classes
   * @type {?String}
   */
  'component-class': null,

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Panel title text
   * @type {String}
   */
  title: '',

  /**
   * Panel body text
   * @type {String}
   */
  body: '',

  /**
   * Panel call to action text
   * @type {String}
   */
  'cta-text': '',

  /**
   * Panel call to action link
   * @type {String}
   */
  'cta-link': ''
});
