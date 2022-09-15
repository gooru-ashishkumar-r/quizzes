import Ember from 'ember';

/**
 * @typedef {object} DropdownItem
 */
export default Ember.Object.extend({
  /**
   * @property {string} identifier
   */
  id: null,

  /**
   * @property {string} label
   */
  label: null,

  /**
   * @property {bool} disabled
   */
  disabled: false,

  /**
   * @property {bool} selected
   */
  selected: false,

  /**
   * @property {object} data
   */
  data: null
});
