import Ember from 'ember';
import ContextResult from 'quizzes-addon/models/result/context';
import EventContext from 'quizzes-addon/models/context/event-context';
import { PLAYER_EVENT_MESSAGE } from 'quizzes-addon/config/quizzes-config';

/**
 * @typedef { Ember.Route } PlayerRoute
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies
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
   * @type {ContextService} contextService
   * @property {Ember.Service} Service to send context related events
   */
  quizzesContextService: Ember.inject.service('quizzes/context'),

  /**
   * @property {Service} Configuration service
   */
  quizzesConfigurationService: Ember.inject.service('quizzes/configuration'),

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Action triggered when click the course map.
     */
    onRedirectCourseMap: function() {
      // Empty, it does nothing by default
    },

    /**
     * Action triggered when  click the back to collection.
     */
    onBackToCollection: function() {
      // Empty, it does nothing by default
    },

    /**
     * Action triggered when the user hits remix on the content player
     */
    onRemixCollection: function() {
      // Empty, it does nothing by default
    },

    /**
     * When the submission is complete
     */
    onFinish: function() {
      const controller = this.get('controller');
      const reportURL = controller.get('reportURL');
      if (reportURL) {
        const url = reportURL.replace(
          '{context-id}',
          controller.get('contextResult.contextId')
        );
        window.location.href = url;
      } else {
        this.transitionTo(
          'reports.student-context',
          controller.get('contextResult.contextId')
        );
      }
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @param {{ contextId: string }} params
   */
  model(params) {
    return this.quizzesModel(params);
  },

  /**
   * @param {{ contextId: string }} params
   */
  quizzesModel(params) {
    const route = this;
    var {
      resourceId,
      contextId,
      source,
      sourceId,
      sourceUrl,
      tenantId,
      partnerId,
      collectionSubType,
      pathId,
      pathType,
      notCheckAttempts,
      isStudyPlayer,
      isIframeMode,
      studentTimespentData,
      ctxPathId,
      ctxPathType
    } = params;
    let type =
      params.type ||
      route.get('quizzesConfigurationService.configuration.properties.type');
    let reportURL =
      params.routeURL ||
      route.get(
        'quizzesConfigurationService.configuration.properties.reportURL'
      );
    let profileId =
      params.profileId ||
      route.get(
        'quizzesConfigurationService.configuration.properties.profileId'
      );
    let role =
      params.role ||
      route.get('quizzesConfigurationService.configuration.properties.role') ||
      'student';
    let isTeacher = role === 'teacher';
    let isAnonymous = profileId === 'anonymous';
    let isLTIResourceLinkLaunch = params.isLTIResourceLinkLaunch === 'true';
    let classData = params.classData;
    //Keept this for 2 release and remove this with 4.4.4
    console.log('pathType', pathType); //eslint-disable-line
    var pathTypeEvtCtx = pathType === '' ? null : pathType;
    console.log('pathTypeEvtCtx', pathTypeEvtCtx); //eslint-disable-line
    pathType = pathTypeEvtCtx;
    let eventContext = EventContext.create({
      collectionSubType,
      pathId,
      partnerId,
      sourceId,
      source,
      sourceUrl,
      tenantId,
      pathType,
      ctxPathId,
      ctxPathType
    });
    let model = {
      isAnonymous,
      pathId,
      reportURL,
      resourceId,
      role,
      eventContext,
      notCheckAttempts,
      isStudyPlayer,
      isIframeMode,
      studentTimespentData,
      isLTIResourceLinkLaunch,
      classData
    };
    if (isAnonymous || isTeacher || !isStudyPlayer) {
      return route
        .get('quizzesContextService')
        .startContext(contextId, eventContext)
        .then(function(contextResult) {
          return Ember.RSVP.hash(
            Object.assign(model, {
              contextResult,
              collection: route
                .get('quizzesCollectionService')
                .readCollection(contextResult.collectionId, type)
            })
          );
        });
    } else {
      return route
        .get('quizzesContextService')
        .getAssignedContextById(contextId)
        .then(context =>
          !context
            ? null
            : route
              .get('quizzesCollectionService')
              .readCollection(context.collectionId, type)
              .then(collection =>
                !collection
                  ? null
                  : route
                    .get('quizzesAttemptService')
                    .getAttemptIds(contextId, profileId)
                    .then(attempts =>
                      Ember.RSVP.hash(
                        Object.assign(model, {
                          attempts,
                          collection,
                          context,
                          startContextFunction: () =>
                            route.startContext(context.id, eventContext)
                        })
                      )
                    )
              )
        );
    }
  },

  setupController(controller, model) {
    window.parent.postMessage(PLAYER_EVENT_MESSAGE.GRU_LOADING_COMPLETED, '*');
    const collection = model.collection;
    const isAnonymous = model.isAnonymous;
    const isTeacher = model.role === 'teacher';
    const notCheckAttempts = model.notCheckAttempts;
    const isStudyPlayer = model.isStudyPlayer;
    const isIframeMode = model.isIframeMode;
    const lessonList =
      model.unit && model.unit.children ? model.unit.children : [];
    const unitList =
      model.course && model.course.children ? model.course.children : [];
    let contextResult = ContextResult.create();
    if (model.resourceId) {
      contextResult.set('currentResourceId', model.resourceId);
    }
    if (isAnonymous || isTeacher || !isStudyPlayer) {
      contextResult = model.contextResult;
      contextResult.merge(collection);
      controller.set('role', model.role);
    } else {
      const context = model.context;
      if (model.course && model.course.id) {
        context.set('courseId', model.course.id);
      }
      context.set('attempts', model.attempts.length);
      contextResult.set('context', context);
      contextResult.set('collection', collection);
      controller.set('isAnonymous', isAnonymous);
      controller.set('role', model.role);
      controller.set('startContextFunction', model.startContextFunction);
    }
    controller.set('contextResult', contextResult);
    controller.set('reportURL', model.reportURL);
    controller.set('eventContext', model.eventContext);
    controller.set('notCheckAttempts', notCheckAttempts);
    controller.set('showConfirmation', false);
    controller.set('suggestedResources', model.suggestedResources);
    controller.set('pathType', model.eventContext.pathType);
    controller.set('ctxPathType', model.eventContext.ctxPathType);
    controller.set('isStudyPlayer', isStudyPlayer);
    controller.set('isIframeMode', isIframeMode);
    controller.set('lesson', model.lesson);
    controller.set('lessonList', lessonList);
    controller.set('unitList', unitList);
    controller.set('studentTimespentData', model.studentTimespentData);
    controller.set('isLTIResourceLinkLaunch', model.isLTIResourceLinkLaunch);
    controller.set('class', model.classData);
  },

  /**
   * @param {string} contextId
   * Starts context to show the player
   */
  startContext: function(contextId, eventContext) {
    const route = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      route
        .get('quizzesContextService')
        .startContext(contextId, eventContext)
        .then(resolve, reject);
    });
  }
});
