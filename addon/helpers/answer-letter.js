import Ember from 'ember';
import { getLetter } from 'quizzes-addon/utils/utils';

/**
 * Get the answer letter
 */
export function answerLetter(value) {
  return getLetter(parseInt(value[0]));
}

export default Ember.Helper.helper(answerLetter);
