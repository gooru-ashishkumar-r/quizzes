import Ember from 'ember';
import TenantSettingsMixin from 'gooru-web/mixins/tenant-settings-mixin';

/**
 * Route for student report
 *
 * Gathers and passes initialization data for attempt events
 * from BE to the controller
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Route.extend(TenantSettingsMixin, {
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
   * @property {Service} profile service
   */
  quizzesProfileService: Ember.inject.service('quizzes/profile'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Navigate to the previous page
     */
    navigateBack: function() {
      window.history.back();
    }
  },

  classFramework: Ember.computed('currentClass', function() {
    return this.get('currentClass.preference') &&
      this.get('currentClass.preference.framework')
      ? this.get('currentClass.preference.framework')
      : null;
  }),

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
    const classFramework = route.get('classFramework');
    const isDefaultShowFW = route.get('isDefaultShowFW');
    const profileId =
      params.profileId ||
      route.get(
        'quizzesConfigurationService.configuration.properties.profileId'
      );
    const type =
      params.type ||
      route.get('quizzesConfigurationService.configuration.properties.type');

    return route
      .get('quizzesAttemptService')
      .getAttemptIds(contextId, profileId)
      .then(attemptIds =>
        !attemptIds || !attemptIds.length
          ? {}
          : route
            .get('quizzesAttemptService')
            .getAttemptData(attemptIds[attemptIds.length - 1])
            .then(attemptData =>
              Ember.RSVP.hash({
                attemptData,
                collection: route
                  .get('quizzesCollectionService')
                  .readCollection(
                    attemptData.collectionId,
                    type,
                    false,
                    isDefaultShowFW,
                    classFramework
                  ),
                profile:
                    profileId !== 'anonymous'
                      ? route
                        .get('quizzesProfileService')
                        .readUserProfile(profileId)
                      : {},
                assessmentResult:
                    params.type === 'assessment'
                      ? params.source === 'coursemap'
                        ? route
                          .get('quizzesCollectionService')
                          .findAssessmentResultByCollectionAndStudent(
                            params.type,
                            params.collectionId,
                            params.profileId,
                            attemptData.attemptId
                          )
                        : route
                          .get('quizzesCollectionService')
                          .findResourcesByCollectionforDCA(
                            attemptData.attemptId,
                            params.collectionId,
                            params.classId,
                            params.profileId,
                            params.type,
                            moment().format('YYYY-MM-DD')
                          )
                      : {}
              })
            )
      );
  },

  setupController(controller, model) {
    if (model && model.attemptData) {
      model.attemptData.setCollection(model.collection);
      controller.set('attemptData', model.attemptData);
      controller.set('profile', model.profile);
      const found =
        model.assessmentResult &&
        model.assessmentResult.content &&
        model.assessmentResult.content.length;
      if (found) {
        let content = model.assessmentResult.content[0];
        controller.set('isGradedScore', content.assessment.score);
        let resources =
          content.resources || content.questions || content.usageData;
        if (resources) {
          const evidenceData = resources.map(result => {
            return result.isGraded === false;
          });
          controller.set('isGraded', evidenceData.contains(true));
        }
      }
      controller.set('currentClass', this.get('currentClass'));
    }
  }
});
