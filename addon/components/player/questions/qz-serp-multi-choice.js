import Ember from 'ember';

export default Ember.Component.extend({
  // --------------------------------------------------------------
  // Attributes

  // -----------------------------------------------------------------
  // Properties

  // -------------------------------------------------------------------
  // Actions
  actions: {
    onAnswerChanged(question, answer) {
      this.sendAction('onAnswerChanged', question, answer);
    },

    onAnswerCleared(question, answer) {
      this.sendAction('onAnswerCleared', question, answer);
    },

    onAnswerCompleted(question, answer) {
      this.sendAction('onAnswerCompleted', question, answer);
    },

    onAnswerLoaded(question, answer) {
      this.sendAction('onAnswerLoaded', question, answer);
    }
  }
});
