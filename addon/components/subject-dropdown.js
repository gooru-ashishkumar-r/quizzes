import Ember from 'ember';
import DropdownItem from 'quizzes-addon/utils/dropdown-item';

/**
 * @typedef {object} SubjectDropdown
 */
export default Ember.Component.extend({
  /**
   *
   * @property {string} size class
   * @see bootstrap button dropdown
   */
  'btn-group-size': 'btn-group-lg',
  /**
   * @property {[]} subjects
   */
  subjects: null,

  /**
   * @property {string} on change action
   */
  onChangeAction: null,

  dropdownItems: function() {
    const subjects = this.get('subjects');
    return subjects.map(function(subject) {
      return DropdownItem.create({
        id: subject.get('libraryId'),
        label: subject.get('label'),
        data: subject
      });
    });
  }.property('subjects.[]'),

  actions: {
    onChange: function(items) {
      this.sendAction('onChangeAction', items);
    }
  }
});
