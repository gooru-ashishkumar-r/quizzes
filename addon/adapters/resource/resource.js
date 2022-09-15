import TokenMixin from 'quizzes-addon/mixins/token';
import ApplicationAdapter from 'quizzes-addon/adapters/application';

export default ApplicationAdapter.extend(TokenMixin, {
  /**
   * @property {string} namespace Nile End-point URI
   */
  namespace: '/api/nucleus/v1/resources',

  /**
   * @property {string} namespaceQuizzes End-point URI
   */
  namespaceQuizzes: '/quizzes/api/v1/resources',

  /**
   * @property {string} xAPINamespace Nile End-point URI
   */
  xAPINamespace: '/api/v1/xapi',

  /**
   * Finish resource event
   *
   * @param {string} resourceId
   * @param {string} resourceEventData
   * @param {string} eventContext
   * @returns {Promise}
   */
  sendFinishResource: function(resourceId, resourceEventData, eventContext) {
    const adapter = this;
    const namespace = adapter.get('namespaceQuizzes');
    const url = `${namespace}/${resourceId}/finish`;
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      headers: this.get('headers'),
      data: JSON.stringify({ resourceEventData, eventContext })
    };
    return this.sendAjaxRequest(url, options);
  },

  /**
   * Reads a resource by id
   *
   * @param {string} resourceId
   * @returns {Promise}
   */
  readResource: function(resourceId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${resourceId}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: this.get('headers')
    };
    return this.sendAjaxRequest(url, options);
  },

  /**
   *
   * @param {string} eventContent
   * @returns {Promise}
   */
  createxAPIEvent: function(eventContent) {
    const adapter = this;
    const namespace = adapter.get('xAPINamespace');
    const url = `${namespace}/h5p`;
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      headers: this.get('headers'),
      data: JSON.stringify(eventContent)
    };
    return this.sendAjaxRequest(url, options);
  }
});
