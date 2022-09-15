import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------
  // Attributes
  classNames: ['reports', 'assessment', 'questions', 'qz-comprehension'],

  // -------------------------------------------------------------
  // Properties

  showCorrect: false,

  showPerformance: true,

  question: null,

  subQuestions: Ember.computed('question', function() {
    return this.get('question.resource.subResource') || Ember.A([]);
  })

  // --------------------------------------------------------------
  // Hooks

  // -------------------------------------------------------------
  // Methods
});
