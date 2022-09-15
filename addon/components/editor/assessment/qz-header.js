import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['header', 'assessment', 'edit'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    select: function(value) {
      this.set('selected', value);
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Object[]} headerActions List of action buttons to show
   */
  headerActions: [],

  /**
   * @property {Object[]} options List of tab options to show
   */
  options: [],

  /**
   * @property {String} selected Current option selected
   */
  selected: '',

  /**
   * @property {String} title Header title
   */
  title: ''
});
