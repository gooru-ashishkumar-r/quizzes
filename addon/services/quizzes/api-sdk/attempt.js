import Ember from 'ember';
import AttemptSerializer from 'quizzes-addon/serializers/attempt/attempt';
import AttemptAdapter from 'quizzes-addon/adapters/attempt/attempt';

export default Ember.Service.extend({
  init: function() {
    this._super(...arguments);
    this.set(
      'attemptAdapter',
      AttemptAdapter.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'attemptSerializer',
      AttemptSerializer.create(Ember.getOwner(this).ownerInjection())
    );
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {EventsAdapter} adapter
   */
  contextAdapter: null,

  /**
   * @property {EventsSerializer} serializer
   */
  contextSerializer: null,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Get data to show on the real time report
   * @param {String} contextId
   * @returns {Promise}
   */
  getReportData: function(contextId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('attemptAdapter')
        .getReportData(contextId)
        .then(response =>
          service.get('attemptSerializer').normalizeReportData(response)
        )
        .then(resolve, reject);
    });
  },

  /**
   * Get attempt data for report
   * @param {String} attemptId
   * @returns {Promise}
   */
  getAttemptData: function(attemptId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('attemptAdapter')
        .getAttemptData(attemptId)
        .then(response =>
          service.get('attemptSerializer').normalizeReportDataEvent(response)
        )
        .then(resolve, reject);
    });
  },

  /**
   * Get all attempt ids by context and profile id
   * @param {String} contextId
   * @param {String} profileId
   * @returns {Promise}
   */
  getAttemptIds: function(contextIds, profileIds) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('attemptAdapter')
        .getAttemptIds(contextIds, profileIds)
        .then(response =>
          service.get('attemptSerializer').normalizeAttemptIds(response)
        )
        .then(resolve, reject);
    });
  }
});
