import Ember from 'ember';
import QuestionUtil from 'quizzes-addon/utils/question/question';
import AnswerObject from 'quizzes-addon/utils/question/answer-object';
/**
 * It contains convenience methods for grading and retrieving useful information
 * for Open Ended questions
 *
 * # Answer object (structure required by the BE)
 *
 *   It is an array containing a single json object
 *
 *   text contains the text entered by the user
 *   status is always null
 *   order is always 0
 *   answerId is always 0
 *   skip is always false
 *
 *  [{“text”:”Some text here”,”status”:null,”order”:0,”answerId”:0,”skip”:false}]
 *
 * # User answer (structure used by the FE)
 *
 *   It is an string representing the text entered by the user
 *
 *  "Some text here"
 *
 * @typedef {Object} OpenEndedUtil
 */
export default QuestionUtil.extend({
  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
  /**
   * Indicates if the answer is correct
   * It overrides the default implementation
   *
   * @param {string} answer
   * @return {boolean}
   *
   * @see '# User Answer' section at class comment
   *
   */
  isCorrect: function(answer) {
    return !!answer; //if answer exists, OE is not graded right now
  },

  /**
   * Gets the correct answer
   *
   * @return {boolean} the correct answer choice id
   */
  getCorrectAnswer: function() {
    return false; //there is no correct answer for OE
  },

  /**
   * Returns a unique key representing the answer
   * @param {string} answer
   * @returns {string}
   *
   * @see '# User Answer' section at class comment
   */
  answerKey: function(answer) {
    return answer;
  },

  /**
   * Converts the model user answer into an answerObject format
   *
   * @param {string} userAnswer
   * @return {AnswerObject[]}
   *
   * @see '# User Answer' section at class comment
   * @see '# Answer Object' section at class comment
   *
   */
  toAnswerObjects: function(userAnswer) {
    const answerObject = AnswerObject.create({
      text: userAnswer,
      status: null,
      order: 0,
      answerId: 0,
      skip: false
    });
    return Ember.A([answerObject]);
  },

  /**
   * Converts an answerObject format to model userAnswer
   *
   * @param {AnswerObject[]} answerObjects
   * @return {string} answer
   *
   * @see '# User Answer' section at class comment
   * @see '# Answer Object' section at class comment
   */
  toUserAnswer: function(answerObjects) {
    let userAnswer = null;
    if (answerObjects.get('length')) {
      const answerObject = answerObjects.get('firstObject');
      userAnswer = answerObject.get('text');
    }

    return userAnswer;
  }
});
