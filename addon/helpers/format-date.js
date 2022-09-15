import Ember from 'ember';
import { formatDate as formatDateTo } from 'quizzes-addon/utils/utils';

/**
 * Format date
 */
export function formatDate(value /*, hash*/) {
  const date = value[0];
  const format = value.length > 1 ? value[1] : undefined;
  return formatDateTo(date, format);
}

export default Ember.Helper.helper(formatDate);
