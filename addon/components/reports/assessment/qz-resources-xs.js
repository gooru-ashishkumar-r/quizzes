import Ember from 'ember';

/**
 *Resource-xs
 *
 * Component responsible for showing the resoruce details for xsmall devices.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'qz-resources-xs'],
  // -------------------------------------------------------------------------
  // Properties

  /**
   * Resource to be displayed by the component
   *
   * @property {Ember.Object}
   */
  resource: null
});
