import Ember from 'ember';
/**
 * Bubble component
 *
 * Component responsible for show  the question bubbles under the assessment report
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-bubbles'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Select a option in the bubble list
     * @function actions:selectBubbleOption
     * @param {Ember.Object} option i.e { label: string, status: string, value: Object, selected: boolean }
     */
    selectBubbleOption: function(option) {
      const component = this;
      component.clearSelection();
      option.set('selected', true);
      component.sendAction('onBubbleSelect', option);
    }
  },
  // -------------------------------------------------------------------------
  // Properties
  /**
   * List of options to show in bubbles
   *
   * @property {Ember.Object[]} { label: string, status: string, value: Object, selected: boolean }

   */
  bubbleOptions: null,

  // -------------------------------------------------------------------------
  // Methods
  /**
   * Clears current selection
   */
  clearSelection: function() {
    const options = this.get('bubbleOptions');
    options.forEach(function(option) {
      option.set('selected', false);
    });
  }
});
