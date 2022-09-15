import Ember from 'ember';
import ActivityFeedbackAdapter from 'quizzes-addon/adapters/player/activity-feedback';
import ActivityFeedbackSerializer from 'quizzes-addon/serializers/player/activity-feedback';

/**
 * Service to support the capture activity feedback functionality
 *
 * @typedef {Object} ActivityFeedbackService
 */
export default Ember.Service.extend({
  init: function() {
    this._super(...arguments);
    this.set(
      'activityFeedbackSerializer',
      ActivityFeedbackSerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'activityFeedbackAdapter',
      ActivityFeedbackAdapter.create(Ember.getOwner(this).ownerInjection())
    );
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {activityFeedbackAdapter} adapter
   */
  activityFeedbackAdapter: null,

  /**
   * @property {activityFeedbackSerializer} serializer
   */
  activityFeedbackSerializer: null,

  getLocalStorage: function() {
    return window.localStorage;
  },

  /**
   * device_language_key
   */
  device_language_key: 'deviceLanguage',

  // -------------------------------------------------------------------------
  // Methods

  /**
   * get feedback category by user role
   * @param {Number} userCategoryId
   * @returns {Promise}
   */
  getFeedbackCategory: function(userCategoryId) {
    const service = this;
    let language = service
      .getLocalStorage()
      .getItem(service.device_language_key);
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('activityFeedbackAdapter')
        .getFeedbackCategories(userCategoryId, language)
        .then(function(responseData) {
          let categoryContainer = service
            .get('activityFeedbackSerializer')
            .normalizeFetchFeedbackCategories(responseData);
          resolve(categoryContainer);
        }, reject);
    });
  },

  /**
   * Gets the user feedback of a given content id and user id
   * @param {Number} contentId
   * @param {Number} userId
   * @returns {Promise}
   */
  fetchActivityFeedback: function(contentId, userId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('activityFeedbackAdapter')
        .fetchActivityFeedback(contentId, userId)
        .then(function(responseData) {
          resolve(
            service
              .get('activityFeedbackSerializer')
              .normalizeFetchActivityFeedback(responseData)
          );
        }, reject);
    });
  },

  /**
   * submit user feedback
   * @param {Object} feedbackData
   * @returns {Promise}
   */
  submitUserFeedback: function(feedbackData) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('activityFeedbackAdapter')
        .submitUserFeedback(feedbackData)
        .then(function(responseData) {
          resolve(responseData);
        }, reject);
    });
  }
});
