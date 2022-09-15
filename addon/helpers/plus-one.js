import Ember from 'ember';

/**
 * Add one to a number
 */
export function plusOne(value /*, options*/) {
  return parseInt(value) + 1;
}

export default Ember.Helper.helper(plusOne);
