import Ember from 'ember';
import QuestionMixin from 'quizzes-addon/mixins/reports/assessment/questions/question';

/**
 * Single choice
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

  classNames: ['reports', 'assessment', 'questions', 'qz-reorder'],
  showCorrect: false,

  // -------------------------------------------------------------------------
  // Properties
  /**
   * Return the drag and drop answers to show on the component, if is show correct: return the list
   * whit the correct answers, if not return the answers with the order as the user answered and if is correct or not.
   */
  answers: Ember.computed(
    'question',
    'userAnswer',
    'showCorrect',
    'question.answers.@each.text',
    'question.answers.@each.value',
    function() {
      const component = this;
      const question = component.get('question');
      let userAnswers = component.get('userAnswer') || [];
      const correctAnswers = question.get('question.correctAnswer');

      const answers = question.get('question.answers');

      let userAnswersWithText = userAnswers.map(function(userAns) {
        let userAnsText = answers.findBy('value', userAns.value).text;
        return {
          value: userAns.value,
          userAnsText: userAnsText
        };
      });

      return answers.map(function(answer, inx) {
        const userAnswer = userAnswers.findBy('value', answer.value) || {};
        const correctAnswer = correctAnswers.findBy('value', userAnswer.value);
        const correct =
          correctAnswer &&
          correctAnswers.indexOf(correctAnswer) ===
            userAnswers.indexOf(userAnswer);
        return {
          showCorrect: component.get('showCorrect'),
          selectedOrderText:
            userAnswersWithText &&
            userAnswersWithText.length > 0 &&
            userAnswersWithText[inx].userAnsText,
          selectedOrder: userAnswers.indexOf(userAnswer) + 1,
          text: answer.get('text'),
          correct
        };
      });
    }
  )
});
