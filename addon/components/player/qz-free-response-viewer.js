import Ember from 'ember';
import QuestionComponent from 'quizzes-addon/components/player/questions/qz-question';
import TenantSettingsMixin from 'gooru-web/mixins/tenant-settings-mixin';

export default QuestionComponent.extend(TenantSettingsMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:quizzes/configuration
   */
  configurationService: Ember.inject.service('quizzes/configuration'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['player', 'qz-free-response-viewer'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Show full rubric
     */
    showFullRubric: function() {
      this.set('showFullRubric', !this.get('showFullRubric'));
    },
    /**
     * Submit Question
     */
    submitQuestion: function() {
      this.sendAction('onSubmitQuestion');
    },

    showFullImage: function() {
      this.set('isShowFullImage', true);
    },

    onCloseFullImage: function() {
      this.set('isShowFullImage', false);
    },

    onFocusOut() {
      const component = this;
      if (
        component.get('isComprehension') &&
        component.get('isAnswerCompleted')
      ) {
        const answer = [
          {
            value: Ember.$.trim(component.get('answer'))
          }
        ];
        component.notifyAnswerCompleted(answer);
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events

  /**
   * When loading the user answer
   */
  updateUserAnswer: Ember.on('init', function() {
    const component = this;
    component.setAnswers();
  }),

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {string} the user answer
   */
  answer: '',

  /**
   * @property {Array[RubricCategory]} categories
   */
  categories: Ember.computed('hasRubric', function() {
    return this.get('question.rubric').get('categories');
  }),

  viewMetadataObserver: Ember.observer('content', function() {
    let component = this;
    component.fetchContentInfo();
  }),

  /**
   * Indicates if the question has a rubric assigned
   * @return {bool}
   */
  hasRubric: Ember.computed.bool('question.rubric.rubricOn'),

  /**
   * Indicates if rubric contains a url
   * @return {bool}
   */
  hasUrl: Ember.computed.bool('question.rubric.url'),

  /**
   * Indicates when the answer is completed
   * @return {bool}
   */
  isAnswerCompleted: Ember.computed.bool('answer.length'),

  /**
   * Free Response Question
   * @property {Question} question
   */
  question: null,

  /**
   * Parsed Question Text
   * @property {String} questionText
   */
  questionText: null,

  isShowFullImage: false,

  /**
   * @property {Boolean} showFullRubric
   */
  showFullRubric: false,

  /**
   * Indicates when the answer is completed
   * @return {bool}
   */
  showPanel: Ember.computed('hasRubric', 'hasUrl', 'categories', function() {
    return (
      this.get('hasRubric') &&
      (this.get('categories.length') || this.get('hasUrl'))
    );
  }),

  /**
   * @property {Number} totalPoints
   */
  totalPoints: Ember.computed('hasRubric', function() {
    return this.get('question.rubric').get('totalPoints');
  }),

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

  isComprehension: false,

  comprehensionIndex: 0,

  // -------------------------------------------------------------------------
  // Observers

  /**
   * When the user changes the response
   */
  updateAnswerObserver: function() {
    this.notify(false);
  },

  watchObserver: Ember.observer('questionResult.evidence', function() {
    const component = this;
    component.notifyAnswerCompleted(null);
  }),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @function fetchContentInfo
   * Method to fetch confirmation info data
   */
  fetchContentInfo() {
    let component = this;
    let playerMetadata = component.get('content.player_metadata');
    let contentSubformat = component.get('content.content_subformat');
    let questionEvidenceVisibility = component.get(
      'questionEvidenceVisibility'
    );

    if (questionEvidenceVisibility) {
      let questionEvidenceVisibilityKeyCheck =
        contentSubformat in questionEvidenceVisibility;
      let defaultKeyCheck = 'default' in questionEvidenceVisibility;
      let contentSubformatCheck = questionEvidenceVisibility[contentSubformat];
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
  },

  /**
   * Notifies answer events
   * @param {boolean} onLoad if this was called when loading the component
   */
  notify: function(onLoad) {
    const component = this,
      answer = [
        {
          value: Ember.$.trim(component.get('answer'))
        }
      ];
    component.notifyAnswerChanged(answer);
    let evidence = component.get('questionResult.evidence');
    if (component.get('isAnswerCompleted') || evidence) {
      if (onLoad) {
        component.notifyAnswerLoaded(answer);
      } else {
        if (!component.get('isComprehension')) {
          component.notifyAnswerCompleted(answer);
        }
      }
    } else {
      component.notifyAnswerCleared(answer);
    }
  },

  /**
   * Set answer
   * */
  setAnswers: function() {
    if (this.get('hasUserAnswer')) {
      const userAnswer = this.get('userAnswer.firstObject.value');
      this.set('answer', userAnswer);
      this.notify(true);
    }
    // set observer for answer update
    this.addObserver('answer', this.updateAnswerObserver);
  }
});
