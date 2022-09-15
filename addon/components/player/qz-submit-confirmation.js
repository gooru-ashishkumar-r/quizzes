import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-submit-confirmation'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    confirm() {
      this.sendAction('onConfirmFinish');
    },
    cancel() {
      this.sendAction('onCancelFinish');
    }
  }
});
