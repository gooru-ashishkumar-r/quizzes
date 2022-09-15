import Ember from 'ember';

/**
 * Gru spinner button
 * Component responsible to show the spinner button while it is waiting for a response from the server.
 *
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-spinner-button'],

  tagName: 'div',

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Class names
   * @property {string}
   */
  classes: null,
  /**
   * isLoading
   * @property {boolean}
   */
  isLoading: false

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
});
