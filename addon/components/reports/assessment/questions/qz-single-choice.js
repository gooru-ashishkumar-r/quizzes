import Ember from 'ember';
import QuestionMixin from 'quizzes-addon/mixins/reports/assessment/questions/question';

/**
 * Single choice
 *
 * Component responsible for show the single choice answer, what option are selected
 * and the correct option.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend(QuestionMixin, {
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'questions', 'qz-single-choice'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Convenient structure to render options
   * @property {[]}
   */
  answers: Ember.computed(
    'question',
    'userAnswer',
    'question.answers.@each.text',
    'question.answers.@each.value',
    function() {
      const component = this;
      const question = component.get('question');
      let userAnswer = component.get('userAnswer')
        ? component.get('userAnswer')[0]
        : null;

      let userAnswerCorrect = question.get('correct');

      if (typeof question.get('correct') === 'string') {
        userAnswerCorrect = question.get('correct') === 'correct';
      }

      if (component.get('showCorrect')) {
        userAnswer = question.get('question.correctAnswer.firstObject');
        userAnswerCorrect = true;
      }
      const answerValue = userAnswer ? userAnswer.value : null;
      const answers = question.get('question.answers');
      return answers.map(function(answer) {
        return {
          text: answer.get('text'),
          selected: answer.get('value') === answerValue,
          correct: userAnswerCorrect
        };
      });
    }
  ),

  /**
   * @property {boolean} isChooseOne Help to handle selection for choose on question
   */
  isChooseOne: false

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
});
