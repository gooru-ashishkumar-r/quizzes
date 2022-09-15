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

  classNames: ['reports', 'assessment', 'questions', 'qz-hs-text'],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Return the hot spot answers to show on the component, indicating if the user select the answer and
   * if is correct or not.
   */
  answers: Ember.computed('question', 'anonymous', function() {
    const component = this;
    const question = component.get('question');
    let userAnswers = component.get('userAnswer');
    const correctAnswers = question.get('question.correctAnswer');
    const anonymous = component.get('anonymous');
    const answers = question.get('question.answers');
    return answers.map(function(answer) {
      let userAnswerCorrect = false;
      let selected = false;
      if (component.get('showCorrect')) {
        userAnswers = question.get('question.correctAnswer');
        if (userAnswers.findBy('value', answer.value)) {
          userAnswerCorrect = correctAnswers.findBy('value', answer.value);
          selected = true;
        }
      }
      if (userAnswers.findBy('value', answer.value)) {
        userAnswerCorrect = correctAnswers.findBy('value', answer.value);
        selected = true;
      }
      const elementClass = anonymous
        ? 'anonymous'
        : userAnswerCorrect
          ? 'correct'
          : 'incorrect';
      return {
        text: answer.get('text'),
        selected,
        class: elementClass
      };
    });
  })
});
