import Ember from 'ember';
import {
  QUESTION_TYPES,
  SERP_QUESTION_TYPES,
  TOUCH_QUESTION_TYPES
} from 'quizzes-addon/config/quizzes-question';
import ModalMixin from 'quizzes-addon/mixins/modal';
import {
  KEY_CODES,
  ASSESSMENT_SHOW_VALUES,
  FEEDBACK_EMOTION_VALUES,
  FIB_REGEX,
  ROLES
} from 'quizzes-addon/config/quizzes-config';

import TenantSettingsMixin from 'gooru-web/mixins/tenant-settings-mixin';
/**
 * Player question viewer
 *
 * Component responsible for providing a frame where all question types
 * will be displayed i.e. it will be responsible for selecting any specific
 * question components per question type.
 *
 * @module
 * @see controllers/player.js
 * @augments ember/Component
 */
export default Ember.Component.extend(ModalMixin, TenantSettingsMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {CollectionService} collectionService
   * @property {Ember.Service} Service to retrieve a collection|assessment
   */
  collectionService: Ember.inject.service('quizzes/collection'),

  /**
   * @type {ClassService} Service to retrieve class information
   */
  classService: Ember.inject.service('api-sdk/class'),

  session: Ember.inject.service('session'),

  //Show next button and enable/disable it by checking answer text, once every question loaded
  didInsertElement() {
    var questionTitle = $('<h6/>')
      .html(this.get('question.title'))
      .text();
    this.set('question.title', questionTitle);
    this.enableNextButton();
    this.adjustFontSize();
    this.fontChanger();
    if (this.get('classId')) {
      this.getClassInfo();
    }
  },
  // Methods

  /**
   * @function parseRubricCategories
   * Method to parse rubric categories
   */
  parseRubricCategories(oaRubricCategories, categories) {
    if (categories) {
      categories.map(category => {
        let levels = category.levels;
        if (levels) {
          levels = levels.sortBy('level_score');
          category.title = category.category_title;
          category.allowsLevels = category.level;
          category.allowsScoring = category.scoring;
          category.feedbackGuidance = category.feedback_guidance;
          category.requiresFeedback = category.required_feedback;
          category.levels = levels.map(function(data) {
            let values = Ember.Object.create({
              name: data.level_name,
              score: data.level_score
            });
            return values;
          });
        }
        oaRubricCategories.push(Ember.Object.create(category));
      });
      return oaRubricCategories;
    }
  },
  /**
   * @requires service:i18n
   */
  i18n: Ember.inject.service(),

  /**
   * @requires service:quizzes/configuration
   */
  configurationService: Ember.inject.service('quizzes/configuration'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['qz-question-viewer'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * When the question answer has been changed
     * @param {Resource} question the question
     */
    changeAnswer: function(question, answer) {
      if (!this.isDestroyed) {
        if (!this.get('submitted')) {
          //todo track analytics
          this.set('question', question);
          const questionResult = this.get('questionResult');
          questionResult.set('answer', answer);
          if (this.get('isComprehension')) {
            this.sendAction('completeAnswer', question, answer, true);
            return;
          }
          this.enableNextButton();
        }
      }
    },

    /**
     * When the question answer has been cleared
     * @param {Resource} question the question
     */
    clearAnswer: function(question) {
      if (!this.get('submitted')) {
        //todo track analytics
        this.set('question', question);
        this.set('answerCompleted', false);
        this.enableNextButton();
      }
    },

    /**
     * When the question answer has been completed
     * @param {Resource} question the question
     * @param { { answer: Object, correct: boolean } } stats
     */
    completeAnswer: function(question, answer) {
      if (!this.get('submitted')) {
        const questionResult = this.get('questionResult');
        questionResult.set('answer', answer);

        this.set('question', question);
        this.set('answerCompleted', true);
        if (this.get('isComprehension')) {
          this.sendAction('completeAnswer', question, answer);
          return;
        }
        this.enableNextButton();
      }
    },

    /**
     * When the question answer was loaded from BE
     * @param {Resource} question the question
     * @param { { answer: Object, correct: boolean } } stats
     */
    loadedAnswer: function(question, answer) {
      if (!this.get('submitted')) {
        //Ember.run.later(() => {
        const questionResult = this.get('questionResult');
        questionResult.set('answer', answer);

        this.set('question', question);
        this.set('answerCompleted', false);
        this.enableNextButton();
        //});
      }
    },

    /**
     * Show explanation action triggered
     */
    showExplanation: function() {
      this.set('isExplanationShown', true);
    },
    /**
     * Action triggered when the user see a hint
     */
    showHint: function() {
      var actualHint = this.get('actualHint');

      this.get('hintsToDisplay').pushObject(
        this.get('question.hints').objectAt(actualHint)
      );
      actualHint += 1;
      this.set('actualHint', actualHint);
    },

    /**
     * When the question is submitted
     */
    submitQuestion: function() {
      this.submitQuestion();
    },

    showImageModal: function(thumbnail) {
      this.actions.showModal.call(
        this,
        'player.qz-image-modal',
        {
          thumbnail: thumbnail,
          width: '90vw',
          height: '90vh'
        },
        null,
        null,
        true
      );
    },
    //Aciton triggered when toggle teacher/student rubric categories container
    onToggleRubricContainer: function(containerSection) {
      const component = this;
      if (containerSection === ROLES.STUDENT) {
        component.toggleProperty('isStudentCategoriesExpanded');
      } else {
        component.toggleProperty('isTeacherCategoriesExpanded');
      }
      component.$(`.${containerSection}.categories-container`).slideToggle();
    },

    onTriggerSubEvent(eventStatus) {
      this.sendAction('onTriggerSubEvent', eventStatus);
    }
  },
  // -------------------------------------------------------------------------
  // Events

  /**
   * Removed keyup handler when the component will destroy
   */
  disableListenToEnter: Ember.on('willDestroyElement', function() {
    $(document).off('keyup');
  }),

  /**
   * Listen to enter in order to submit the question when the user press enter
   */
  listenToEnter: Ember.on('didInsertElement', function() {
    const component = this;
    $(document).on('keyup', function(e) {
      if (e.which === KEY_CODES.ENTER) {
        if (!component.get('isSubmitDisabled')) {
          if (
            !component.get('question.isOpenEnded') &&
            component.get('question.type') !==
              'serp_lang_activities_for_comprehension'
          ) {
            component.submitQuestion();
          }
        }
      }
    });
  }),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Hits available for a question
   * @property {number} availableHints
   */
  actualHint: 0,

  /**
   * @property {boolean} indicates when the answer is completed
   */
  answerCompleted: false,

  /**
   * @property {string} Return the question body and modified the text if the question is
   * FIB to show the correct format.
   */
  questionBody: Ember.computed(
    'question.body',
    'question.description',
    function() {
      const component = this;
      let text = this.get('question.body');

      if (component.get('question.isHotTextHighlight')) {
        text = this.get('question.description');
      }
      if (
        component.get('question.isFIB') ||
        component.get('question.isscientificFIB')
      ) {
        const regex = new RegExp(FIB_REGEX.source, 'g');
        text = component.get('question.body').replace(regex, '_______');
      }
      component.fetchContentInfo();
      return text;
    }
  ),
  /**
   * Hits available for a question
   * @property {number} availableHints
   */
  availableHints: Ember.computed('actualHint', 'question', function() {
    return this.get('question.hints.length') - this.get('actualHint');
  }),

  viewMetadataObserver: Ember.observer('content', function() {
    let component = this;
    component.fetchContentInfo();
  }),

  /**
   * Default button text key
   * @property {string}
   */
  buttonTextKey: 'common.save',

  /**
   * The collection
   * @property {Collection}
   */
  collection: null,

  /**
   * Indicates when the question has explanation
   * @property {boolean}
   */
  doesNotHaveExplanation: Ember.computed.not('question.explanation'),

  /**
   * Unicode value depending on the correctness of the question
   * @property {boolean}
   */
  feedbackUnicode: Ember.computed('questionResult.correct', function() {
    return this.get('questionResult.correct')
      ? FEEDBACK_EMOTION_VALUES.CORRECT
      : FEEDBACK_EMOTION_VALUES.INCORRECT;
  }),
  /**
   * Indicate if the question is a free response question
   * @property {boolean}
   */
  freeResponse: Ember.computed.equal('question.type', QUESTION_TYPES.openEnded),

  isSerpMultiChoice: Ember.computed.equal(
    'question.type',
    QUESTION_TYPES.serpMultiChoice
  ),

  /**
   * Hints to display
   * @property {Array} hintsToDisplay
   */
  hintsToDisplay: Ember.A(),

  /**
   * Default instructions action text key
   * @property {string}
   */
  instructionsActionTextKey: 'common.save',

  /**
   * Key to show the correct/incorrect message
   * @property {String} isCorrectMessageKey
   */
  isCorrectMessageKey: Ember.computed('questionResult.correct', function() {
    return this.get('questionResult.correct')
      ? 'common.answer-correct'
      : 'common.answer-incorrect';
  }),

  /**
   * Is the explanation button disabled?
   * @property {boolean} disableHint
   */
  isExplanationButtonDisabled: Ember.computed.or(
    'isExplanationShown',
    'doesNotHaveExplanation'
  ),

  /**
   * Is the explanation shown?
   * @property {boolean} disableExplanation
   */
  isExplanationShown: false,

  /**
   * Is the hints button disabled?
   * @property {boolean} disableHint
   */
  isHintButtonDisabled: Ember.computed.not('availableHints'),

  /**
   * @property {boolean} indicates when the inputs are enabled
   */
  isInputDisabled: Ember.computed(
    'questionResult.submitted',
    'collection.showFeedback',
    function() {
      const showFeedback =
        this.get('collection.showFeedback') ===
        ASSESSMENT_SHOW_VALUES.IMMEDIATE;
      return (
        (showFeedback &&
          this.get('isStudent') &&
          this.get('questionResult.submitted')) ||
        this.get('submitted')
      );
    }
  ),

  /**
   * Indicates if the student is playing the collection
   * @property {boolean}
   */
  isStudent: Ember.computed.equal('role', 'student'),

  /**
   * @property {boolean} indicates when the submit functionality is enabled
   */
  isSubmitDisabled: Ember.computed(
    'answerCompleted',
    'submitted',
    'questionResult.submitted',
    'collection.showFeedback',
    function() {
      const showFeedback =
        this.get('collection.showFeedback') ===
        ASSESSMENT_SHOW_VALUES.IMMEDIATE;
      if (
        !showFeedback ||
        this.get('isTeacher') ||
        !this.get('questionResult.submitted')
      ) {
        return this.get('submitted') || !this.get('answerCompleted');
      }
      return false;
    }
  ),

  /**
   * Indicates if the teacher is playing this collection
   * @property {boolean}
   */
  isTeacher: Ember.computed.not('isStudent'),

  /**
   * @property {string} on submit question action
   */
  onSubmitQuestion: 'submitQuestion',

  /**
   * The question
   * @property {Resource} question
   */
  question: null,

  /**
   * Question result, it is passed as a parameter for this component
   * @property {QuestionResult}
   */
  questionResult: null,

  /**
   * Indicates the user's role, could be 'student', 'teacher' or null
   * @property {string}
   */
  role: null,

  /**
   * Indicates if feedback should be shown
   * @property {boolean}
   */
  showFeedback: Ember.computed(
    'collection.showFeedback',
    'questionResult.submitted',
    function() {
      const feedback =
        this.get('collection.showFeedback') ===
        ASSESSMENT_SHOW_VALUES.IMMEDIATE;
      return (
        feedback &&
        this.get('isStudent') &&
        this.get('questionResult.submitted')
      );
    }
  ),

  /**
   * Indicates when the collection is already submitted
   * @property {boolean}
   */
  submitted: false,

  /**
   * Returns the thumbnail url if it exists
   * @property {String}
   */
  thumbnail: Ember.computed('question.thumbnail', function() {
    const cdnURL = this.get(
      'configurationService.configuration.properties.cdnURL'
    );
    return this.get('question.thumbnail')
      ? `${cdnURL}${this.get('question.thumbnail')}`
      : null;
  }),
  /**
   * @property {Array} teacherRubricCategories
   * Property for list of teacher rubric categories
   */
  teacherRubricCategories: Ember.computed('questionResult.rubric', function() {
    const component = this;
    const rubric = component.get('questionResult.rubric');
    if (rubric) {
      let teacherRubric = rubric.teacherRubric;
      if (teacherRubric) {
        let oaRubricTeacherCategories = Ember.A([]);
        let categories = teacherRubric.categories || Ember.A([]);
        oaRubricTeacherCategories = component.parseRubricCategories(
          oaRubricTeacherCategories,
          categories
        );
        return oaRubricTeacherCategories;
      }
    }
  }),
  /***
   * @property {Boolean}
   * Property to check, whether SERP question is been played
   */
  isSerpQuestion: Ember.computed('question.type', function() {
    this.set('uploadedFiles', Ember.A());
    return !!SERP_QUESTION_TYPES[this.get('question.type')];
  }),

  contextResult: null,

  isComprehension: false,

  comprehensionIndex: 0,

  isTouchQuestionType: Ember.computed('question.type', function() {
    let isTouchDevice = typeof window.ontouchstart !== 'undefined';
    let type = this.get('question.type');
    return TOUCH_QUESTION_TYPES.indexOf(type) !== -1 && isTouchDevice;
  }),

  showEvidenceKeyCheck: Ember.computed('classData', function() {
    let classData = this.get('classData');
    return classData ? 'show.evidence' in classData.setting : false;
  }),

  showEvidence: Ember.computed('classData', function() {
    let classData = this.get('classData');
    return classData ? classData.setting['show.evidence'] : false;
  }),

  isH5PContent: Ember.computed('question', function() {
    return this.get('question.type') === 'h5p_drag_and_drop_question';
  }),

  /**
   * @property {String}
   */
  accessToken: Ember.computed.alias('session.token-api3'),

  contentURL: Ember.computed('isH5PContent', function() {
    if (this.get('isH5PContent')) {
      let accessToken = this.get('accessToken');
      let resourceId = this.get('question.id');
      let resourceType = this.get('question.type');
      let format = 'question';
      let contentURL = `${window.location.protocol}//${window.location.host}/tools/h5p/play/${resourceId}?accessToken=${accessToken}&contentType=${resourceType}&format=${format}`;
      return contentURL;
    }
  }),

  // -------------------------------------------------------------------------
  // Observers

  /**
   * Observes for the question itself
   * When it is changed some data should be reloaded
   */
  reloadQuestion: function() {
    this.setProperties({
      actualHint: 0,
      answerCompleted: false,
      hintsToDisplay: Ember.A(),
      isExplanationShown: false
    });
  }.observes('question'),

  // -------------------------------------------------------------------------
  // Methods

  getClassInfo() {
    let component = this;
    if (component.get('class')) {
      component.set('classData', component.get('class'));
    } else {
      if (
        component.get('classId') !== null &&
        component.get('classId') !== undefined
      ) {
        component
          .get('classService')
          .readClassInfo(component.get('classId'))
          .then(classData => {
            if (!component.isDestroyed) {
              component.set('classData', classData);
            }
          });
      }
    }
  },

  /**
   * @function fetchContentInfo
   * Method to fetch confirmation info data
   */
  fetchContentInfo() {
    let component = this;

    let content = component.get('content');
    let resourceId = component.get('questionResult.resourceId');

    if (content !== null && content !== undefined && resourceId) {
      let tempCont = content.findBy('id', resourceId);

      let playerMetadata = tempCont.player_metadata;
      let contentSubformat = tempCont.content_subformat;
      let questionEvidenceVisibility = component.get(
        'questionEvidenceVisibility'
      );

      if (questionEvidenceVisibility) {
        let questionEvidenceVisibilityKeyCheck =
          contentSubformat in questionEvidenceVisibility;
        let defaultKeyCheck = 'default' in questionEvidenceVisibility;
        let contentSubformatCheck =
          questionEvidenceVisibility[contentSubformat];
        let defaultCheck = questionEvidenceVisibility.default;

        component.set(
          'questionEvidenceVisibilityKeyCheck',
          questionEvidenceVisibilityKeyCheck
        );

        component.set('contentSubformatCheck', contentSubformatCheck);
        component.set('defaultKeyCheck', defaultKeyCheck);
        component.set('defaultCheck', defaultCheck);
      }

      if (playerMetadata) {
        let tmpIsEvidenceEnabled = 'isEvidenceEnabled' in playerMetadata;
        component.set('playerMetadata', playerMetadata);
        component.set('tmpIsEvidenceEnabled', tmpIsEvidenceEnabled);
      }
    }
  },

  submitQuestion: function() {
    if (!this.get('submitted')) {
      const questionResult = this.get('questionResult');
      this.sendAction('onSubmitQuestion', this.get('question'), questionResult);
    }
  },

  enableNextButton: function() {
    let answer = this.get('questionResult.answer');
    let evidence = this.get('questionResult.evidence');
    let isH5PContent = this.get('isH5PContent');
    let isAnswerExist =
      isH5PContent ||
      answer != null ||
      (this.get('freeResponse') && evidence && evidence.length);
    this.sendAction('isNextEnabled', isAnswerExist);
  },

  adjustFontSize() {
    let component = this;
    component
      .$('.question-panel')
      .on('input', '.font-size-loader .font-changer', function() {
        let el = component.$(this).closest('.question-panel');
        let el1 = component.$('.answers-panel');
        let fontChanger = el.find(
          '.decoding-answers .decoding-answer .decoding-text'
        );

        if (el.hasClass('serp_lang_activities_for_comprehension')) {
          let panelBody = el.find('.panel-default');
          panelBody
            .find('.panel-body .question .gru-math-text')
            .css('zoom', `${parseFloat($(this).val() / 10)}`);

          let panelBody1 = el1.find('.comprehension-question-panel');
          panelBody1
            .find('.question .gru-math-text')
            .css('zoom', `${parseFloat($(this).val() / 10)}`);
        } else {
          fontChanger.css('zoom', `${parseFloat($(this).val() / 10)}`);
        }
      });
  },
  fontChanger() {
    let component = this;
    component
      .$('.panel-body h2')
      .on('input', '.font-size-loader .font-changer', function() {
        let el = component.$('.panel-body');
        let fontChanger = el.find(
          '.decoding-answers .decoding-answer .decoding-text'
        );

        if (el.hasClass('serp_lang_activities_for_comprehension')) {
          let panelBody = el.find('.panel-body');
          panelBody
            .find('.question .gru-math-text')
            .css('zoom', `${parseFloat($(this).val() / 10)}`);
        } else {
          fontChanger.css('zoom', `${parseFloat($(this).val() / 10)}`);
        }
      });
  }
});
