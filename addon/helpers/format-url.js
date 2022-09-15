import Ember from 'ember';

/**
 * Format date
 */
export function formatUrl([value]) {
  const matches = value ? value.match(/(https?:\/\/[^ ]*)/) : [];
  if (matches && matches.length) {
    value = matches[0];
  }
  return value;
}

export default Ember.Helper.helper(formatUrl);
