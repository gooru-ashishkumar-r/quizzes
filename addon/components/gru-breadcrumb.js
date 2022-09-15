import Ember from 'ember';

/**
 * Breadcrumb component
 *
 * Component responsible for controlling the logic and appearance of a breadcrumb element
 * This component can be reused across the entire application and can be styled as needed,
 * functionality should remain the same
 *
 * @module
 * @augments Ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-breadcrumb'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * selectItem selects breadcrumb item
     */
    selectItem: function(item) {
      this.sendAction('onSelectedItem', item);
    }
  },

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties
  /**
   * The breadcrumb items
   * @property {{ value: string, label: string }[]} items
   */
  items: Ember.A(),

  /**
   * @property {String|Function} onItemSelected - event handler for when an item is selected
   */
  onItemSelected: null,

  /**
   * Determine the column class name based on the length of items
   */
  itemClassName: Ember.computed('items.[]', function() {
    const length = this.get('items.length');
    return `breadcrumb-col-${length}`;
  })

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
});
