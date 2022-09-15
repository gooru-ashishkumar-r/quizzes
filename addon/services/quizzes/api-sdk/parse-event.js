import Ember from 'ember';
import { APP_ID, APP_VERSION } from 'quizzes-addon/config/parse-event';
import { getDeviceInfo } from 'quizzes-addon/utils/device-info';
import ParseEventsAdapter from 'quizzes-addon/adapters/parse-event/parse-event';
export default Ember.Service.extend({
  /**
   * @property {Service} Session service
   */
  session: Ember.inject.service('session'),

  init: function() {
    this._super(...arguments);
    this.set(
      'parseEventsAdapter',
      ParseEventsAdapter.create(Ember.getOwner(this).ownerInjection())
    );
  },

  postParseEvent(eventName, eventItem) {
    const service = this;
    const eventData = {
      sessionId: window.localStorage.getItem('parse_event_session'),
      appId: APP_ID,
      eventName: eventName,
      appVersion: APP_VERSION,
      deviceInfo: getDeviceInfo(),
      tenantId: service.get('session.tenantId'),
      userId: service.get('session.userId'),
      userName: service.get('session.userData.username'),
      timezone: moment.tz(moment.tz.guess()).zoneAbbr(),
      tenantShortName: service.get('session.tenantShortName')
        ? service.get('session.tenantShortName')
        : null
    };
    if (eventItem) {
      eventData.context = eventItem;
    }
    service.get('parseEventsAdapter').postParseEvent(eventData);
  },
  getCurrentLocation() {
    return this.get('parseEventsAdapter').getCurrentLocation();
  }
});
