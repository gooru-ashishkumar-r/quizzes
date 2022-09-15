import Ember from 'ember';

/**
 * Gru icon
 * Wrapper for application icons, default implementation is material-design-icons from google
 * @see application.hbs
 *
 *
 * @module
 * @typedef {object} GruIcon
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-icon', 'material-icons'],

  classNameBindings: ['name'],

  tagName: 'i',

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Icon name
   * @property {string}
   */
  name: null

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
});
