import Ember from 'ember';
import QuestionUtil from 'quizzes-addon/utils/question/question';
import AnswerObject from 'quizzes-addon/utils/question/answer-object';

/**
 * It contains convenience methods for grading and retrieving useful information
 * for multple answer questions
 *
 * # Answer object (structure required by the BE)
 *
 *   It is an array containing a json object for each user selection
 *
 *   text contains Yes or No based on user selection
 *   status could be correct or incorrect based on the user selection
 *   order represents the order of this user selection
 *   answerId corresponds to the answer choice id selected
 *   skip is always false
 *
 *  [{"text":"Yes","status":"correct","order":1,"answerId":1234,"skip":false},
 *  {"text":"Yes","status":"incorrect","order":2,"answerId":1234,"skip":false},
 *  {"text":"No","status":"incorrect","order":3,"answerId":"1234,"skip":false},
 *  {"text":"No","status":"correct","order":4,"answerId":1235,"skip":false}]
 *
 * # User answer (structure used by the FE)
 *
 *   It corresponds to an array representing the user selection
 *
 *   id represents the answerId selected
 *   selection indicates if the user selected Yes=true or No=false
 *
 *   [ { id: string, selection: boolean }, ... ]
 *
 * @typedef {Object} MultipleAnswerUtil
 */
export default QuestionUtil.extend({
  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
  /**
   * Indicates if the answer choice is correct
   * @param { { id: number, selection: boolean } } answerChoice
   *
   * @see '# User Answer' section at class comment
   */
  isAnswerChoiceCorrect: function(answerChoice) {
    const correctAnswer = this.getCorrectAnswer();
    const found = correctAnswer.filterBy('id', answerChoice.id);
    return (
      found.get('length') &&
      found.get('firstObject.selection') === answerChoice.selection
    );
  },

  /**
   * Gets the correct answer
   * It returns which is the correct selection (yes=true | no=false) for each answer choice
   * @return {Array} the correct answer for this question type [ { id: string, selection: boolean }, ... ]
   *
   * @see '# User Answer' section at class comment
   */
  getCorrectAnswer: function() {
    const answers = this.get('question.answers');
    return answers.map(function(answer) {
      return { id: answer.get('id'), selection: answer.get('isCorrect') };
    });
  },

  /**
   * Returns a unique key representing the answer
   * For multiple answer the answer is an array of { id: number, selection: boolean }
   * @param { { id: number, selection: boolean }[] } answer
   * @returns {string} i.e id_true,id_false,id_true
   *
   * @see '# User Answer' section at class comment
   */
  answerKey: function(answer) {
    const keys = Ember.A(answer).sortBy('id').map(function(item) {
      return `${item.id}_${item.selection}`;
    });
    return keys.toArray().join();
  },

  /**
   * Converts the model user answer into an answerObject format
   *
   * @param { { id: string, selection: boolean }[] } userAnswer
   * @return {AnswerObject[]}
   *
   * @see '# User Answer' section at class comment
   * @see '# Answer Object' section at class comment
   */
  toAnswerObjects: function(userAnswer) {
    const util = this;
    return userAnswer.map(function(item, index) {
      const answer = util.getAnswerById(item.id);
      const text = item.selection ? 'Yes' : 'No';
      return AnswerObject.create({
        text: text,
        correct: util.isAnswerChoiceCorrect(item),
        order: index + 1,
        answerId: answer.get('id'),
        skip: false
      });
    });
  },

  /**
   * Converts an answerObject format to model userAnswer
   *
   * @param {AnswerObject[]} answerObjects
   * @return { { id: string, selection: boolean }[] } answer selections
   *
   * @see '# User Answer' section at class comment
   * @see '# Answer Object' section at class comment
   */
  toUserAnswer: function(answerObjects) {
    return !answerObjects || !answerObjects.length
      ? null //if not respond is provided
      : answerObjects.map(function(answerObject) {
        return {
          id: answerObject.get('answerId'),
          selection: answerObject.get('text') === 'Yes'
        };
      });
  }
});
