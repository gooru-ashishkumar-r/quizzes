import Ember from 'ember';
import QuestionMixin from 'quizzes-addon/mixins/reports/assessment/questions/question';

/**
 * SERP Pick N Choose
 *
 * Component responsible for show the reorder, what option are selected
 * and the correct option.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend(QuestionMixin, {
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'questions', 'qz-serp-pick-n-choose'],

  // -------------------------------------------------------------------------
  // Properties

  showCorrect: false,

  userAnswers: Ember.computed.alias('question.answer'),

  baseAnswers: Ember.computed('question.resource', function() {
    let baseAnswers = this.get('question.resource.baseAnswers');
    let answers = this.get('question.resource.answers');
    baseAnswers = baseAnswers.map((item, index) => {
      item.id = answers[index].value;
      return item;
    });
    return baseAnswers;
  })
});
