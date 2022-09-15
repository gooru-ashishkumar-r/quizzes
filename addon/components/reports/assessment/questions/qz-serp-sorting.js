import Ember from 'ember';
import QuestionMixin from 'quizzes-addon/mixins/reports/assessment/questions/question';

/**
 * Hot spot text
 *
 * Component responsible for show the hot spot text, which option is selected
 * and the correct option.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend(QuestionMixin, {
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'questions', 'qz-serp-sorting'],

  // -------------------------------------------------------------------------
  // Properties

  showCorrect: false,

  baseAnswers: Ember.computed.alias('question.resource.baseAnswers'),

  userAnswers: Ember.computed('question.answer', function() {
    return this.get('question.answer').map(item => {
      return JSON.parse(item.value)[0] || '';
    });
  }),

  answerDetails: Ember.computed('baseAnswers', 'userAnswers', function() {
    let answerDetails = this.get('showCorrect')
      ? this.get('baseAnswers')
      : this.get('userAnswers');
    return answerDetails.sortBy('sequence');
  })
});
