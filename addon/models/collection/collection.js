import Ember from 'ember';
import { ASSESSMENT_SHOW_VALUES } from 'quizzes-addon/config/quizzes-config';

/**
 * @typedef {Object} Collection
 */

export default Ember.Object.extend({
  /**
   * @property {number} Attempts allowed
   */
  attempts: Ember.computed.alias('settings.attempts'),

  /**
   * @property {string} Collection avatar
   */
  avatarUrl: null,

  /**
   * @property {boolean} Bidirectional
   */
  bidirectional: Ember.computed.alias('settings.bidirectional'),

  /**
   * @property {string}
   */
  id: null,

  /**
   * @property {boolean} hasResources
   */
  hasResources: Ember.computed.bool('resources.length'),

  content: Ember.A([]),

  /**
   * @property {boolean} Return true if the collection is an assessment
   */
  isAssessment: Ember.computed.not('isCollection'),

  /**
   * @property {boolean} Returns true if the collection type is collection
   */
  isCollection: null,

  /**
   * @property {boolean} Returns true if the assessment has immediate feedback setting
   */
  immediateFeedback: Ember.computed('showFeedback', function() {
    return this.get('showFeedback') === ASSESSMENT_SHOW_VALUES.IMMEDIATE;
  }),
  /**
   * @property {Profile} Collection owner profile
   */
  owner: null,

  /**
   * @property {[]}
   */
  questions: [],

  /**
   * @property {number} Total of resources in the collection
   */
  resourceCount: Ember.computed.readOnly('resources.length'),

  /**
   * @property {Array} List of resources associated to the collection
   */
  resources: Ember.A(),

  /**
   * @property {Array} List of resources associated to the collection
   */
  resourcesSorted: Ember.computed('resources', function() {
    const resources = this.get('resources').sortBy('sequence');
    resources.forEach((resource, index) => resource.set('sequence', index + 1));
    return resources;
  }),

  /**
   * @property {Object}
   */
  settings: null,

  /**
   * @property {string} Indicate if show answer key setting
   */
  showFeedback: Ember.computed.alias('settings.showFeedback'),

  /**
   * @property {boolean} Indicate if show answer key setting
   */
  showKey: Ember.computed.alias('settings.showKey'),

  /**
   * @property {string} Collection's title
   */
  title: null,

  /**
   * Gets the next resource based on the resource provided
   * @param {Resource} resource
   * @returns {Resource|undefined} next resource
   */
  nextResource: function(resource) {
    let next;
    if (this.get('hasResources')) {
      const resources = this.get('resourcesSorted'),
        index = resources.indexOf(resource);
      next = resources.objectAt(index + 1);
    }
    return next;
  },

  /**
   * Gets the previous resource based on the resource provided
   * @param {Resource} resource
   * @returns {Resource|undefined} previous resource
   */
  prevResource: function(resource) {
    let next;
    if (this.get('hasResources')) {
      const resources = this.get('resourcesSorted'),
        index = resources.indexOf(resource);
      next = resources.objectAt(index - 1);
    }
    return next;
  },

  /**
   * Gets the resource by id
   * @param {string }resourceId
   * @returns {Resource|undefined}
   */
  getResourceById: function(resourceId) {
    let resource;
    if (this.get('hasResources')) {
      const resources = this.get('resources').filterBy('id', resourceId);
      if (resources.length) {
        resource = resources[0];
      }
    }
    return resource;
  },

  /**
   * Returns true if it's the last resource of the collection
   * @param {Resource}resource
   * @returns {Resource|undefined}
   */
  isLastResource: function(resource) {
    const resources = this.get('resources');
    var index = resources.indexOf(resource);
    var collectionLength = this.get('resourceCount');
    return index + 1 === collectionLength;
  }
});
