import Ember from 'ember';
import { APP_ID } from 'quizzes-addon/config/parse-event';

/**
 * Adapter to post event to parse server
 *
 * @typedef {Object} ParseEventsAdapter
 */
export default Ember.Object.extend({
  parseEventApiUrl: '/web/parse/event',
  /**
   * Post parse events to parse server
   *
   * @param {object} eventData
   * @returns {Promise}
   */
  postParseEvent: function(eventData) {
    const adapter = this;
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders(),
      data: JSON.stringify(eventData)
    };
    return Ember.$.ajax(adapter.get('parseEventApiUrl'), options);
  },

  defineHeaders: function() {
    return {
      'x-parse-application-id': APP_ID
    };
  },

  getCurrentLocation: function() {
    const options = {
      type: 'GET'
    };
    return Ember.$.ajax('http://ip-api.com/json', options);
  }
});
