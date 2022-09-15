import Ember from 'ember';
import DropdownItem from 'quizzes-addon/utils/dropdown-item';

/**
 * @typedef {object} StandardDropdown
 */
export default Ember.Component.extend({
  /**
   *
   * @property {string} size class
   * @see bootstrap button dropdown
   */
  'btn-group-size': 'btn-group-lg',
  /**
   * @property {[]} standards
   */
  standards: Ember.A(),

  /**
   * Triggered when selecting an standard from the dropdown
   * @property {string} standard selected action
   */
  onStandardSelectedAction: null,

  /**
   * @property {DropdownItem[]} items
   */
  dropdownItems: function() {
    const standards = this.get('standards');
    return standards.map(function(standard) {
      return DropdownItem.create({
        data: standard,
        id: standard.get('id'),
        label: standard.get('name'),
        disabled: standard.get('disabled')
      });
    });
  }.property('standards'),

  actions: {
    onStandardSelected: function(items) {
      this.sendAction('onStandardSelectedAction', items);
    }
  }
});
