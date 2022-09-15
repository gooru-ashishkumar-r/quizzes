import Ember from 'ember';
import Level from 'quizzes-addon/models/editor/assessment/level';

/**
 * Category model
 * typedef {Object} Category
 */
export default Ember.Object.extend({
  /**
   *Init the scoring levels default on each category
   */
  initLevels: function() {
    this.set(
      'scoringLevels',
      Ember.A([
        Level.create({
          id: 'exemplary'
        }),
        Level.create({
          id: 'proficient'
        }),
        Level.create({
          id: 'basic'
        }),
        Level.create({
          id: 'below-basic'
        })
      ])
    );
    return this;
  },
  /**
   * @property {string} Category Title
   */
  title: '',
  /**
   * @property {string} Feedback guidance
   */
  feedbackGuidance: '',
  /**
   * @property {Boolean} Required Feedback
   */
  requiredFeedback: false,
  /**
   * @property {Array[Levels]} scoringLevels
   */
  scoringLevels: Ember.A([]),
  /**
   * Return a copy of the category
   *
   * @function
   * @return {Category}
   */
  copy: function() {
    var properties = this.getProperties(this.modelProperties());
    // Copy array values
    properties.scoringLevels = this.get('scoringLevels').map(level =>
      level.copy()
    );
    return this.get('constructor').create(properties);
  },

  /**
   * Copy a list of property values from another model to override the current ones
   *
   * @function
   * @param {Category} model
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
