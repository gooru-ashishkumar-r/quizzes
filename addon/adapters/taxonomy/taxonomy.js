import TokenMixin from 'quizzes-addon/mixins/token';
import Ember from 'ember';

/**
 * Adapter for Taxonomy endpoints
 *
 * @typedef {Object} TaxonomyAdapter
 */
export default Ember.Object.extend(TokenMixin, {
  namespace: '/api/nucleus/v1/taxonomy',

  /**
   * Fetches the Taxonomy Subjects for the specific type
   *
   * @param category - The classification type
   * @returns {Promise}
   */
  fetchSubjects: function(category) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/subjects`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders(),
      data: {
        classification_type: category
      }
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Fetches the Taxonomy Courses
   *
   * @param frameworkId - the framework ID
   * @param subjectId - the taxonomy subject ID
   * @returns {Promise}
   */
  fetchCourses: function(frameworkId, subjectId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/frameworks/${frameworkId}/subjects/${subjectId}/courses`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders(),
      data: {}
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Fetches the Taxonomy Domains
   *
   * @param frameworkId - the framework ID
   * @param subjectId - the taxonomy subject ID
   * @param courseId - the taxonomy course ID
   * @returns {Promise}
   */
  fetchDomains: function(frameworkId, subjectId, courseId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/frameworks/${frameworkId}/subjects/${subjectId}/courses/${courseId}/domains`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders(),
      data: {}
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Fetches the Taxonomy Codes
   *
   * @param frameworkId - the framework ID
   * @param subjectId - the taxonomy subject ID
   * @param courseId - the taxonomy course ID
   * @param domainId - the taxonomy domain ID
   * @returns {Promise}
   */
  fetchCodes: function(frameworkId, subjectId, courseId, domainId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/frameworks/${frameworkId}/subjects/${subjectId}/courses/${courseId}/domains/${domainId}/codes`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders(),
      data: {}
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Fetches the Taxonomy Codes by a provided list of IDs
   *
   * @param codesIds - the list of codes IDs
   * @returns {Promise}
   */
  fetchCodesByIds: function(codesIds) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/codes`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders(),
      data: {
        idList: codesIds.join(',')
      }
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Fetches the crosswalk competency based on the class framework
   *
   * @param framework- The class framework
   * @param competency- competency array
   * @returns {Promise}
   */
  crosswalkCompetency: function(framework, competencies) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/framework/crosswalk/competency/${framework}`;
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      headers: this.get('headers'),
      data: JSON.stringify({
        codes: competencies
      })
    };
    // options.data = Object.assign(options.data, filter);
    return Ember.$.ajax(url, options);
  },

  defineHeaders: function() {
    return {
      Authorization: 'Token '
    };
  }
});
