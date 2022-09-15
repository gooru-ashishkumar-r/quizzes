import Ember from 'ember';

/**
 * Adapter to support the capture activity feedback operations
 *
 * @typedef {Object} ActivityFeedbackAdapter
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  activityFeedbackNamespace: '/api/ds/users/v2/activity',

  feedbackCategoryNamespace: '/api/nucleus/v1/lookups',

  /**
   * Fetch feedback category
   * @returns {Promise.<[]>}
   */
  getFeedbackCategories(userCategoryId, language) {
    const adapter = this;
    const namespace = adapter.get('feedbackCategoryNamespace');
    const url = `${namespace}/feedback-categories?user_category_id=${userCategoryId}&language=${language}`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8'
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Fetch user activity feedback
   */
  fetchActivityFeedback(contentId, userId) {
    const adapter = this;
    const namespace = adapter.get('activityFeedbackNamespace');
    const url = `${namespace}/feedbacks?content_id=${contentId}&user_id=${userId}`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8'
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * submit user feedback for every activity
   * @returns {Promise.<[]>}
   */
  submitUserFeedback(feedbackData) {
    const adapter = this;
    const namespace = adapter.get('activityFeedbackNamespace');
    const url = `${namespace}/feedbacks`;
    const options = {
      type: 'POST',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      data: JSON.stringify(feedbackData)
    };
    return Ember.$.ajax(url, options);
  },

  defineHeaders: function() {
    return {
      Authorization: `Token ${this.get('session.token-api3')}`
    };
  }
});
