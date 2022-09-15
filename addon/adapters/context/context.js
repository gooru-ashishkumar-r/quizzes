import TokenMixin from 'quizzes-addon/mixins/token';
import ApplicationAdapter from 'quizzes-addon/adapters/application';

export default ApplicationAdapter.extend(TokenMixin, {
  /**
   * @property {Object} namespace base url for context endpoints
   */
  namespace: '/quizzes/api/v1/contexts',

  /**
   * Creates a context
   * @param {Object} assignment
   * @returns {Promise}
   */
  createContext: function(assignment) {
    const namespace = this.get('namespace');
    const url = `${namespace}`;
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      data: JSON.stringify(assignment),
      headers: this.get('headers')
    };
    return this.sendAjaxRequest(url, options);
  },

  /**
   * Get context by id assigned to the current student
   * @returns {Promise}
   */
  getAssignedContextById: function(contextId) {
    const namespace = this.get('namespace');
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      headers: this.get('headers')
    };

    const url = `${namespace}/${contextId}/assigned`;
    return this.sendAjaxRequest(url, options);
  },

  /**
   * Gets all the contexts assigned to the current student
   * @returns {Promise}
   */
  getContextsAssigned: function() {
    const namespace = this.get('namespace');
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      headers: this.get('headers')
    };
    const url = `${namespace}/assigned`;
    return this.sendAjaxRequest(url, options);
  },

  /**
   * Gets all contexts created by the current teacher
   * @returns {Promise}
   */
  getContextsCreated: function() {
    const namespace = this.get('namespace');
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      headers: this.get('headers')
    };
    const url = `${namespace}/created`;
    return this.sendAjaxRequest(url, options);
  },

  /**
   * Start playing new resource based on the context.
   * @param {String} resourceId current resource
   * @param {String} contextId
   * @param {Object} previousResource resource to save
   * @returns {Promise}
   */
  startPlayResource: function(
    resourceId,
    contextId,
    prevResource,
    eventContext
  ) {
    const namespace = this.get('namespace');
    const previousResource = prevResource || {};
    const data = { eventContext, previousResource };
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      processData: false,
      data: JSON.stringify(data),
      headers: this.get('headers')
    };
    const resourceIdParam = resourceId || previousResource.resourceId;
    const url = `${namespace}/${contextId}/onResource/${resourceIdParam}/start`;
    return this.sendAjaxRequest(url, options);
  },

  /**
   * Stop playing  resource based on the context.
   * @param {String} resourceId current resource
   * @param {String} contextId
   * @param {Object} previousResource resource to save
   * @returns {Promise}
   */
  stopPlayResource: function(
    resourceId,
    contextId,
    prevResource,
    eventContext
  ) {
    const namespace = this.get('namespace');
    const previousResource = prevResource || {};
    const data = { eventContext, previousResource };
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      processData: false,
      data: JSON.stringify(data),
      headers: this.get('headers')
    };
    const resourceIdParam = resourceId || previousResource.resourceId;
    const url = `${namespace}/${contextId}/onResource/${resourceIdParam}/stop`;
    return this.sendAjaxRequest(url, options);
  },

  /**
   * Pause playing  resource based on the context.
   * @param {String} resourceId current resource
   * @param {String} contextId
   * @param {Object} previousResource resource to save
   * @returns {Promise}
   */
  pausePlayResource: function(
    resourceId,
    contextId,
    prevResource,
    eventContext
  ) {
    const namespace = this.get('namespace');
    const previousResource = prevResource || {};
    const data = { eventContext, previousResource };
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      processData: false,
      data: JSON.stringify(data),
      headers: this.get('headers')
    };
    const resourceIdParam = resourceId || previousResource.resourceId;
    const url = `${namespace}/${contextId}/onResource/${resourceIdParam}/pause`;
    return this.sendAjaxRequest(url, options);
  },

  /**
   * Resume playing  resource based on the context.
   * @param {String} resourceId current resource
   * @param {String} contextId
   * @param {Object} previousResource resource to save
   * @returns {Promise}
   */
  resumePlayResource: function(
    resourceId,
    contextId,
    prevResource,
    eventContext
  ) {
    const namespace = this.get('namespace');
    const previousResource = prevResource || {};
    const data = { eventContext, previousResource };
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      processData: false,
      data: JSON.stringify(data),
      headers: this.get('headers')
    };
    const resourceIdParam = resourceId || previousResource.resourceId;
    const url = `${namespace}/${contextId}/onResource/${resourceIdParam}/resume`;
    return this.sendAjaxRequest(url, options);
  },

  /**
   * Send event to notify the student submitted all questions in an assignment
   * @param {String} contextId
   * @returns {Promise}
   */
  sendFinishContextEvent: function(contextId, eventContext) {
    const namespace = this.get('namespace');
    const url = `${namespace}/${contextId}/finish`;
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      processData: false,
      data: JSON.stringify(eventContext),
      headers: this.get('headers')
    };
    return this.sendAjaxRequest(url, options);
  },

  /**
   * Send event to notify the student started an assignment
   * @param {String} contextId
   * @returns {Promise}
   */
  sendStartContextEvent: function(contextId, eventContext) {
    const namespace = this.get('namespace');
    const url = `${namespace}/${contextId}/start`;
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      data: JSON.stringify(eventContext),
      headers: this.get('headers')
    };
    return this.sendAjaxRequest(url, options);
  },

  /**
   * Update an assignment/context
   * @param {Object} data
   * @param {String} contextId
   * @returns {Promise}
   */
  updateContext: function(data, contextId) {
    const namespace = this.get('namespace');
    const url = `${namespace}/${contextId}`;
    const options = {
      type: 'PUT',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      data: JSON.stringify(data),
      headers: this.get('headers')
    };
    return this.sendAjaxRequest(url, options);
  }
});
