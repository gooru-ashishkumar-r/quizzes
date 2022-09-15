import Ember from 'ember';
/**
 *Bubble Chart
 *
 * Component responsible for showing the bubble chart.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['charts', 'gru-bubble-chart'],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {String} content - chart content
   */
  content: null,

  /**
   * @property {String} color - chart color
   */
  color: null,

  /**
   * @property {String} style - style safe string for template
   */
  style: Ember.computed('color', function() {
    return Ember.String.htmlSafe(`background-color: ${this.get('color')}`);
  })
});
