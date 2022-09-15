import Ember from 'ember';

/**
 *Question-xs
 *
 * Component responsible for showing the question details for xsmall devices.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'qz-questions-xs'],
  // -------------------------------------------------------------------------
  // Properties

  /**
   * Question to be displayed by the component
   *
   * @property {Ember.Object}
   */
  question: null,

  /**
   * Indicate if the table show the performance columns
   *
   * @property {Boolean}
   */
  showPerformance: true
});
