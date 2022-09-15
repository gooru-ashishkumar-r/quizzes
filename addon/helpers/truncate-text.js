import Ember from 'ember';
import { truncate as truncateString } from 'quizzes-addon/utils/utils';
/**
 * Convenience helper to truncate texts
 *
 * {{truncate text='my text' maxLength=10 type='name' suffix=true}}
 *
 * maxLength, used if type is not provided
 * type, optional parameters, indicates the type of truncation, it looks into configuration
 * suffix, default value is true, used to add ... as text suffix
 *
 * @param {[]} params
 * @param {{}} hash, it has helper parameters
 * @returns {*}
 */
export function truncateText(params, hash) {
  const text = hash.text;
  const maxLength = hash.maxLength;
  const type = hash.type;
  const suffix = hash.suffix;

  return truncateString(text, maxLength, type, suffix);
}

export default Ember.Helper.helper(truncateText);
