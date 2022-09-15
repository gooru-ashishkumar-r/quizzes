import Ember from 'ember';
/**
 * Rubric model
 *
 * @typedef {Object} Rubric
 */
export default Ember.Object.extend({
  /**
   * @property {String} id
   */
  id: null,

  /**
   * @property {String} title
   */
  title: null,

  /**
   * @property {String} description
   */
  description: null,

  /**
   * @property {String} thumbnail
   */
  thumbnail: null,

  /**
   * @property {TaxonomyRoot} Taxonomy primary subject
   */
  subject: null,

  /**
   * @property {Number[]} Array with the audience ids
   */
  audience: Ember.A([]),

  /**
   * @property {boolean}
   */
  hasAudience: Ember.computed.bool('audience.length'),

  /**
   * @property {Boolean} isPublished
   */
  isPublished: null,

  /**
   * @property {Date} Date in which the rubric was published
   */
  publishDate: null,

  /**
   * @property {RubricCategory[]}
   */
  categories: Ember.A([]),

  /**
   * @property {boolean}
   */
  hasCategories: Ember.computed.bool('categories.length'),

  /**
   * @property {string} rubric url when uploading a file
   */
  url: null,

  /**
   * @property {boolean} true when a rubric file is uploaded
   */
  uploaded: false,

  /**
   * @property {string} feedback guidance
   */
  feedback: null,

  /**
   * @property {TaxonomyTagData[]} Rubric standards array
   */
  standards: Ember.A([]),

  /**
   * @property {Array} Categories total points
   */
  categoriesPoints: Ember.computed.mapBy('categories', 'totalPoints'),

  /**
   * @property {number} total points
   */
  totalPoints: Ember.computed.sum('categoriesPoints'),

  /**
   * @property {boolean} true when the rubric requires feedback
   */
  requiresFeedback: true,

  /**
   * @property {boolean} Indicate if a Rubric at question level is ON or not
   */
  rubricOn: false,

  /**
   * @property {string} mimeType
   */
  mimeType: 'application/pdf,image/*',

  /**
   * @property {String} owner id
   */
  owner: null,

  /**
   * @property {Date} Date in which the rubric was created
   */
  createdDate: null,

  /**
   * @property {Date} Date in which the rubric was updated
   */
  updatedDate: null,

  /**
   * @property {String} Rubric tenant id
   */
  tenant: null,

  /**
   * @property {Boolean} Is scoring allowed
   */
  scoring: null,

  /**
   * @property {Integer} Max score for the rubric
   */
  maxScore: null,

  /**
   * @property {Number} Increment factor for score
   */
  increment: null,

  /**
   * @property {String} Self or Teacher
   */
  grader: null,

  /**
   * Return a copy of the category
   *
   * @function
   * @return {Category}
   */
  copy: function() {
    var properties = this.getProperties(this.modelProperties());
    properties.categories = this.get('categories')
      ? this.get('categories').map(category => category.copy())
      : null;
    var audience = this.get('audience');
    var standards = this.get('standards');
    properties.audience = audience ? audience.slice(0) : null;
    properties.standards = standards.slice(0);
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
