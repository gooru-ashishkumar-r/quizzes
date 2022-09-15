import Ember from 'ember';

/**
 * Return a string if two values are the same
 *
 * @param {String[]} value
 * value[0] - string to return if two values are the same
 * value[1] - first value to compare
 * value[2] - second value to compare
 *
 * @return {String}
 */
export function setIfEqual(value /*, options */) {
  const classToAdd = value[0];
  const valueA = value[1];
  const valueB = value[2];
  var result = '';

  if (valueA === valueB) {
    result = classToAdd;
  }
  return result;
}

export default Ember.Helper.helper(setIfEqual);
