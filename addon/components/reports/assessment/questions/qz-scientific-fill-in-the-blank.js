import Ember from 'ember';
import QuestionMixin from 'quizzes-addon/mixins/reports/assessment/questions/question';
import { FIB_REGEX } from 'quizzes-addon/config/quizzes-config';

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
    'qz-scientific-fill-in-the-blank'
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
  answer: Ember.computed(
    'question',
    'anonymous',
    'userAnswers',
    'question.answers.@each.value',
    function() {
      const component = this;
      const question = component.get('question');
      let userAnswers = component.get('userAnswers');
      let answerDetails = question.get('question.answerDetails');
      let answerData = answerDetails.map(function(answerDetail) {
        let questionTextParts = answerDetail.answer_text.split(FIB_REGEX);
        let userAnswerValue = userAnswers.filterBy(
          'category',
          answerDetail.answer_category
        );
        let answers = userAnswerValue.map(function(answer) {
          return {
            text: answer.value !== '' ? answer.value : ' ',
            class: 'answer'
          };
        });

        let sentences = questionTextParts.map(function(questionTextPart) {
          return {
            text: questionTextPart,
            class: 'sentence'
          };
        });
        sentences = userAnswerValue && userAnswerValue.length ? sentences : [];

        return component.mergeArrays(
          sentences,
          answers,
          answerDetail.answer_category
        );
      });
      return answerData;
    }
  ),

  // -------------------------------------------------------------------------
  // Methods
  /**
   * Merge sentences and answers arrays
   * @return {Array}
   */
  mergeArrays: function(sentences, answers, category) {
    let mergeArrays = Ember.A();
    answers.forEach(function(item, index) {
      mergeArrays.pushObject(sentences.get(index));
      mergeArrays.pushObject(item);
    });
    mergeArrays.pushObject(sentences[sentences.length - 1]);
    let answerByCategory = Ember.Object.create({
      category: category,
      value: mergeArrays
    });
    return answerByCategory;
  }
});
