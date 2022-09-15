import Ember from 'ember';

// Help to get object by index
export default Ember.Helper.helper(function([array, index]) {
  return array && array.objectAt
    ? array.objectAt(index)
    : array && array[index];
});
