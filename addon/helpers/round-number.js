import Ember from 'ember';
import { roundFloat } from 'quizzes-addon/utils/math';

/**
 * Return a rounded number
 */
export function roundNumber(value) {
  return roundFloat(value[0]);
}

export default Ember.Helper.helper(roundNumber);
