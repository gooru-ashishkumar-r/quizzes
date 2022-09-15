import Ember from 'ember';
import QuestionMixin from 'quizzes-addon/mixins/reports/assessment/questions/question';

/**
 * Fill in the blank
 *
 * Component responsible for controlling the logic and appearance of a fill in the blank
 * question inside of the assessment report.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend(QuestionMixin, {
  // -------------------------------------------------------------------------
  // Attributes

  classNames: [
    'reports',
    'assessment',
    'questions',
    'qz-scientific-free-response'
  ],

  // -------------------------------------------------------------------------
  // Properties

  userAnswers: Ember.computed('userAnswer', function() {
    const component = this;
    let userAnswers = Ember.A([]);
    let userAnswer = component.get('userAnswer');
    userAnswer.map(answer => {
      let answerValue = answer.value.split(':');
      userAnswers.pushObject({
        category: answerValue[0],
        value: answerValue[1]
      });
    });
    return userAnswers;
  }),

  /**
   * Return an array with every sentence and user answer, and indicate if is correct or incorrect
   * @return {Array}
   */
  answer: Ember.computed('question', 'userAnswers', function() {
    const component = this;
    const question = component.get('question');
    const questionText = question.get('question.answerDetails');
    let userAnswers = component.get('userAnswers');
    const answers = userAnswers.map(function(answer) {
      const userAnswer = answer.value.trim().toLowerCase();
      return {
        text: userAnswer,
        class: 'answer'
      };
    });

    let sentences = questionText.map(function(questionTextPart) {
      return {
        category: questionTextPart.answer_category,
        class: 'sentence'
      };
    });
    sentences = userAnswers && userAnswers.length ? sentences : [];

    return this.mergeArrays(sentences, answers);
  }),

  // -------------------------------------------------------------------------
  // Methods
  /**
   * Merge sentences and answers arrays
   * @return {Array}
   */
  mergeArrays: function(sentences, answers) {
    let mergeArrays = Ember.A();
    answers.forEach(function(item, index) {
      mergeArrays.pushObject(sentences.get(index));
      mergeArrays.pushObject(item);
    });
    mergeArrays.pushObject(answers);
    return mergeArrays;
  }
});
