import Ember from 'ember';
import { formatTime as formatMilliseconds } from 'quizzes-addon/utils/utils';

/**
 * Format a timestamp
 */
export function formatTime(value /*, hash*/) {
  var time = value[0];
  return formatMilliseconds(time);
}

export default Ember.Helper.helper(formatTime);
