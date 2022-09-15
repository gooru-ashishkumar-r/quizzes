import Ember from 'ember';
import ModalMixin from 'quizzes-addon/mixins/modal';
import {
  FEEDBACK_USER_CATEGORY,
  FEEDBACK_RATING_TYPE,
  ROLES,
  CONTENT_TYPES
} from 'quizzes-addon/config/quizzes-config';
import TenantSettingsMixin from 'gooru-web/mixins/tenant-settings-mixin';
import { PARSE_EVENTS } from 'quizzes-addon/config/parse-event';
import { getObjectsDeepCopy } from 'quizzes-addon/utils/utils';

export default Ember.Component.extend(ModalMixin, TenantSettingsMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {CollectionService} collectionService
   * @property {Ember.Service} Service to retrieve a collection
   */
  collectionService: Ember.inject.service('quizzes/collection'),

  /**
   * @type {CollectionService} profileService
   * @property {Ember.Service} Service to retrieve a profile
   */
  profileService: Ember.inject.service('quizzes/profile'),

  /**
   * @type {ContextService} contextService
   * @property {Ember.Service} Service to send context related events
   */
  contextService: Ember.inject.service('quizzes/context'),

  /**
   * @requires service:notifications
   */
  quizzesNotifications: Ember.inject.service('quizzes/notifications'),

  /**
   * @property {activityFeedbackService}
   */
  activityFeedbackService: Ember.inject.service('quizzes/feedback'),

  /**
   * @requires service:i18n
   */
  i18n: Ember.inject.service(),

  /**
   * @requires service:session
   */
  session: Ember.inject.service('session'),

  /**
   * @property {Service} parseEvent service
   */
  parseEventService: Ember.inject.service('quizzes/api-sdk/parse-event'),

  /**
   * @type {AttemptService} attemptService
   * @property {Ember.Service} Service to send context related events
   */
  quizzesAttemptService: Ember.inject.service('quizzes/attempt'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['qz-player'],
  attributeBindings: ['bgStyle:style'],
  bgStyle: Ember.computed('tenantSettingBg', function() {
    return `background-image: url(${this.get('tenantSettingBg')})`;
  }),

  classNameBindings: ['showConfirmation:confirmation'],

  /**
   * @property {Boolean} isShowPullUp
   */
  isShowPullUp: false,

  intervalObject: null,

  content: null,

  /**
   * @property {Boolean}
   */
  isPublicClass: Ember.computed('class.isPublic', function() {
    return this.get('class.isPublic');
  }),

  collectionObserver: Ember.observer('context', function() {
    const component = this;
    component.fetchAttemptData();
  }),

  resourceObserver: Ember.observer('resource', 'narrationValue', function() {
    this.set(
      'isShowNarrationContainer',
      this.get('resource.isResource') && this.get('narrationValue.narration')
    );
  }),

  /**
   * @property {Boolean} isEnableFullScreen
   * Property to enable/disable fullscreen mode
   */
  isEnableFullScreen: Ember.computed('tenantSettingsObj', function() {
    let tenantSetting = this.get('tenantSettingsObj');
    return tenantSetting &&
      tenantSetting.ui_element_visibility_settings &&
      tenantSetting.ui_element_visibility_settings
        .enable_study_player_fullscreen_mode === true
      ? tenantSetting.ui_element_visibility_settings
        .enable_study_player_fullscreen_mode
      : false;
  }),

  /**
   * Help to trace the comprehension sub question actions
   */
  subEventInprogress: false,

  nextActionResource: null,

  queuedAction: false,

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Action triggered when the user completed a answer
     */
    isNextEnabled: function(isAnswerCompleted) {
      this.set('isNextEnabled', isAnswerCompleted);
    },
    /**
     * Action triggered when the user closes the content player
     */
    closePlayer: function(transitionTo) {
      let component = this;
      let courseId = component.get('course.id') || null;
      component.sendAction('onClosePlayer', transitionTo, courseId);
    },

    /**
     * Action triggered to remix the collection
     * @param content
     */
    remixCollection: function() {
      this.sendAction('onRemixCollection');
    },

    /**
     * Triggered when an resource emotion is selected
     * @param {string} emotionScore
     */
    changeEmotion: function(emotionScore) {
      const resourceResult = this.get('resourceResult');
      resourceResult.set('reaction', emotionScore);
    },

    /**
     * Finish from the confirmation
     */
    finishCollection: function() {
      this.finishCollection();
    },

    resumeCollection: function() {
      this.set('showFinishConfirmation', false);
    },

    /**
     * When clicking at submit all or end
     */
    submitAll: function() {
      const component = this;
      component.set('queuedAction', false);
      const subEventInprogress = component.get('subEventInprogress');
      if (subEventInprogress) {
        component.set('queuedAction', true);
        return;
      }
      if (component.get('intervalObject')) {
        clearInterval(component.get('intervalObject'));
        $(window).off('blur');
        $(window).off('focus');
      }
      const collection = component.get('collection');
      const contextResult = component.get('contextResult');
      const resourceResult = component.get('resourceResult');
      let resourcesPlayer = this.get('resourcesPlayer');
      if (!resourceResult.get('resource.isResource')) {
        component.checkPartialScore(resourcesPlayer, resourceResult);
      }
      const userFeedback = component.get('userCategoryFeedback');
      if (userFeedback && userFeedback.length) {
        let learningFeedback = component.getFeedbackObject();
        component
          .get('activityFeedbackService')
          .submitUserFeedback(learningFeedback);
      }
      component.saveResourceResult(null, contextResult, resourceResult);
      if (
        collection.get('isAssessment') &&
        !component.get('diagnosticActive')
      ) {
        //open confirmation modal
        component.finishConfirm();
      } else {
        //finishes the last resource
        component.finishCollection();
      }
      let timespent = 0;
      contextResult.resourceResults.forEach(item => {
        timespent += item.savedTime;
      });
      const context = {
        resourceId: resourceResult.resource.id,
        ownerId: resourceResult.resource.ownerId,
        title: resourceResult.resource.title,
        type: resourceResult.resource.type,
        timespent: timespent
      };
      component
        .get('parseEventService')
        .postParseEvent(PARSE_EVENTS.CLICK_USAGE_REPORT, context);
    },

    /**
     * Action triggered when the user open the player
     */
    openPlayer: function() {
      this.firstResourceOpen();
    },

    onPlayNext: function() {
      this.resetProperty();
      this.sendAction('onPlayNext');
    },

    onEmptyNextPlay: function() {
      this.sendAction('onEmptyNextPlay');
    },

    onAcceptSuggestion: function() {
      this.sendAction('onAcceptSuggestion');
    },

    onIgnoreSuggestion: function() {
      this.sendAction('onIgnoreSuggestion');
    },

    showTimer() {
      this.toggleProperty('isShowStudyTimer');
    },

    showRelatedContentContainer() {
      this.toggleProperty('isShowRelatedContentContainer');
    },

    showNarrationContainer() {
      this.toggleProperty('isShowNarrationContainer');
    },

    showFeedbackContainer() {
      this.toggleProperty('isShowFeedbackContainer');
    },

    /**
     * Handle onPreviousResource event from qz-player-footer
     * @see components/player/qz-player-footer.js
     * @param {Resource} question
     */
    previousResource: function(resource) {
      const component = this;
      const next = component.get('collection').prevResource(resource);
      if (next) {
        this.set('isShowPullUp', false);
        Ember.$(window).scrollTop(0);
        component.stopPlayResource(next);
      }
    },

    /**
     * Handle onNextResource event from qz-player-footer
     * @see components/player/qz-player-footer.js
     * @param {Resource} question
     */
    nextResource: function(resource) {
      const component = this;
      component.set('queuedAction', false);
      const subEventInprogress = component.get('subEventInprogress');
      if (subEventInprogress) {
        component.set('queuedAction', true);
        component.set('nextActionResource', resource);
        return;
      }
      let resourcesPlayer = this.get('resourcesPlayer');
      let resourceResult = this.get('resourceResult');
      if (!resourceResult.get('resource.isResource')) {
        component.checkPartialScore(resourcesPlayer, resourceResult);
      }
      const next = component.get('collection').nextResource(resource);
      const userFeedback = component.get('userCategoryFeedback');
      component.resetProperty();
      if (next) {
        this.set('isShowPullUp', false);
        Ember.$(window).scrollTop(0);
        if (userFeedback && userFeedback.length) {
          let learningFeedback = component.getFeedbackObject();
          component
            .get('activityFeedbackService')
            .submitUserFeedback(learningFeedback)
            .then(() => {
              component.stopPlayResource(next);
            });
        } else {
          component.stopPlayResource(next);
        }
      }
    },

    /**
     * Triggered when a navigator resource is selected
     * @param {Resource} resource
     */
    selectNavigatorItem: function(resource) {
      const component = this;
      component.set('showFinishConfirmation', false);
      component.stopPlayResource(resource);
    },

    /**
     * Handle onSubmitQuestion event from qz-question-viewer
     * @see components/player/qz-question-viewer.js
     * @param {Resource} question
     * @param {QuestionResult} questionResult
     */
    submitQuestion: function(question) {
      const component = this;
      component.moveOrFinish(question);
      component.saveNoteData();
    },
    showPullUp: function() {
      const controller = this;
      const currentResource = controller.get('resource');
      if (currentResource.isResource) {
        controller.toggleProperty('isShowPullUp');
        $('.qz-main').removeClass('intial-narration-slide');
        let isShowPullUp = controller.get('isShowPullUp');
        controller.$('.narration').addClass('narration-slide');
        controller
          .$('.player-narration')
          .css('height', `${isShowPullUp ? 'auto' : ''}`);
        controller.$('.player-narration').css('left', '2%');
        if ($('body .player-narration').hasClass('naration-panel')) {
          $('.player-narration').removeClass('naration-panel');
          controller.set('isShowPullUp', true);
        }
      }
      controller.set('narrationValue', currentResource);
      if (controller.get('isShowPullUp')) {
        const context = {
          title: currentResource.title,
          type: currentResource.type,
          ownerId: currentResource.ownerId,
          narration: currentResource.narration,
          resourceId: currentResource.id
        };
        controller
          .get('parseEventService')
          .postParseEvent(PARSE_EVENTS.CLICK_NARRATION, context);
      }
    },
    onPullUpClose() {
      const controller = this;
      controller.set('isShowPullUp', false);
      controller.$('.player-narration').css('height', 'auto');
      if ($('body').hasClass('narration-slide')) {
        controller.$('.narration').removeClass('narration-slide');
      }
    },

    onCloseResouresContent() {
      this.resetProperty();
    },

    onDiagnosticNext() {
      let component = this;
      $(document).off('visibilitychange');
      if (component.get('isDiagnosticEnd')) {
        component.set('resource', null);
        component.set('collection.hasResources', false);
        component.sendAction('onDiagnosticNext');
        component.set('isDoneInitiate', false);
        component.set('sendContextFinish', false);
        component.set('categoryLists', null);
        component.set('attemptData', null);
      } else {
        component.send('submitAll');
      }
    },

    actionContent(metadata) {
      let component = this;
      component.set('content', metadata);
    },

    /**
     * Action triggered when toggle screen mode
     */
    onToggleScreen() {
      let component = this;
      component
        .get('parseEventService')
        .postParseEvent(PARSE_EVENTS.CLICK_STUDY_PLAYER_FULLSCREEN);
      component.toggleScreenMode();
    },

    /**
     * Action help to track the sub event for comprehension questions
     */
    onTriggerSubEvent(isFinished) {
      const component = this;
      const resource = component.get('nextActionResource');

      component.set('subEventInprogress', !isFinished);
      if (isFinished && component.get('queuedAction')) {
        if (resource) {
          component.send('nextResource', resource);
        } else {
          component.send('submitAll');
        }
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events

  didInsertElement: function() {
    this._super(...arguments);
    this.initiateComponent();
  },

  didDestroyElement() {
    $(document).off('visibilitychange');
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * The attempts played in a context
   * @property {Collection} attempts
   */
  attempts: Ember.computed('contextResult.context.attempts', function() {
    return this.get('contextResult.context.attempts');
  }),

  /**
   * @property {ContextResult} contextResult
   */
  contextResult: null,

  /**
   * The collection presented in this player
   * @property {Collection} collection
   */
  collection: Ember.computed('contextResult.collection', function() {
    return this.get('contextResult.collection');
  }),

  /**
   * The context presented in this player
   * @property {Context} context
   */
  context: Ember.computed('contextResult.context', function() {
    return this.get('contextResult.context');
  }),

  sessionId: Ember.computed('contextResult', function() {
    return this.get('contextResult.sessionId');
  }),

  /**
   * @property {EventContext} eventContext
   */
  eventContext: null,

  /**
   * @property {Boolean} sendContextFinish
   */
  sendContextFinish: false,

  /**
   * Indicates if the player needs to check the attempts
   * @property {boolean}
   */
  notCheckAttempts: true,

  /**
   * Is Assessment
   * @property {boolean}
   */
  isAssessment: Ember.computed('collection.isAssessment', function() {
    return this.get('collection.isAssessment');
  }),

  /**
   * Should resource navigation in the player be disabled?
   * @property {Boolean}
   */
  isNavigationDisabled: Ember.computed('collection', function() {
    return this.get('isAssessment') && !this.get('collection.bidirectional');
  }),

  /**
   * Indicates if the current resource type is resource
   * @property {boolean}
   */
  isResource: Ember.computed('resource', function() {
    const resource = this.get('resource');
    return resource && !resource.get('isQuestion');
  }),

  /**
   * Indicates if the student is playing the collection
   * @property {boolean}
   */
  isStudent: Ember.computed.equal('role', 'student'),

  /**
   * Indicates if the teacher is playing this collection
   * @property {boolean}
   */
  isTeacher: Ember.computed.equal('role', 'teacher'),

  /**
   * Indicates if the current resource type is resource
   * @property {boolean}
   */
  isNotIframeUrl: Ember.computed('resource', function() {
    const resource = this.get('resource');
    return resource && resource.displayGuide;
  }),

  /**
   * URL to redirect to student report
   * @property {String} reportURL
   */
  reportURL: null,

  /**
   * The resource playing
   * @property {Resource} resource
   */
  resource: null,

  /**
   * Query param
   * @property {string} resourceId
   */
  resourceId: null,

  /**
   * Number of events currently running
   * @property {Number} resourceEventCount
   */
  resourceEventCount: 0,

  /**
   * Return the list of resources available to show on the player
   * @property {ResourceResult[]}
   */
  resourcesPlayer: Ember.computed(
    'mapLocation.context',
    'collection.resourcesSorted',
    'contextResult.sortedResourceResults',
    function() {
      const availableResources = this.get('collection.resourcesSorted').mapBy(
        'id'
      );
      return this.get('contextResult.sortedResourceResults').filter(function(
        item
      ) {
        return item.resourceId && availableResources.includes(item.resourceId);
      });
    }
  ),

  /**
   * The resource result playing
   * @property {ResourceResult}
   */
  resourceResult: null,

  /**
   * Indicates the user's role, could be 'student', 'teacher' or null
   * This property is not used for the context-player
   * @property {string}
   */
  role: null,

  /**
   * @property {boolean} indicates if the answer should be saved
   */
  saveEnabled: true, // save only when logged in

  /**
   * Indicates if it should show the back button
   * @property {boolean}
   */
  showBackButton: true,

  /**
   * Indicates if content should be displayed
   * @property {boolean} showContent
   */
  showContent: false,

  /**
   * Indicates if show the assessment confirmation
   * @property {boolean} showConfirmation
   */
  showConfirmation: false,

  /**
   * Indicates if show immediate feedback
   * @property {boolean} showFeedback
   */
  showFeedback: Ember.computed('collection', function() {
    if (this.get('collection.isCollection')) {
      return this.get('isStudyPlayerCollectionShowCorrectAnswer')
        ? this.get('isStudyPlayerCollectionShowCorrectAnswer') === 'true'
        : true;
    } else {
      return this.get('collection.immediateFeedback');
    }
  }),

  /**
   * @property {String} It decide to show the back to collection or not.
   */
  showBackToCollection: true,

  /**
   * @property {String} It decide to show the back to course map or not.
   */
  showBackToCourseMap: true,

  /**
   * If the previous button should be shown
   * @property {boolean}
   */
  showPrevious: Ember.computed('resource', 'isNavigationDisabled', function() {
    const resource = this.get('resource');
    return (
      !!this.get('collection').prevResource(resource) &&
      !this.get('isNavigationDisabled')
    );
  }),

  /**
   * If the next button should be shown
   * @property {boolean}
   */
  showNext: Ember.computed('resource', function() {
    const resource = this.get('resource');
    return this.get('collection').nextResource(resource);
  }),

  /**
   * Indicates if the report should be displayed
   * @property {boolean} showReport
   */
  showReport: false,

  /**
   * Query param indicating if it is a collection or assessment
   * @property {string}
   */
  type: null,

  /**
   * If there is a back event to perform
   * @property {function}
   */
  onClosePlayer: null,

  /**
   * Check whether next button is enabled or not
   */
  isNextEnabled: true,

  /**
   * @property {Boolean} isShowActivityFeedback
   * Property to evaluate whether the feedback tab should shown
   */
  isShowActivityFeedback: false,

  /**
   * @property {array[]} feedbackCategory
   * store feedback category list
   */
  feedbackCategory: null,

  /**
   * @property {boolean} isShowFeedback
   * Property to show/hide feedback component
   */
  isShowFeedback: false,

  isCollection: Ember.computed('collection', function() {
    return this.get('collection.isCollection');
  }),

  resourceContentOrder: 0,
  /**
   * @property {boolean} isShowStudyTimer
   * Property to show/hide study timer component
   */
  isShowStudyTimer: true,

  /**
   * @property {boolean} isShowRelatedContentContainer
   * Property to show/hide Related content component
   */
  isShowRelatedContentContainer: false,

  /**
   * @property {boolean} isShowFeedbackContainer
   * Property to show/hide feedback component
   */
  isShowFeedbackContainer: false,

  /**
   * @property {boolean} isShowNarrationContainer
   * Property to show/hide narration component
   */
  isShowNarrationContainer: false,

  isOpenLeftPanal: true,

  /**
   * @property {Boolean} Indicate if the context has more attempts available
   */
  noMoreAttempts: Ember.computed(
    'collection.isAssessment',
    'collection.attempts',
    'attempts',
    function() {
      return (
        this.get('collection.isAssessment') &&
        this.get('collection.attempts') > 0 &&
        this.get('attempts') &&
        this.get('attempts') >= this.get('collection.attempts')
      );
    }
  ),

  /**
   * @property {Boolean}
   * Is suggested content
   */
  isSuggestedContent: Ember.computed('pathType', function() {
    let component = this;
    let pathType = component.get('pathType');
    return pathType === 'teacher' || pathType === 'system';
  }),

  diagnosticActive: Ember.computed(
    'mapLocation.context.itemSubType',
    function() {
      return this.get('mapLocation.context.itemSubType') === 'diagnostic';
    }
  ),

  isDiagnosticEnd: Ember.computed(
    'mapLocation',
    'mapLocation.context.status',
    function() {
      return this.get('mapLocation.context.status') === 'diagnostic-end';
    }
  ),

  isInitiated: false,

  isDoneInitiate: false,

  diagnosticObserver: Ember.observer('isInitiated', function() {
    if (this.get('isInitiated') && !this.get('isDoneInitiate')) {
      this.set('isDoneInitiate', true);
      if (!this.get('isDiagnosticEnd')) {
        this.initiateComponent();
      }
    }
  }),

  // -------------------------------------------------------------------------
  // Methods

  checkPartialScore: function(resourcesPlayer, resourceResult) {
    const component = this;
    let resourceUseAns = getObjectsDeepCopy(resourceResult.get('answer'));
    let resourceCorrectAns = getObjectsDeepCopy(
      resourceResult.get('resource.correctAnswer')
    );
    const resourceType = resourceResult.get('resource.type');
    let isCorrect =
      JSON.stringify(resourceUseAns).toLowerCase() ===
      JSON.stringify(resourceCorrectAns).toLowerCase();
    let isPartialCorrect = false;
    if (!resourceCorrectAns) {
      isCorrect = true;
    }
    if (!isCorrect) {
      if (
        resourceType === 'serp_lang_identify_base_word' ||
        resourceType === 'serp_lang_vowel_teams' ||
        resourceType === 'serp_lang_counting_syllables' ||
        resourceType === 'serp_sorting' ||
        resourceType === 'serp_identify_vowel_sound_activity_question'
      ) {
        resourceUseAns = component.convertToObject(resourceUseAns);
        resourceCorrectAns = component.convertToObject(resourceCorrectAns);
      }
      for (let i = 0; i < resourceUseAns.length; i++) {
        if (resourceType === 'text_entry' || resourceType === 'drag_and_drop') {
          if (
            resourceUseAns[i] &&
            resourceUseAns[i].value &&
            resourceCorrectAns[i] &&
            resourceCorrectAns[i].value
          ) {
            resourceUseAns[i].isCorrect =
              resourceUseAns[i].value === resourceCorrectAns[i].value;
          } else {
            resourceUseAns[i].isCorrect = false;
          }
        } else if (
          resourceType === 'serp_lang_identify_base_word' ||
          resourceType === 'serp_lang_vowel_teams' ||
          resourceType === 'serp_lang_counting_syllables' ||
          resourceType === 'serp_identify_vowel_sound_activity_question'
        ) {
          let userArray = resourceUseAns[i].value;
          let correctArray = resourceCorrectAns[i].value;
          var ItemIndex;
          userArray.forEach(function(item) {
            if (resourceType === 'serp_lang_counting_syllables') {
              ItemIndex = correctArray.findIndex(
                b =>
                  b.text.toLowerCase() === item.text.toLowerCase() &&
                  b.crossposition === item.crossPosition &&
                  b.inputvalue === item.inputValue
              );
            } else if (resourceType === 'serp_lang_identify_base_word') {
              ItemIndex = correctArray.findIndex(
                b =>
                  b.word_text.toLowerCase() === item.word_text.toLowerCase() &&
                  b.start === item.start &&
                  b.end === item.end
              );
            } else if (resourceType === 'serp_lang_vowel_teams') {
              ItemIndex = correctArray.findIndex(
                b =>
                  b.text.toLowerCase() === item.text.toLowerCase() &&
                  b.start === item.start &&
                  b.end === item.end &&
                  b.crosspositions === item.crossPositions
              );
            } else if (
              resourceType === 'serp_identify_vowel_sound_activity_question'
            ) {
              ItemIndex = correctArray.findIndex(
                b =>
                  b.text.toLowerCase() === item.text.toLowerCase() &&
                  b.crossposition === item.crossPosition &&
                  b.iscross === item.isCross &&
                  b.isshort === item.isShort
              );
            }
            if (ItemIndex !== -1) {
              item.isCorrect = true;
            } else {
              item.isCorrect = false;
            }
          });
          let userCorrectAnw = userArray.filterBy('isCorrect');
          if (correctArray.length === userCorrectAnw.length) {
            resourceUseAns[i].isCorrect = true;
          } else if (
            userCorrectAnw.length !== 0 &&
            correctArray.length > userCorrectAnw.length
          ) {
            resourceUseAns[i].isPartialCorrect = true;
          } else {
            resourceUseAns[i].isCorrect = false;
          }
        } else if (resourceType === 'serp_sorting') {
          resourceUseAns[i].isCorrect =
            resourceUseAns[i].value[0].answer_text.toLowerCase() ===
              resourceCorrectAns[i].value[0].answer_text.toLowerCase() &&
            resourceUseAns[i].value[0].answer_type.toLowerCase() ===
              resourceCorrectAns[i].value[0].answer_type.toLowerCase();
        } else {
          let correctAnswer = resourceCorrectAns.filterBy(
            'value',
            resourceUseAns[i].value
          );
          if (correctAnswer.length) {
            resourceUseAns[i].isCorrect = true;
          } else {
            resourceUseAns[i].isCorrect = false;
          }
        }
      }
      let userCorrectAnw = resourceUseAns.filterBy('isCorrect');
      let userPartialAnw = resourceUseAns.filterBy('isPartialCorrect');
      if (userCorrectAnw.length === resourceCorrectAns.length) {
        if (resourceCorrectAns.length === resourceUseAns.length) {
          isCorrect = true;
        } else {
          isPartialCorrect = true;
        }
      } else if (userCorrectAnw.length > 0 || userPartialAnw.length) {
        isPartialCorrect = true;
      } else {
        if (resourceType === 'multiple_choice' && resourceUseAns.length === 0) {
          isPartialCorrect = true;
        } else {
          isCorrect = false;
        }
      }
    }
    let lastPlayResource = resourcesPlayer.findBy(
      'resourceId',
      resourceResult.get('resourceId')
    );
    lastPlayResource.set('isCorrect', isCorrect);
    lastPlayResource.set('isPartialCorrect', isPartialCorrect);
  },

  convertToObject: function(array) {
    return array.map(item => {
      item.value = JSON.parse(item.value);
      return item;
    });
  },

  fetchAttemptData() {
    const component = this;
    let contextId = component.get('context')
      ? component.get('context.id')
      : component.get('contextResult.contextId');
    let profileId = component.get('session.userData.gooruUId');
    component
      .get('quizzesAttemptService')
      .getAttemptIds(contextId, profileId)
      .then(attemptIds =>
        !attemptIds || !attemptIds.length
          ? {}
          : component
            .get('quizzesAttemptService')
            .getAttemptData(attemptIds[attemptIds.length - 1])
      )
      .then(attemptData => {
        component.set('attemptData', attemptData);
      });
  },

  /**
   * Saves an assessment result
   */
  finishCollection: function() {
    // Disable navigation so resource events are not called after finishing
    this.set('isNavigationDisabled', true);
    this.set('sendContextFinish', true);
  },

  /**
   * Opens the confirmation dialog to finish the assessment
   */
  finishConfirm: function() {
    this.resetProperty();
    this.set('showFinishConfirmation', true);
  },

  /**
   * Moves to the next resource or finishes the collection
   * @param {Resource} resource
   */
  moveOrFinish: function(resource) {
    const component = this;
    let resourcesPlayer = this.get('resourcesPlayer');
    let resourceResult = this.get('resourceResult');
    if (!resourceResult.get('resource.isResource')) {
      component.checkPartialScore(resourcesPlayer, resourceResult);
    }
    const next = component.get('collection').nextResource(resource);
    if (next) {
      Ember.$(window).scrollTop(0);
      component.stopPlayResource(next);
    } else {
      if (component.get('diagnosticActive')) {
        $(document).off('visibilitychange');
        if (component.get('isDiagnosticEnd')) {
          component.set('resource', null);
          component.sendAction('onDiagnosticNext');
          component.set('isDoneInitiate', false);
          component.set('sendContextFinish', false);
          component.set('categoryLists', null);
          component.set('attemptData', null);
        } else {
          component.send('submitAll');
        }
      } else {
        const contextResult = component.get('contextResult');
        const resourceResult = component.get('resourceResult');
        return component
          .saveResourceResult(null, contextResult, resourceResult)
          .then(() => component.finishConfirm());
      }
    }
  },

  /**
   * Moves to resource
   * @param {Resource} resource
   */
  stopPlayResource: function(resource, firstTime) {
    const component = this;
    const contextResult = component.get('contextResult');
    let resourceResult = component.get('resourceResult');
    const resourceId = resource.get('id');
    const collection = component.get('collection');
    const categoryLists = component.get('categoryLists');
    let type = resource.get('isResource')
      ? CONTENT_TYPES.RESOURCE
      : CONTENT_TYPES.QUESTION;
    let resourceCategory = categoryLists.get(`${type}s`);
    component.set('isShowActivityFeedback', true);
    if (resourceCategory && resourceCategory.length) {
      component.set(
        'feedbackCategory',
        resourceCategory.sortBy('feedbackTypeId')
      );
      component.set('format', type);
    } else {
      component.set('feedbackCategory', null);
    }
    if (resource.get('isResource')) {
      component.set('isNextEnabled', true);
    }
    component.getOwnerProfile(resource, collection).then(function() {
      if (resourceResult) {
        resourceResult.set('skipped', false);
      }
      return component
        .saveResourceResult(
          resourceId,
          contextResult,
          resourceResult,
          firstTime
        )
        .then(
          function() {
            Ember.run(() => component.set('resource', null));
            resourceResult = contextResult.getResultByResourceId(resourceId);
            resourceResult.set('startTime', new Date().getTime());
            component.setProperties({
              showReport: false,
              resourceId,
              resource,
              resourceResult
            }); //saves the resource status
          },
          function() {
            const message = component
              .get('i18n')
              .t('common.errors.getting-next-resource').string;
            component.get('quizzesNotifications').error(message);
          }
        );
    });
    if (resource.isResource && resource.narration) {
      Ember.run.later(() => {
        $('.qz-main').addClass('intial-narration-slide');
        let narrationDiscription = resource.narration;
        let snippet = document.createElement('div');
        snippet.innerHTML = narrationDiscription;
        let links = snippet.getElementsByTagName('a');
        for (var i = 0; i < links.length; i++) {
          links[i].setAttribute('target', '_blank');
        }
        resource.set('narration', snippet.innerHTML);
        component.set('isShowPullUp', true);
      });
    }
    component.set('narrationValue', resource);
  },

  /**
   * When the submission is complete
   */
  onFinish: null,

  /**
   * Saves the resource result and moves to the next
   * @param resourceId
   * @param contextResult
   * @param resourceResult
   * @returns {Promise.<boolean>}
   */
  saveResourceResult: function(
    resourceId,
    contextResult,
    resourceResult,
    firstTime
  ) {
    const component = this;
    let promise = Ember.RSVP.resolve();
    const save = component.get('saveEnabled');
    if (save) {
      const contextId = contextResult.get('contextId');
      const eventContext = component.get('eventContext');
      component.incrementProperty('resourceEventCount');
      if (!resourceResult) {
        resourceResult = contextResult.getResultByResourceId(resourceId);

        resourceResult.set('startTime', new Date().getTime());
      }
      if (firstTime && !contextResult.hasStarted) {
        component.setLastPlayedResource(
          resourceId,
          contextId,
          eventContext,
          contextResult
        );
        component
          .get('contextService')
          .startPlayResource(resourceId, contextId, eventContext)
          .then();
      } else if (firstTime && contextResult.hasStarted) {
        component.setLastPlayedResource(
          resourceId,
          contextId,
          eventContext,
          contextResult
        );
        component
          .get('contextService')
          .resumePlayResource(resourceId, contextId, eventContext)
          .then();
      } else {
        resourceResult.set('stopTime', new Date().getTime());
      }
      promise = firstTime
        ? Ember.RSVP.resolve()
        : component
          .get('contextService')
          .stopPlayResource(
            resourceResult.resourceId,
            contextId,
            resourceResult,
            eventContext
          )
          .catch(() =>
            component
              .get('contextService')
              .stopPlayResource(
                resourceResult.resourceId,
                contextId,
                resourceResult,
                eventContext
              )
          )
          .then(result => {
            if (resourceId) {
              component.setLastPlayedResource(
                resourceId,
                contextId,
                eventContext,
                contextResult
              );
              component
                .get('contextService')
                .startPlayResource(resourceId, contextId, eventContext)
                .then();
            }
            resourceResult.set('score', result.score);
          });
      promise = promise.then(
        () => component.decrementProperty('resourceEventCount'),
        () => {
          component.decrementProperty('resourceEventCount');
          component.saveNoteData();
          return Ember.RSVP.reject();
        }
      );
    }
    return promise;
  },

  /**
   * Starts the assessment or collection
   */
  startAssessment: function() {
    const component = this;
    component.saveNoteData();
    const collection = component.get('collection');
    const contextResult = component.get('contextResult');
    const hasResources = collection.get('hasResources');
    let resource = null;

    component.set('showContent', true);
    let resourceResults = component.get('contextResult.resourceResults');
    if (hasResources) {
      resource = contextResult.get('currentResource');
      if (component.get('resourceId')) {
        //if has a resource id as query param
        resource = collection.getResourceById(component.get('resourceId'));
      }
      if (!resource) {
        resource = collection.get('resources').objectAt(0);
      }
    }
    if (
      (resource && resource.get('isScientificFIB')) ||
      (resource && resource.get('isScientificFreeResponse'))
    ) {
      if (!collection.get('isCollection')) {
        component
          .get('collectionService')
          .getAssessment(collection.get('id'))
          .then(function(rubricResult) {
            let assessmentInfo = rubricResult.get('content');
            let result = resourceResults.map(function(resource) {
              let activeResource = assessmentInfo.findBy(
                'id',
                resource.get('resourceId')
              );
              resource.set('rubric', activeResource);
              return resource;
            });
            component.set('contextResult.resourceResults', result);
          });
      } else {
        component
          .get('collectionService')
          .getCollection(collection.get('id'))
          .then(function(rubricResult) {
            let assessmentInfo = rubricResult.get('content');
            let result = resourceResults.map(function(resource) {
              let activeResource = assessmentInfo.findBy(
                'id',
                resource.get('resourceId')
              );
              resource.set('rubric', activeResource);
              return resource;
            });
            component.set('contextResult.resourceResults', result);
          });
      }
    }
    component.saveNoteData();
    if (resource) {
      component.stopPlayResource(resource, true);
    }
  },
  /**
   * Find owner profile if the resource has narration or is a link out resource
   */
  getOwnerProfile: function(resource, collection) {
    const component = this;
    let promise = Ember.RSVP.resolve();
    const resourceId = resource.ownerId;
    const collectionId = collection.ownerId;
    if (resource.get('narration') || resource.get('displayGuide')) {
      const profiles = [resourceId, collectionId];
      promise = component
        .get('profileService')
        .readProfiles(profiles)
        .then(function(result) {
          resource.set('owner', result[resourceId]);
          collection.set('avatarUrl', result[collectionId].get('avatarUrl'));
          collection.set('author', result[collectionId].get('username'));
        });
    }
    return promise;
  },

  /**
   * @function fetchActivityFeedbackCateory
   * Method to fetch learning activity feedback
   */

  fetchActivityFeedbackCateory() {
    const component = this;
    let role = component.get('session.role')
      ? component.get('session.role')
      : ROLES.STUDENT;
    let userCategoryId = FEEDBACK_USER_CATEGORY[`${role}`];
    return component
      .get('activityFeedbackService')
      .getFeedbackCategory(userCategoryId)
      .then(categoryLists => {
        component.set('categoryLists', categoryLists);
      });
  },

  /**
   * @function getFeedbackObject
   * Method to return feedback objective
   */

  getFeedbackObject() {
    const component = this;
    let userId = component.get('session.userId');
    let role = component.get('session.role')
      ? component.get('session.role')
      : ROLES.STUDENT;
    let userCategoryId = FEEDBACK_USER_CATEGORY[`${role}`];
    let userFeedback = Ember.A([]);
    let categoryLists = component.get('userCategoryFeedback');
    let resource = component.get('resource');
    categoryLists.map(category => {
      let feedbackObj = {
        feeback_category_id: category.categoryId
      };
      if (category.feedbackTypeId === FEEDBACK_RATING_TYPE.QUANTITATIVE) {
        feedbackObj.user_feedback_quantitative = category.rating;
      } else if (category.feedbackTypeId === FEEDBACK_RATING_TYPE.BOTH) {
        feedbackObj.user_feedback_qualitative = category.comments;
      } else if (category.feedbackTypeId === FEEDBACK_RATING_TYPE.QUALITATIVE) {
        feedbackObj.user_feedback_qualitative = category.quality;
      }
      userFeedback.pushObject(feedbackObj);
    });
    let userFeedbackObj = {
      content_id: resource.get('id'),
      content_type: resource.get('isResource')
        ? CONTENT_TYPES.RESOURCE
        : CONTENT_TYPES.QUESTION,
      user_category_id: userCategoryId,
      user_feedbacks: userFeedback,
      user_id: userId
    };
    return userFeedbackObj;
  },

  setLastPlayedResource(resourceId, contextId, eventContext, contextResult) {
    const resourceResult = contextResult.getResultByResourceId(resourceId);
    const lastPlayedResource = {
      resourceId,
      contextId,
      eventContext,
      resourceResult
    };
    resourceResult.set('startTime', new Date().getTime());
    window.lastPlayedResource = lastPlayedResource;
  },

  // -------------------------------------------------------------------------
  // Observers
  /**
   * Observes to send the finish event when the event count reaches zero
   */
  onEventCountChange: function() {
    const component = this;
    if (
      component.get('resourceEventCount') === 0 &&
      component.get('sendContextFinish')
    ) {
      const contextResult = component.get('contextResult');
      const contextId = contextResult.get('contextId');
      const eventContext = component.get('eventContext');
      const promise = !component.get('saveEnabled')
        ? Ember.RSVP.resolve()
        : component
          .get('contextService')
          .finishContext(contextId, eventContext);
      promise.then(() => {
        if (component.get('diagnosticActive')) {
          component.set('resource', null);
          component.sendAction('onDiagnosticNext');
          component.set('isDoneInitiate', false);
          component.set('sendContextFinish', false);
          component.set('categoryLists', null);
          component.set('attemptData', null);
        } else {
          component.get('onFinish') && component.sendAction('onFinish');
        }
        window.lastPlayedResource = null;
      });
    }
  }.observes('resourceEventCount', 'sendContextFinish'),

  // -------------------------------------------------------------------------
  // Handle the custom events.

  intialize() {
    window.lastPlayedResource = null;
    const component = this;

    let showStudyPlayerLeftPanelOnInitialLoad = component.get(
      'showStudyPlayerLeftPanelOnInitialLoad'
    );
    if (showStudyPlayerLeftPanelOnInitialLoad !== undefined) {
      component.set('isOpenLeftPanal', showStudyPlayerLeftPanelOnInitialLoad);
    }

    $(document).on('visibilitychange', function() {
      component.visibilityChange(component);
    });
  },

  visibilityChange(component) {
    if (window.lastPlayedResource && window.lastPlayedResource.resourceId) {
      const context = window.lastPlayedResource;
      const contextResult = component.get('contextResult');
      const resourceResult = contextResult.getResultByResourceId(
        context.resourceId
      );
      if (document.hidden) {
        resourceResult.set('stopTime', new Date().getTime());
        window.lastPlayedResource.resourceResult = resourceResult;
        component
          .get('contextService')
          .pausePlayResource(
            context.resourceId,
            context.contextId,
            resourceResult,
            context.eventContext
          )
          .then();
      } else {
        resourceResult.set('startTime', new Date().getTime());
        window.lastPlayedResource.resourceResult = resourceResult;
        component
          .get('contextService')
          .resumePlayResource(
            context.resourceId,
            context.contextId,
            context.eventContext
          )
          .then();
      }
    }
  },

  resetProperty() {
    this.set('isShowFeedbackContainer', false);
    this.set('isShowNarrationContainer', false);
    this.set('isShowRelatedContentContainer', false);
    this.set('isShowStudyTimer', this.get('isShowStudyTimer'));
    this.saveNoteData();
  },

  firstResourceOpen() {
    const component = this;
    const startContext = component.get('startContextFunction');
    startContext().then(function(contextResult) {
      contextResult.merge(component.get('collection'));
      component.set('contextResult', contextResult);
      component.set('showConfirmation', false);
      component.startAssessment();
      const context = {
        collectionId: contextResult.collectionId,
        contextId: contextResult.contextId,
        currentResourceId: contextResult.currentResourceId
      };
      component
        .get('parseEventService')
        .postParseEvent(PARSE_EVENTS.START, context);
    });
  },

  initiateComponent() {
    const component = this;
    this.intialize();
    this.fetchAttemptData();
    this.set('isInitiated', false);
    this.fetchActivityFeedbackCateory().then(() => {
      component.saveNoteData();
      if (
        this.get('isAnonymous') ||
        this.get('isTeacher') ||
        !this.get('isStudyPlayer')
      ) {
        this.set('showConfirmation', false);
        this.startAssessment();
      } else {
        if (!this.get('noMoreAttempts')) {
          this.set('showConfirmation', false);
          this.firstResourceOpen();
        }
      }
    });
  },

  /**
   * @function toggleScreenMode
   * Method to toggle fullscreen mode
   */
  toggleScreenMode() {
    let component = this;
    Ember.$('body').toggleClass('fullscreen');
    component.toggleProperty('isFullScreen');
    component.set('isOpenLeftPanal', !component.get('isFullScreen'));
  },

  saveNoteData() {
    let contextResult = this.get('contextResult');
    let eventContext = this.get('eventContext');
    let collection = this.get('collection');
    let classDetail = this.get('class');
    window.sourceDetailsNoteTool = {};
    window.sourceDetailsNoteTool.class_id = classDetail
      ? classDetail.get('id')
      : null;
    window.sourceDetailsNoteTool.course_id = classDetail
      ? classDetail.get('courseId')
      : null;
    window.sourceDetailsNoteTool.collection_id = contextResult
      ? contextResult.get('collectionId')
      : null;
    window.sourceDetailsNoteTool.resource_id = contextResult
      ? contextResult.get('currentResourceId')
      : null;
    window.sourceDetailsNoteTool.session_id = contextResult
      ? contextResult.get('sessionId')
      : null;
    window.sourceDetailsNoteTool.source = eventContext
      ? eventContext.get('source')
      : null;
    window.sourceDetailsNoteTool.tx_comp_code = collection.standards
      ? this.getTxCode(collection.standards)
      : [];
  },

  getTxCode(list) {
    const txArray = [];
    if (list && list.length > 0) {
      for (const iterator of list) {
        txArray.push(iterator.id);
      }
    }
    return txArray;
  }
});
