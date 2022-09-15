import Ember from 'ember';

/**
 * Minus one
 */
export function minusOne(value /*, options*/) {
  return +value - 1;
}

export default Ember.Helper.helper(minusOne);
