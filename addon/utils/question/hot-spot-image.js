import MultipleAnswerUtil from 'quizzes-addon/utils/question/multiple-answer';
import AnswerObject from 'quizzes-addon/utils/question/answer-object';
/**
 * It contains convenience methods for grading and retrieving useful information
 * for HS Image
 *
 *
 * # Answer object (structure required by the BE)
 *
 *   It is an array containing a json object for each user selection, it includes all possible choices
 *   event they were not selected by the user
 *
 *   text contains the image url
 *   status could be correct, incorrect or null based on the user selection, null when no selected
 *   order represents the order of this user selection
 *   answerId corresponds to the answer choice id selected
 *   skip indicates if the option was selected or not
 *
 *
 *  [ {"text":"http//:ht_img/1.jpg","status":null,"order":1,"answerId":1234,"skip":true},
 *  {"text":"http//:ht_img/2.jpg","status":"incorrect","order":2,"answerId":1234,"skip":false},
 *  {"text":"http//:ht_img/3.jpg","status":null,"order":3,"answerId":1234,"skip":true} ]
 *
 * # User answer (structure used by the FE)
 *
 *   It corresponds to an array representing the user selection, answerIds selected
 *
 *   [ "1", "2", "6"]
 *
 * @typedef {Object} HotSpotImageUtil
 */
export default MultipleAnswerUtil.extend({
  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
  /**
   * Indicates if the answer choice is correct
   * @param { string } answerChoice
   */
  isAnswerChoiceCorrect: function(answerChoice) {
    const correctAnswer = this.getCorrectAnswer();
    return correctAnswer.includes(answerChoice);
  },

  /**
   * Gets the correct answer
   * @return {string[]} returns the correct answer choice ids
   */
  getCorrectAnswer: function() {
    const answers = this.get('question.answers');
    const correctAnswers = answers.filterBy('isCorrect', true);
    return correctAnswers.map(function(answer) {
      return answer.get('id');
    });
  },

  /**
   * Returns a unique key representing the answer
   * For hot spot image the answer is an array of ids
   * @param { string[] } answer
   * @returns {string} i.e id1,id2,id3
   */
  answerKey: function(answer) {
    return answer.sort().join();
  },

  /**
   * Converts the model user answer into an answerObject format
   *
   * @param { string[] } userAnswer
   * @return {AnswerObject[]}
   *
   * @see '# User Answer' section at class comment
   * @see '# Answer Object' section at class comment
   */
  toAnswerObjects: function(userAnswer) {
    const util = this;
    const answers = this.get('question.answers');
    return answers.map(function(answer) {
      const answerId = answer.get('id');
      const selected = userAnswer.includes(answerId);
      const answerObject = AnswerObject.create({
        text: answer.get('text'),
        order: answer.get('order'),
        answerId: answerId,
        skip: !selected
      });

      if (selected) {
        answerObject.set('correct', util.isAnswerChoiceCorrect(answerId));
      }

      return answerObject;
    });
  },

  /**
   * Converts an answerObject format to model userAnswer
   *
   * @param {AnswerObject[]} answerObjects
   * @return { string[] } answer selections
   *
   * @see '# User Answer' section at class comment
   * @see '# Answer Object' section at class comment
   */
  toUserAnswer: function(answerObjects) {
    return !answerObjects || !answerObjects.length
      ? null //if not respond is provided
      : answerObjects.filterBy('skip', false).map(function(answerObject) {
        return answerObject.get('answerId');
      });
  }
});
