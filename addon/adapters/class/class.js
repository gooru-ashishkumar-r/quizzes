import TokenMixin from 'quizzes-addon/mixins/token';
import ApplicationAdapter from 'quizzes-addon/adapters/application';

export default ApplicationAdapter.extend(TokenMixin, {
  /**
   * @property {string} End-point URI
   */
  namespace: '/api/nucleus/v1/classes',

  /**
   * Get the list of members, invitees, collaborators and owner of the class
   * @param classId the class ID to be read
   * @returns {Promise}
   */
  readClassMembers: function(classId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${classId}/members`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: this.get('headers')
    };
    return this.sendAjaxRequest(url, options);
  }
});
