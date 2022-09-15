import Ember from 'ember';

/**
 * Adapter to support the Lookup API 3.0 integration
 *
 * @typedef {Object} LookupAdapter
 */
export default Ember.Object.extend({
  namespace: '/api/nucleus/v1/lookups',

  /**
   * Gets the audience list information
   * @returns {Promise.<[]>}
   */
  readAudiences: function() {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/audience`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Gets the depth of knowledge list information
   * @returns {Promise.<[]>}
   */
  readDepthOfKnowledgeItems: function() {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/dok`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Gets the depth of knowledge list information
   * @returns {Promise.<[]>}
   */
  readLicenses: function() {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/licenses`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Gets the countries information
   *
   * @param {string} keyword optional keyword
   * @returns {Promise}
   */
  readCountries: function(keyword) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/countries`;
    const data = keyword ? { keyword: keyword } : {};

    const options = {
      type: 'GET',
      //using default content type so this is serialized as query params
      headers: adapter.defineHeaders(),
      data: data
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Gets the states information
   *
   * @param {string} country id required
   * @param {string} keyword optional keyword
   * @returns {Promise}
   */
  readStates: function(countryId, keyword) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/countries/${countryId}/states`;
    const data = keyword ? { keyword: keyword } : {};

    const options = {
      type: 'GET',
      //using default content type so this is serialized as query params
      headers: adapter.defineHeaders(),
      data: data
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Gets the districts information
   *
   * @param {string} state id optional
   * @param {string} keyword optional keyword
   * @returns {Promise}
   */
  readDistricts: function(stateId, keyword) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/school-districts`;
    const data = {};

    if (keyword) {
      data.keyword = keyword;
    }

    if (stateId) {
      data.state_id = stateId;
    }

    const options = {
      type: 'GET',
      //using default content type so this is serialized as query params
      headers: adapter.defineHeaders(),
      data: data
    };
    return Ember.$.ajax(url, options);
  },

  /**
   *
   * @returns {{Authorization: string}}
   */
  defineHeaders: function() {
    return {
      Authorization: 'Token '
    };
  }
});
