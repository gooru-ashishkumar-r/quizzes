import Ember from 'ember';
import QuestionMixin from 'quizzes-addon/mixins/reports/assessment/questions/question';

/**
 * Multiple answer
 *
 * Component responsible for show the multiple answer, which option is selected
 * and the correct option.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend(QuestionMixin, {
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'questions', 'qz-multiple-answer'],

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
      let userAnswers = component.get('userAnswer') || [];
      const correctAnswers = question.get('question.correctAnswer');
      if (component.get('showCorrect')) {
        userAnswers = correctAnswers;
      }

      const answers = question.get('question.answers');
      return answers.map(answer => {
        const userAnswer = userAnswers.filterBy('value', answer.value) || [];
        const correctAnswer = correctAnswers.filterBy('value', answer.value);
        const correct = userAnswer.length === correctAnswer.length;
        return {
          text: answer.text,
          selected: !!userAnswer.length,
          correct
        };
      });
    }
  )

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
});
