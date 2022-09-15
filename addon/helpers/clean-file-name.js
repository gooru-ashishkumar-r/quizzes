import Ember from 'ember';
import { getFileNameFromInvalidUrl } from 'quizzes-addon/utils/utils';

/**
 * Clean a file name
 */
export function cleanFileName(value /*, hash*/) {
  return getFileNameFromInvalidUrl(value);
}

export default Ember.Helper.helper(cleanFileName);
