import HotSpotImageUtil from 'quizzes-addon/utils/question/hot-spot-image';
/**
 * It contains convenience methods for grading and retrieving useful information
 * for HS Text type
 *
 * # Answer object (structure required by the BE)
 *
 *   It is an array containing a json object for each user selection, it includes all possible choices
 *   event they were not selected by the user
 *
 *   text contains the text
 *   status could be correct, incorrect or null based on the user selection, null when no selected
 *   order represents the order of this user selection
 *   answerId corresponds to the answer choice id selected
 *   skip indicates if the option was selected or not
 *
 *   [{"text":"bird","status":null,"order":1,"answerId":1234,"skip":true},
 *    {"text":"mango","status":"correct","order":2,"answerId":1234,"skip":false},
 *    {"text":"coconut","status":"incorrect","order":3,"answerId":1234,"skip":false}]
 *
 * # User answer (structure used by the FE)
 *
 *   It corresponds to an array representing the user selection, answerIds selected
 *
 *   [ "1", "2", "6"]
 *
 * @typedef {Object} HotSpotTextUtil
 */
export default HotSpotImageUtil.extend(
  {
    // -------------------------------------------------------------------------
    // Observers
    // -------------------------------------------------------------------------
    // Methods
  }
);
