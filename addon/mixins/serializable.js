import Ember from 'ember';

/**
 * Mixin to convert ember objects to JSON
 * Per: http://byronsalau.com/blog/convert-ember-objects-to-json/
 */
export default Ember.Mixin.create({
  serialize: function() {
    var result = {};
    var _this = $.extend(true, {}, this);

    for (var key in _this) {
      if (_this.hasOwnProperty(key)) {
        // Skip these
        if (
          key === 'isInstance' ||
          key === 'isDestroyed' ||
          key === 'isDestroying' ||
          key === 'concatenatedProperties' ||
          key === 'mergedProperties' ||
          typeof this[key] === 'function'
        ) {
          continue;
        }
        result[key] = this[key];
      }
    }
    return result;
  }
});
