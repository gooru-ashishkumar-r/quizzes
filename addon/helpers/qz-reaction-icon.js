import Ember from 'ember';
import { getReactionIcon } from 'quizzes-addon/utils/utils';

/**
 * Get an icon depending on a emotion value (@see /app/config/config.js#L33)
 *
 * @param {Number} reactionValue
 * @returns {String} - html string
 */
export function reactionIcon(reactionValue) {
  return Ember.String.htmlSafe(getReactionIcon(reactionValue[0]));
}

export default Ember.Helper.helper(reactionIcon);
