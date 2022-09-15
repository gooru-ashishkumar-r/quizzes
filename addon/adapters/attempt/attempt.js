import TokenMixin from 'quizzes-addon/mixins/token';
import ApplicationAdapter from 'quizzes-addon/adapters/application';

export default ApplicationAdapter.extend(TokenMixin, {
  /**
   * @property {Object} namespace base url for attempts endpoints
   */
  namespace: '/quizzes/api/v1/attempts',

  /**
   * Get data to show on the real time report
   * @param {String} contextId
   * @returns {Promise}
   */
  getReportData: function(contextId) {
    const namespace = this.get('namespace');
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      headers: this.get('headers')
    };
    const url = `${namespace}/contexts/${contextId}`;
    return this.sendAjaxRequest(url, options);
  },

  /**
   * Get attempt data for report
   * @param {String} attemptId
   * @returns {Promise}
   */
  getAttemptData: function(attemptId) {
    const namespace = this.get('namespace');
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      headers: this.get('headers')
    };
    const url = `${namespace}/${attemptId}`;
    return this.sendAjaxRequest(url, options);
  },

  /**
   * Get all attempt ids by context and profile id
   * @param {String} contextId
   * @param {String} profileId
   * @returns {Promise}
   */
  getAttemptIds: function(contextId, profileId) {
    const namespace = this.get('namespace');
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      headers: this.get('headers')
    };
    const url = `${namespace}/contexts/${contextId}/profiles/${profileId}`;
    return this.sendAjaxRequest(url, options);
  }
});
