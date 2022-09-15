import Ember from 'ember';
/**
 * Switch component
 * Component responsible for show two options to switch
 * Use Bootstrap Toggle component that helps
 * you turn your default HTML checkboxes into toggles.
 * @see https://github.com/minhur/bootstrap-toggle/
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['qz-switch'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Select a option
     * @function actions:selectOption
     */
    selectOption: function() {
      if (this.get('isChecked')) {
        this.set('isChecked', false);
        this.sendAction('onOptionSwitch', this.get('isChecked'));
      } else {
        this.set('isChecked', true);
        this.sendAction('onOptionSwitch', this.get('isChecked'));
      }
    }
  },
  // -------------------------------------------------------------------------
  // Events

  /**
   * Overwrites didInsertElement hook.
   */
  didInsertElement: function() {
    this.$('input[type=checkbox][data-toggle^=toggle]').bootstrapToggle();
    if (this.get('isChecked')) {
      this.$('input[type=checkbox][data-toggle^=toggle]')
        .prop('checked', true)
        .change();
    } else {
      this.$('input[type=checkbox][data-toggle^=toggle]')
        .prop('checked', false)
        .change();
    }
  },
  // -------------------------------------------------------------------------
  // Properties
  /**
   * List of options to show in the switch
   *
   * @property {Array}
   */
  switchOptions: null,

  /**
   * Option in the left side of the switch
   * @property {Array} Option A
   */
  optionA: Ember.computed('switchOptions.[]', function() {
    return this.get('switchOptions')[0];
  }),
  /**
   * Option in the right side of the switch
   * @property {Array} Option B
   */
  optionB: Ember.computed('switchOptions.[]', function() {
    return this.get('switchOptions')[1];
  }),
  /**
   * Indicate if the switch is checked
   * @property {Boolean} isChecked
   */
  isChecked: false
});
