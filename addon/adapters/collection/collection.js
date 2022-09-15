import TokenMixin from 'quizzes-addon/mixins/token';
import ApplicationAdapter from 'quizzes-addon/adapters/application';

export default ApplicationAdapter.extend(TokenMixin, {
  /**
   * @property {string} End-point URI
   */
  namespace: '/quizzes/api/v1/collections',

  collectionNameSpace: '/api/nucleus/v1/collections',

  assessmentNameSpace: '/api/nucleus/v1/assessments',

  dcanamespace: '/api/nucleus-insights/v2',

  /**
   * Reads a Collection by id
   *
   * @param {string} collectionId
   * @returns {Promise}
   */
  readCollection: function(collectionId, type, refresh = false) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    refresh = true;
    const url = `${namespace}/${collectionId}?type=${type}&refresh=${refresh}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      headers: this.get('headers')
    };
    return this.sendAjaxRequest(url, options);
  },

  queryRecordForDCA: function(query) {
    const namespace = this.get('dcanamespace');
    let sessionParam = `sessionId=${query.sessionId}`;
    if (query.sessionId === 'NA' || query.sessionId === undefined) {
      sessionParam = '';
    }
    let classParam = `classId=${query.classId}`;
    let date = `date=${query.date}`;
    let startDate = `startDate=${query.startDate}`;
    let endDate = `endDate=${query.endDate}`;
    const collectionId = query.collectionId;
    const userId = query.userId;
    const collectionType = query.collectionType;
    const url = `${namespace}/dca/${collectionType}/${collectionId}/user/${userId}?${sessionParam}&${classParam}&${date}&${startDate}&${endDate}`;
    const options = {
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      headers: this.get('headers'),
      data: {}
    };
    return this.sendAjaxRequest(url, options);
  },

  queryRecord: function(query) {
    const namespace = this.get('dcanamespace');
    const contentId = query.contentId;
    const collectionType = query.collectionType;
    const userId = query.userId;
    const sessionId = query.sessionId;
    let queryParams = `sessionId=${sessionId}`;
    const url = `${namespace}/${collectionType}/${contentId}/user/${userId}?${queryParams}`;
    const options = {
      type: 'GET',
      dataType: 'json',
      headers: this.get('headers'),
      data: {}
    };
    return this.sendAjaxRequest(url, options);
  },

  /**
   * Reads a Collection by id
   *
   * @param {string} collectionId
   * @returns {Promise}
   */
  getCollection: function(collectionId) {
    const adapter = this;
    const namespace = adapter.get('collectionNameSpace');
    const url = `${namespace}/${collectionId}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: this.get('headers')
    };
    return this.sendAjaxRequest(url, options);
  },

  /**
   * Reads a Assesment by id
   *
   * @param {string} collectionId
   * @param {string} type assessment
   * @param {boolean} refresh indicates if the data should be refreshed from the repository
   * @returns {Promise}
   */
  getAssessment: function(collectionId) {
    const adapter = this;
    const namespace = adapter.get('assessmentNameSpace');
    const url = `${namespace}/${collectionId}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: this.get('headers')
    };
    return this.sendAjaxRequest(url, options);
  }
});
