import Ember from 'ember';
import LookupSerializer from 'quizzes-addon/serializers/lookup/lookup';
import LookupAdapter from 'quizzes-addon/adapters/lookup/lookup';

/**
 * Service to support the Lookup entities
 *
 * Country, State, District
 *
 * @typedef {Object} LookupService
 */
export default Ember.Service.extend({
  lookupSerializer: null,

  lookupAdapter: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'lookupSerializer',
      LookupSerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'lookupAdapter',
      LookupAdapter.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Gets the audience information
   * @returns {Promise.<Audience[]>}
   */
  readAudiences: function() {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('lookupAdapter').readAudiences().then(function(response) {
        resolve(
          service.get('lookupSerializer').normalizeReadAudiences(response)
        );
      }, reject);
    });
  },

  /**
   * Gets the depth of knowlege information
   * @returns {Promise.<DepthOfKnowledge[]>}
   */
  readDepthOfKnowledgeItems: function() {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('lookupAdapter')
        .readDepthOfKnowledgeItems()
        .then(function(response) {
          resolve(
            service
              .get('lookupSerializer')
              .normalizeReadDepthOfKnowledgeItems(response)
          );
        }, reject);
    });
  },

  /**
   * Gets the license information
   * @returns {Promise.<License[]>}
   */
  readLicenses: function() {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('lookupAdapter').readLicenses().then(function(response) {
        resolve(
          service.get('lookupSerializer').normalizeReadLicenses(response)
        );
      }, reject);
    });
  },

  /**
   * Gets the audience information
   * @returns {Promise.<Audience[]>}
   */
  readAudienceItems: function() {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('lookupAdapter').readAudienceItems().then(function(response) {
        resolve(response);
        //resolve(service.get('lookupSerializer').normalizeReadCountries(response));
      }, reject);
    });
  },

  /**
   * Gets the countries information
   * @param {string} keyword optional
   *
   * @returns {Promise}
   */
  readCountries: function(keyword) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('lookupAdapter')
        .readCountries(keyword)
        .then(function(response) {
          resolve(
            service.get('lookupSerializer').normalizeReadCountries(response)
          );
        }, reject);
    });
  },

  /**
   * Gets the states information
   * @param {string} country id
   * @param {string} keyword optional
   *
   * @returns {Promise}
   */
  readStates: function(countryId, keyword) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('lookupAdapter')
        .readStates(countryId, keyword)
        .then(function(response) {
          resolve(
            service.get('lookupSerializer').normalizeReadStates(response)
          );
        }, reject);
    });
  },

  /**
   * Gets the districts information
   * @param {string} stateId
   * @param {string} keyword optional
   *
   * @returns {Promise}
   */
  readDistricts: function(stateId, keyword) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('lookupAdapter')
        .readDistricts(stateId, keyword)
        .then(function(response) {
          resolve(
            service.get('lookupSerializer').normalizeReadDistricts(response)
          );
        }, reject);
    });
  }
});
