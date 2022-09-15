import Ember from 'ember';

/**
 * Level model
 * typedef {Object} Level
 */
export default Ember.Object.extend({
  /**
   * @property {string} id
   */
  id: '',
  /**
   * @property {string} Description
   */
  description: '',
  /**
   * @property {Integer} Points
   */
  points: 0,

  /**
   * Return a copy of the level
   *
   * @function
   * @return {Level}
   */
  copy: function() {
    var properties = this.getProperties(this.modelProperties());
    return this.get('constructor').create(properties);
  },

  /**
   * Copy a list of property values from another model to override the current ones
   *
   * @function
   * @param {Level} model
   * @param {String[]} propertyList
   * @return {null}
   */
  merge: function(model, propertyList = []) {
    var properties = model.getProperties(propertyList);
    this.setProperties(properties);
  },
  /**
   * Return a list of properties
   *
   * @function
   * @return {Array}
   */
  modelProperties: function() {
    var properties = [];
    const enumerableKeys = Object.keys(this);
    for (let i = 0; i < enumerableKeys.length; i++) {
      const key = enumerableKeys[i];
      const value = Ember.typeOf(this.get(key));
      if (value === 'string' || value === 'number' || value === 'boolean') {
        properties.push(key);
      }
    }
    return properties;
  }
});
