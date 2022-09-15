import Ember from 'ember';

/**
 * Convert text to be html safe
 */
export function safeHtml(value) {
  return Ember.String.htmlSafe(value);
}

export default Ember.Helper.helper(safeHtml);
