import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-assign-student-modal'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Close Modal
     */
    closeModal: function() {
      this.triggerAction({ action: 'closeModal' });
    },
    /**
     * Update Assignment
     */
    updateAssignment: function(assignment) {
      this.get('model').callback.success(assignment);
      this.triggerAction({ action: 'closeModal' });
    }
  },
  // -------------------------------------------------------------------------
  // Properties

  /**
   * Model object
   */
  model: null
});
