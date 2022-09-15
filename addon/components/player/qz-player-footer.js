import Ember from 'ember';
import {
  EMOTION_VALUES,
  PLAYER_EVENT_MESSAGE
} from 'quizzes-addon/config/quizzes-config';
import { PARSE_EVENTS } from 'quizzes-addon/config/parse-event';

/**
 * Player navigation
 *
 * Component responsible for showing simple navigation controls (i.e. back/next)
 * for the player. It may embed other components for interacting with the player.
 *
 * @module
 * @see controllers/player.js
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @property {Service} parseEvent service
   */
  parseEventService: Ember.inject.service('quizzes/api-sdk/parse-event'),

  didRender() {
    let component = this;
    component.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
  },

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['qz-player-footer'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Action triggered when the user change the emotion
     * @see qz-emotion-picker
     */
    changeEmotion: function(emotionScore) {
      let component = this;
      let resource = component.get('resource');
      let unicode = component.selectedEmotionUnicode(emotionScore);
      component
        .$(`#resource-${resource.id}`)
        .find('svg use')
        .attr(
          'xlink:href',
          `/assets/quizzes-addon/emoji-one/emoji.svg#${unicode}`
        );
      this.sendAction('onChangeEmotion', emotionScore);
    },

    /**
     * Action triggered for the next button hover
     */
    onShowFeedback: function() {
      this.set('isShowFeedback', true);
    },

    /**
     * Action triggered for the next button move out
     */
    onCloseFeedback: function() {
      this.set('isShowFeedback', false);
    },

    /**
     * Action triggered when the user open the navigator panel
     */
    onOpenNavigator: function() {
      let component = this;
      component.set('isNavigatorOpen', true);
      component.$('.list-resources').slideDown();
    },

    /**
     * Action triggered when the user close the navigator panel
     */
    onCloseNavigator: function() {
      let component = this;
      component.set('isNavigatorOpen', false);
      component.$('.list-resources').slideUp();
    },

    onToggleResourceNav() {
      let component = this;
      component.$('.list-resources').slideToggle();
      component.toggleProperty('isNavigatorOpen');
      if (component.get('isNavigatorOpen')) {
        $('.player-narration').addClass('naration-panel');
      }
    },

    /**
     *
     * Triggered when an item is selected
     * @param item
     */
    selectItem: function(item) {
      this.selectItem(item.resource);
    },

    /**
     * Action triggered when the user wants to finish the collection
     */
    finishCollection: function() {
      let component = this;
      component.sendAction('onFinishCollection');
    },

    /**
     * Action triggered when the user clicks at see usage report
     */
    seeUsageReport: function() {
      let component = this;
      component.sendAction('onFinishCollection');
    },
    /***
     * Return to previous resource
     * @param {Resource} question
     */
    previousResource: function() {
      const component = this;
      component.$('.content').scrollTop(0);
      component.sendAction('onPreviousResource', component.get('resource'));
      // Todo-later
      const context = {
        unitId: this.get('unit') ? this.get('unit').id : null,
        lessonId: this.get('lesson') ? this.get('lesson').id : null,
        courseId: this.get('course') ? this.get('course').id : null,
        classId: this.get('classId') ? this.get('classId') : null,
        resourceId: component.get('resource').id,
        ownerId: component.get('resource').ownerId,
        title: component.get('resource').title,
        type: component.get('resource').type,
        taxonomy: this.get('course') ? this.get('course').taxonomy : null
      };
      component
        .get('parseEventService')
        .postParseEvent(PARSE_EVENTS.CLICK_PREVIOUS_RESOURCE, context);
    },

    /***
     * Return to previous resource
     * @param {Resource} question
     */
    nextResource: function() {
      const component = this;
      component.$('.content').scrollTop(0);
      component.sendAction('onNextResource', component.get('resource'));
      // Todo-later
      const context = {
        unitId: this.get('unit') ? this.get('unit').id : null,
        lessonId: this.get('lesson') ? this.get('lesson').id : null,
        courseId: this.get('course') ? this.get('course').id : null,
        classId: this.get('classId') ? this.get('classId') : null,
        resourceId: component.get('resource').id,
        ownerId: component.get('resource').ownerId,
        title: component.get('resource').title,
        type: component.get('resource').type,
        taxonomy: this.get('course') ? this.get('course').taxonomy : null
      };
      component
        .get('parseEventService')
        .postParseEvent(PARSE_EVENTS.CLICK_NEXT_RESOURCE, context);
    },

    /**
     * Action triggered when toggle screen mode
     */
    onToggleScreen() {
      let component = this;
      component.toggleScreenMode();
    },

    onExit() {
      window.parent.postMessage(PLAYER_EVENT_MESSAGE.GRU_PUllUP_CLOSE, '*');
    },

    start() {
      this.sendAction('onStartPlayer');
    },

    playNext() {
      this.sendAction('onPlayNext');
    },
    emptyNextPlay() {
      this.sendAction('onEmptyNextPlay');
    },

    showTimer() {
      this.get('parseEventService').postParseEvent(
        PARSE_EVENTS.CLICK_STUDENT_PLAYER_STUDY_TIMER
      );
      this.sendAction('showTimer');
    },

    showRelatedContentContainer() {
      this.get('parseEventService').postParseEvent(
        PARSE_EVENTS.CLICK_STUDY_PLAYER_RELATED_CONTENT
      );
      this.sendAction('showRelatedContentContainer');
    },

    showNarrationContainer() {
      this.get('parseEventService').postParseEvent(
        PARSE_EVENTS.CLICK_STUDENT_PLAYER_STUDY_INSTRUCTION
      );
      this.sendAction('showNarrationContainer');
    },

    showFeedbackContainer() {
      this.get('parseEventService').postParseEvent(
        PARSE_EVENTS.CLICK_STUDENT_PLAYER_STUDY_FEEDBACK
      );
      this.sendAction('showFeedbackContainer');
    },

    toggleLeftPanel() {
      this.get('parseEventService').postParseEvent(
        PARSE_EVENTS.CLICK_STUDY_PLAYER_QUESTION_INFO
      );
      this.toggleProperty('isOpenLeftPanal');
    },

    onDiagnosticNext() {
      if (this.get('showNext') && !this.get('isDiagnosticEnd')) {
        this.send('nextResource');
      } else {
        this.sendAction('onDiagnosticNext');
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {string} on change emotion action
   */
  onChangeEmotion: 'onChangeEmotion',

  /**
   * @property {number} The rating score for the current resource
   */
  ratingScore: 0,

  /**
   * Indicates if changes can be made
   * @property {boolean} readOnly
   */
  readOnly: false,

  /**
   * @property {Collection}
   */
  collection: null,

  /**
   * @property {String} It will decided to show react widget or not
   */
  showReactButton: true,

  /**
   * @property {String} selectedResourceId - resource Id selected
   */
  selectedResourceId: null,

  /**
   * @property {string|function} onItemSelected - event handler for when an item is selected
   */
  onItemSelected: null,

  /**
   * Indicates when the collection is already submitted
   * @property {boolean}
   */
  submitted: false,

  /**
   * Resource result for the selected resource
   * @property {ResourceResult}
   */
  resourceResults: Ember.A([]),

  hasAllCards: Ember.computed(
    'diagnosticActive',
    'feedbackCategory',
    'isShowActivityFeedback',
    function() {
      const showConfirmation = this.get('showConfirmation');
      const suggestedResources = this.get('suggestedResources');
      const diagnosticActive = this.get('diagnosticActive');
      const isCollection = this.get('isCollection');
      const feedbackCategory = this.get('feedbackCategory');
      const isShowActivityFeedback = this.get('isShowActivityFeedback');
      return (
        !showConfirmation &&
        suggestedResources &&
        isCollection &&
        !diagnosticActive &&
        feedbackCategory &&
        isShowActivityFeedback
      );
    }
  ),

  /**
   * A convenient structure to render the menu
   * @property
   */
  resourceItems: Ember.computed(
    'collection',
    'resourceResults.@each.value',
    'selectedResourceId',
    'showFinishConfirmation',
    function() {
      const component = this;
      const collection = component.get('collection');
      const resourceResults = component.get('resourceResults');
      return resourceResults.map(function(resourceResult) {
        const resourceId = resourceResult.get('resource.id');
        const ratingScore = resourceResult.get('reaction');
        return {
          resource: collection.getResourceById(resourceId),
          started: resourceResult.get('started'),
          isCorrect: resourceResult.get('isCorrect'),
          selected: resourceId === component.get('selectedResourceId'),
          unicode: component.selectedEmotionUnicode(ratingScore),
          isResource: resourceResult.get('isResource')
        };
      });
    }
  ),
  /**
   * @property
   */
  resourceButton: Ember.computed(
    'resource',
    'isShowStudyTimerWidget',
    'suggestedResources',
    'isShowActivityFeedback',
    function() {
      const component = this;
      let isShowStudyTimerWidget = component.get('isShowStudyTimerWidget');
      let suggestedResources = component.get('suggestedResources');
      let isShowActivityFeedback = component.get('isShowActivityFeedback');
      let resource = component.get('resource');
      return (
        isShowStudyTimerWidget &&
        resource &&
        resource.isResource &&
        suggestedResources &&
        isShowActivityFeedback
      );
    }
  ),

  /**
   * Should resource links in the navigator be disabled?
   * @property {boolean}
   */
  isNavigationDisabled: false,

  /**
   * It will maintain the state of navigator pull up
   * @property {boolean}
   */
  isNavigatorOpen: false,

  /**
   * Property used to  identify whether collection object has items to play.
   */
  hasCollectionItems: Ember.computed('collection', function() {
    let collection = this.get('collection');
    let contentCount = this.getResourceQuestionCount(collection.resources);
    let resourceCount = contentCount.resourceCount;
    let questionCount = contentCount.questionCount;
    let hasCollectionItems = false;
    let isCollection = this.get('collection.isCollection');
    if (isCollection && (resourceCount > 0 || questionCount > 0)) {
      hasCollectionItems = true;
    } else if (questionCount > 0) {
      hasCollectionItems = true;
    }
    return hasCollectionItems;
  }),

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

  playAttempts: Ember.computed(
    'collection',
    'lesson',
    'lessonList',
    'unitList',
    function() {
      const component = this;
      const collection = component.get('collection');
      const lesson = component.get('lesson');
      const lessonDetails = component.get('lessonList');
      const unitList = component.get('unitList');
      const lessonLength = lessonDetails.length;
      const activeLesson = lessonDetails.findBy('id', lesson.get('id'));
      const lIndex = lessonDetails.findIndex(
        item => item.id === lesson && lesson.get('id')
      );
      const lessonIndex = lIndex + 1;
      const unitLength = unitList.length;
      const uIndex = unitList.findIndex(
        item => item.id === activeLesson && activeLesson.get('unit_id')
      );
      const unitIndex = uIndex + 1;
      const lessonData = lesson.get('children');
      const collectionLength = lessonData.length;
      const activeCollection = lessonData.findBy('id', collection.get('id'));
      const cIndex = lessonData.findIndex(
        item => item.id === collection && collection.get('id')
      );
      const collectionIndex = cIndex + 1;
      const isMilestoneLesson = lesson && lesson.get('isMilestoneLesson');
      return isMilestoneLesson
        ? true
        : activeCollection &&
            activeCollection.get('resourceCount') === 0 &&
            activeCollection &&
            activeCollection.get('questionCount') === 0 &&
            unitIndex === unitLength &&
            lessonLength === lessonIndex &&
            collectionLength === collectionIndex;
    }
  ),

  isDiagnosticEnd: false,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Triggered when a resource item is selected
   * @param {Resource} resource
   */
  selectItem: function(resource) {
    if (resource && !this.get('isNavigationDisabled')) {
      if (this.get('onItemSelected')) {
        this.sendAction('onItemSelected', resource);
        const unit = this.get('unit');
        const lesson = this.get('lesson');
        const course = this.get('course');
        const context = {
          unitId: unit ? unit.id : null,
          lessonId: lesson ? lesson.id : null,
          courseId: course ? course.id : null,
          classId: this.get('classId') ? this.get('classId') : null,
          resourceId: resource.id,
          ownerId: resource.ownerId,
          title: resource.title,
          type: resource.type
        };
        this.get('parseEventService').postParseEvent(
          PARSE_EVENTS.SELECT_LIST_RESOURCE,
          context
        );
      }
    }
  },

  /**
   * Find selected emotion unicode from rating score
   * @type {{String}}
   */
  selectedEmotionUnicode: function(ratingScore) {
    if (ratingScore) {
      let selectedEmotion = EMOTION_VALUES.findBy('value', ratingScore);
      return selectedEmotion.unicode;
    }
    return 'no-reaction';
  },

  /**
   * @function toggleScreenMode
   * Method to toggle fullscreen mode
   */
  toggleScreenMode() {
    let component = this;
    Ember.$('body.study-player').toggleClass('fullscreen');
    component.toggleProperty('isFullScreen');
  },

  /**
   * @function getResourceQuestionCount
   * Method to get resource and question count from the collection
   */
  getResourceQuestionCount(resources) {
    let questionCount = 0;
    let resourceCount = 0;
    if (Ember.isArray(resources)) {
      resources.map(resource => {
        if (resource.isResource) {
          resourceCount++;
        } else {
          questionCount++;
        }
      });
    }
    return {
      questionCount,
      resourceCount
    };
  },

  /**
   *  @property {Object} Extracted the unit title from unit
   */
  unitTitle: Ember.computed(function() {
    let unit = this.get('unit');
    if (unit) {
      return Ember.Object.create({
        shortname: `U${unit.get('sequence')}`,
        fullname: unit.get('title')
      });
    }
    return null;
  }),

  /**
   *  @property {Object} Extracted the lesson title from lesson
   */
  lessonTitle: Ember.computed(function() {
    let lesson = this.get('lesson');
    if (lesson) {
      return Ember.Object.create({
        shortname: `L${lesson.get('sequence')}`,
        fullname: lesson.get('title')
      });
    }
    return null;
  }),

  /**
   *  @property {Object} Extracted the collection title from unit, lesson and/or collection
   */
  collectionTitle: Ember.computed(function() {
    let collection = this.get('collection');
    let lesson = this.get('lesson');
    let title = null;
    if (lesson) {
      let lessonChildren = lesson.children;
      let isChild = lessonChildren.findBy('id', collection.id);
      if (collection && isChild) {
        if (
          collection.isCollection === true ||
          collection.collectionType === 'collection'
        ) {
          let collections = lessonChildren.filter(
            collection => collection.format === 'collection'
          );
          collections.forEach((child, index) => {
            if (child.id === collection.id) {
              let collectionSequence = index + 1;
              title = Ember.Object.create({
                shortname: `C${collectionSequence}`,
                fullname: collection.get('title')
              });
            }
          });
        } else {
          let assessments = lessonChildren.filter(
            assessment => assessment.format === 'assessment'
          );
          assessments.forEach((child, index) => {
            if (child.id === collection.id) {
              let assessmentSequence = index + 1;
              title = Ember.Object.create({
                shortname: `A${assessmentSequence}`,
                fullname: collection.get('title')
              });
            }
          });
        }
      }
    }
    if (!title) {
      title = Ember.Object.create({
        shortname:
          collection.isCollection === true ||
          collection.collectionType === 'collection'
            ? 'C'
            : 'A',
        fullname: collection.get('title')
      });
    }

    return title;
  }),

  /**
   * @property {boolean} isNextEnabled check whether next button is enabled or not
   */
  isNextEnabled: true,

  /**
   * @property {Boolean} isMilestoneContent
   * Property to check whether the served content is from milestone or not
   */
  isMilestoneContent: Ember.computed.alias('lesson.isMilestoneLesson'),

  /**
   * @property {String} domainName
   * Domain Name of the Lesson when it's tagged with milestone
   */
  domainName: Ember.computed.alias('lesson.domainName'),

  /**
   * @property {String} gradeName
   * Grade Name of the Lesson when it's tagged with milestone
   */
  gradeName: Ember.computed.alias('lesson.gradeName'),

  /**
   * @property {String} gradeSubject
   * Grade Subject of the Milestone
   */
  gradeSubject: Ember.computed(function() {
    const component = this;
    const courseTaxonomies = component.get('course.taxonomy');
    return courseTaxonomies.length
      ? courseTaxonomies.objectAt(0).parentTitle
      : null;
  })
});
