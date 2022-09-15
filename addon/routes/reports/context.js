import Ember from 'ember';
import ReportDataEvent from 'quizzes-addon/models/result/report-data-event';

/**
 * Route for collection/assessment report
 *
 * Gathers and passes initialization data for context events
 * from BE to the controller
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Route.extend({
  queryParams: {
    anonymous: {}
  },

  /**
   * @type {AttemptService} attemptService
   * @property {Ember.Service} Service to send context related events
   */
  quizzesAttemptService: Ember.inject.service('quizzes/attempt'),

  /**
   * @type {CollectionService} collectionService
   * @property {Ember.Service} Service to retrieve a collection
   */
  quizzesCollectionService: Ember.inject.service('quizzes/collection'),

  /**
   * @property {Service} Configuration service
   */
  quizzesConfigurationService: Ember.inject.service('quizzes/configuration'),

  /**
   * @type {ProfileService} profileService
   * @property {Ember.Service} Service to send profile related events
   */
  quizzesProfileService: Ember.inject.service('quizzes/profile'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Navigate to the previous page
     */
    navigateBack: function() {
      // Empty, it does nothing by default
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @param {{ contextId: string }} params
   */
  model: function(params) {
    return this.quizzesModel(params);
  },

  /**
   * @param {{ contextId: string }} params
   */
  quizzesModel: function(params) {
    const route = this;
    const contextId = params.contextId;
    const anonymous = params.anonymous;
    const students = params.students || [];
    const currentClass = params.currentClass || null;
    const type =
      params.type ||
      route.get('quizzesConfigurationService.configuration.properties.type');
    params.type = type;

    return route
      .get('quizzesAttemptService')
      .getReportData(contextId)
      .then(reportData => {
        let avgScoreData = params.avgScoreData
          ? JSON.parse(params.avgScoreData)
          : null;
        reportData.reportEvents.forEach(item => {
          let scoreValue = avgScoreData
            ? avgScoreData.findBy('userId', item.profileId)
            : null;
          item.averageScore =
            item.averageScore >= 0
              ? item.averageScore
              : scoreValue && scoreValue.score
                ? scoreValue.score
                : 0;
        });

        /* Setting avatarUrl for students which have event data */
        students
          .filter(student => {
            let reportDataFilteredByProfilePresent = reportData
              .get('reportEvents')
              .findBy('profileId', student.id);
            return reportDataFilteredByProfilePresent;
          })
          .forEach(student => {
            let reportDataWithStudentData = reportData
              .get('reportEvents')
              .findBy('profileId', student.id);

            if (reportDataWithStudentData) {
              reportDataWithStudentData.avatarUrl = student.get('avatarUrl');
            }
          });

        students
          .filter(
            student =>
              !reportData.get('reportEvents').findBy('profileId', student.id)
          )
          .forEach(student => {
            if (student.get('isActive')) {
              reportData.get('reportEvents').push(
                ReportDataEvent.create(Ember.getOwner(this).ownerInjection(), {
                  profileId: student.get('id'),
                  profileName: student.get('fullName'),
                  lastFirstName: student.get('lastFirstName'),
                  avatarUrl: student.get('avatarUrl'),
                  isAttemptStarted: false,
                  isAttemptFinished: false
                })
              );
            }
          });
        return reportData;
      })
      .then(reportData =>
        Ember.RSVP.hash({
          anonymous,
          reportData,
          currentClass,
          collection: route
            .get('quizzesCollectionService')
            .readCollection(reportData.collectionId, type),
          profiles: route
            .get('quizzesProfileService')
            .readProfiles(
              reportData.get('reportEvents').map(({ profileId }) => profileId)
            ),
          modelParams: params
        })
      );
  },

  setupController(controller, model) {
    const anonymous = model.anonymous;
    const collection = model.collection;
    const reportData = model.reportData;
    const profiles = model.profiles;
    const currentClass = model.currentClass;
    reportData.get('reportEvents').forEach(function(reportEvent) {
      const profile = profiles[reportEvent.get('profileId')];
      reportEvent.setProfileProperties(profile);
    });
    controller.set('modelParams', model.modelParams);
    controller.set('collection', collection);
    reportData.setCollection(collection);
    controller.set('reportData', reportData);
    controller.set('anonymous', anonymous);
    controller.set('class', currentClass);
  },

  deactivate: function() {
    const webSocketClient = this.get('controller').get('webSocketClient');
    if (webSocketClient && webSocketClient.connected) {
      webSocketClient.disconnect();
    }
  }
});
