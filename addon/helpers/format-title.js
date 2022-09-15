import Ember from 'ember';

/**
 * Format title
 */
export function formatTitle([title]) {
  const matches = title ? title.match(/(https?:\/\/[^ ]*)/) : [];
  if (matches && matches.length) {
    title = matches[0];
  }
  return title;
}

export default Ember.Helper.helper(formatTitle);
