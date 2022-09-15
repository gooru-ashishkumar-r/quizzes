import Ember from 'ember';
import {
  REAL_TIME_CLIENT,
  CONTEXT_EVENT_TYPES,
  VIEW_LAYOUT_PICKER_OPTIONS
} from 'quizzes-addon/config/quizzes-config';
import ConfigMixin from 'quizzes-addon/mixins/endpoint-config';
import ReportDataEvent from 'quizzes-addon/models/result/report-data-event';

/**
 *
 * Controller for collection/assessment report
 *
 * Controls the gathering and merging of context events
 * for a collection/assessment
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Controller.extend(ConfigMixin, {
  queryParams: ['anonymous'],

  /**
   * @type {ContextService} contextService
   * @property {Ember.Service} Service to send context related events
   */
  quizzesContextService: Ember.inject.service('quizzes/context'),

  /**
   * @requires service:i18n
   */
  i18n: Ember.inject.service(),

  /**
   * @requires service:notifications
   */
  quizzesNotifications: Ember.inject.service('quizzes/notifications'),

  /**
   * @type {ProfileService} profileService
   * @property {Ember.Service} Service to send profile related events
   */
  quizzesProfileService: Ember.inject.service('quizzes/profile'),

  /**
   * @type {ClassService} classService
   * @property {Ember.Service} Service to send class related events
   */
  quizzesClassService: Ember.inject.service('quizzes/class'),

  /**
   * @type {AttemptService} attemptService
   * @property {Ember.Service} Service to send context related events
   */
  quizzesAttemptService: Ember.inject.service('quizzes/attempt'),

  /**
   * Layout of the page / grid / list
   */
  layoutView: true,

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Navigate to the previous page
     */
    goBack: function() {
      this.send('navigateBack');
    },
    /**
     * Close current anonymous window
     */
    closeWindow: function() {
      window.close();
    },

    changeView: function(layout) {
      const thumbnails = layout === VIEW_LAYOUT_PICKER_OPTIONS.LIST;
      this.set('layoutView', !thumbnails);
    },
    /**
     * Launch report with anonymous codes
     */
    launchAnonymous: function() {
      const url = window.location.href;
      const separator = !url.includes('?') ? '?' : '&';
      window.open(
        `${url}${separator}anonymous=true`,
        'realTimeAnonymous',
        `width=${window.screen.width}, height=${window.screen.height}, left=0, top=0, scrollbars=1`,
        true
      );
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {boolean}
   */
  anonymous: false,

  /**
   * @property {TeacherContext} reportData object with the student events for
   * the current assessment
   */
  reportData: null,

  /**
   * @property {boolean} is a notification regarding the connection currently
   * being displayed
   */
  isNotificationDisplayed: false,

  /**
   * @property {boolean} isRealTime
   */
  isRealTime: true,

  /**
   * @property {boolean} showAttempts
   */
  showAttempts: false,

  /**
   * @property { Object } webSocketClient - web socket client for getting live
   * data from the Real Time server
   */
  webSocketClient: null,

  /**
   * Max Number of attempts  to reconnect web scoket
   * @property {Number}
   */
  maxNumberOfRetry: 20,

  /**
   * Number of attempts tried to reconnect web scoket
   * @property {Number}
   */
  numberOfRetry: 0,

  /**
   * It has the list params in object
   * @property {Object}
   */
  modelParams: null,

  /**
   * It has the collection
   * @property {Collection}
   */
  collection: null,

  /**
   * scheduler properties to reload the data from server in order to avoid the data loss.
   * @property {Object}
   */
  reportReloadScheduler: null,

  /**
   * Wait time to reload the report data
   * @property {Object}
   */
  waitTimeToReloadReportData: 20000,

  /**
   * It has the class
   * @property {class}
   */
  class: null,

  // -------------------------------------------------------------------------
  // Observers

  /**
   * Observe when the 'reportData' object has been set by the route.
   * At this point, it is possible to proceed with the creation of the
   * websocket to communicate with the real time server and safely merge
   * any initialization data from the real time server as well
   */
  reportDataLoaded: Ember.observer('reportData', function() {
    const reportData = this.get('reportData');
    const contextId = reportData.get('contextId');
    if (reportData) {
      this.connectWithWebSocket(contextId, reportData);
    }
  }),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Create web socket connection
   */
  connectWithWebSocket: function(contextId, reportData) {
    const controller = this;

    // Create a new web socket connection
    const url = this.getRealTimeWebSocketUrl();
    const socket = new SockJS(url);
    let webSocketClient = Stomp.over(socket);
    webSocketClient.heartbeat.outgoing = REAL_TIME_CLIENT.OUTGOING_HEARTBEAT;
    webSocketClient.heartbeat.incoming = REAL_TIME_CLIENT.INCOMING_HEARTBEAT;

    controller.set('webSocketClient', webSocketClient);
    webSocketClient.connect(
      {},
      function() {
        // Clear a failed connection notification, if there was one
        controller.set('numberOfRetry', 0);
        // A web socket connection was made to the RT server. Before subscribing
        // for live messages, a request will be made to fetch any initialization data
        // from the RT server (to avoid overriding data from live messages with init data)
        const channel = contextId;

        // Subscribe to listen for live messages
        webSocketClient.subscribe(`/topic/${channel}`, function(message) {
          const eventMessage = JSON.parse(message.body);
          reportData.parseEvent(eventMessage);
          let profilePromise = Ember.RSVP.resolve();
          const profileId = eventMessage.profileId;
          const profileData = reportData.reportEvents.findBy(
            'profileId',
            profileId
          );
          const isProfileNameExists = profileData.get('lastFirstName');
          if (
            eventMessage.eventName === CONTEXT_EVENT_TYPES.START &&
            !isProfileNameExists
          ) {
            profilePromise = controller
              .get('quizzesProfileService')
              .readProfiles([profileId]);
          }
          profilePromise.then(profiles => {
            const profile = profiles ? profiles[profileId] : null;
            if (profile) {
              reportData.updatedProfileName(profileId, profile);
              reportData.setCollection(controller.get('collection'));
            }
          });
          if (controller.get('reportReloadScheduler')) {
            Ember.run.cancel(controller.get('reportReloadScheduler'));
          }
          let waitTimeToReloadReportData = controller.get(
            'waitTimeToReloadReportData'
          );
          let reportReloadScheduler = Ember.run.later(
            controller,
            function() {
              controller.loadReportData(controller, false);
            },
            waitTimeToReloadReportData
          );
          controller.set('reportReloadScheduler', reportReloadScheduler);
        });
      },
      function(error) {
        Ember.Logger.error(error);
        const numberOfRetry = controller.get('numberOfRetry');
        const maxNumberOfRetry = controller.get('maxNumberOfRetry');
        if (numberOfRetry <= maxNumberOfRetry) {
          controller.loadReportData(controller, true);
        }
      }
    );
  },

  /**
   * Show a connection lost notification
   */
  showNotification: function() {
    const isDisplayed = this.get('isNotificationDisplayed');

    if (!isDisplayed) {
      const notifications = this.get('quizzesNotifications');
      const message = this.get('i18n').t(
        'common.warnings.on-air-connection-lost'
      ).string;

      // Use custom options for the notification
      notifications.setOptions({
        closeButton: false,
        newestOnTop: true,
        progressBar: false,
        positionClass: 'toast-top-full-width',
        preventDuplicates: false,
        showDuration: 300,
        hideDuration: 1000,
        timeOut: '0',
        extendedTimeOut: '0',
        showEasing: 'swing',
        hideEasing: 'linear',
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut'
      });
      notifications.warning(message);
      this.set('isNotificationDisplayed', true);
    }
  },

  /**
   * Remove all notifications
   */
  clearNotification: function() {
    this.get('quizzesNotifications').clear();
    this.set('isNotificationDisplayed', false);
  },

  loadReportData: function(controller, isTryToReconnect) {
    const params = controller.get('modelParams');
    const contextId = params.contextId;
    const classId = params.classId;
    controller
      .get('quizzesClassService')
      .readClassMembers(classId)
      .then(data => {
        const students = data.members;
        controller
          .get('quizzesAttemptService')
          .getReportData(contextId)
          .then(reportData => {
            /* Setting avatarUrl for students which have event data */
            students
              .filter(student => {
                let reportDataFilteredByProfilePresent = reportData
                  .get('reportEvents')
                  .findBy('profileId', student.id);
                return reportDataFilteredByProfilePresent;
              })
              .forEach(student => {
                let rptDataWthStudsData = reportData
                  .get('reportEvents')
                  .findBy('profileId', student.id);

                if (rptDataWthStudsData) {
                  rptDataWthStudsData.avatarUrl = student.get('avatarUrl');
                }
              });
            students
              .filter(
                student =>
                  !reportData
                    .get('reportEvents')
                    .findBy('profileId', student.id)
              )
              .forEach(student => {
                reportData.get('reportEvents').push(
                  ReportDataEvent.create(
                    Ember.getOwner(this).ownerInjection(),
                    {
                      profileId: student.get('id'),
                      profileName: student.get('fullName'),
                      lastFirstName: student.get('lastFirstName'),
                      avatarUrl: student.get('avatarUrl'),
                      isAttemptStarted: false,
                      isAttemptFinished: false
                    }
                  )
                );
              });
            return reportData;
          })
          .then(reportData => {
            Ember.RSVP.hash({
              reportData,
              profiles: controller
                .get('quizzesProfileService')
                .readProfiles(
                  reportData
                    .get('reportEvents')
                    .map(({ profileId }) => profileId)
                )
            }).then(({ reportData, profiles }) => {
              reportData.get('reportEvents').forEach(function(reportEvent) {
                const profile = profiles[reportEvent.get('profileId')];
                reportEvent.setProfileProperties(profile);
              });
              reportData.setCollection(controller.get('collection'));

              if (isTryToReconnect) {
                controller.set('reportData', reportData);
              } else {
                controller.set(
                  'reportData.reportEvents',
                  reportData.get('reportEvents')
                );
              }
            });
          });
      });
  }
});
