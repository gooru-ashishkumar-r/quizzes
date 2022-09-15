import Ember from 'ember';
/**
 * Rubric Category model
 *
 * @typedef {Object} RubricCategory
 */
export default Ember.Object.extend({
  /**
   *Init the scoring levels default on each category
   */
  initLevels: function() {
    this.set(
      'levels',
      Ember.A([
        {
          name: '',
          score: null
        },
        {
          name: '',
          score: null
        },
        {
          name: '',
          score: null
        },
        {
          name: '',
          score: null
        },
        {
          name: '',
          score: null
        }
      ])
    );
    return this;
  },

  /**
   * @property {String} id
   */
  id: null,

  /**
   * @property {String} title
   */
  title: '',

  /**
   * @property {String} feedbackGuidance
   */
  feedbackGuidance: '',

  /**
   * @property {boolean} requiresFeedback
   */
  requiresFeedback: true,

  /**
   * @property {boolean} allowScoring
   */
  allowsScoring: false,

  /**
   * @property {boolean} allowLevel
   */
  allowsLevels: false,

  /**
   * @property {Ember.A} levels { name: string, score: number }
   */
  levels: [],

  /**
   * @property {Array} level scores
   */
  scores: Ember.computed.mapBy('levels', 'score'),

  /**
   * @property {number} total points
   */
  totalPoints: Ember.computed('scores', function() {
    return Math.max(0, ...this.get('scores'));
  }),

  /**
   * Return a copy of the category
   *
   * @function
   * @return {Category}
   */
  copy: function() {
    var properties = this.getProperties(this.modelProperties());
    // Copy array values
    properties.levels = this.get('levels').map(level =>
      JSON.parse(JSON.stringify(level))
    );
    return this.get('constructor').create(
      Ember.getOwner(this).ownerInjection(),
      properties
    );
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
      let key = enumerableKeys[i];
      let value = Ember.typeOf(this.get(key));
      if (value === 'string' || value === 'number' || value === 'boolean') {
        properties.push(key);
      }
    }
    return properties;
  }
});
