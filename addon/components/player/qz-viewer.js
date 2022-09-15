import Ember from 'ember';
import { ASSESSMENT_SHOW_VALUES } from 'quizzes-addon/config/quizzes-config';
/**
 * Player viewer
 *
 * Component responsible for showing the appropriate content viewer per content type
 * (i.e. question, pdf file, video, etc.).
 *
 * @module
 * @see controllers/player.js
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['qz-viewer'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Action triggered when the user completed a answer
     * @param {boolean} isAnswerCompleted
     * Return to parent component
     */
    isNextEnabled: function(isAnswerCompleted) {
      this.sendAction('isNextEnabled', isAnswerCompleted);
    },
    /***
     * Return to previous resource
     * @param {Resource} question
     */
    previousResource: function() {
      const component = this;
      component.$('.content').scrollTop(0);
      component.sendAction('onPreviousResource', component.get('resource'));
    },
    /***
     * When the user submits the question
     * @param {Resource} question
     * @param {QuestionResult} questionResult
     * @returns {boolean}
     */
    submitQuestion: function(question, questionResult) {
      const component = this;
      component.$('.content').scrollTop(0);
      component.sendAction('onSubmitQuestion', question, questionResult);
    },

    onTriggerSubEvent(eventStatus) {
      this.sendAction('onTriggerSubEvent', eventStatus);
    }
  },
  // -------------------------------------------------------------------------
  // Events
  /**
   * DidInsertElement ember event
   */
  didInsertElement: function() {
    this.setNarrationEffect();
    this.calculateResourceContentHeight();
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * The text for the submit button
   * @property {string}
   */
  buttonTextKey: Ember.computed(
    'collection',
    'resource.id',
    'resourceResult.submitted',
    function() {
      let i18nKey = 'common.save-next';
      const showFeedback =
        this.get('collection.showFeedback') ===
        ASSESSMENT_SHOW_VALUES.IMMEDIATE;
      if (!showFeedback || this.get('isTeacher')) {
        if (this.get('collection').isLastResource(this.get('resource'))) {
          i18nKey = this.get('collection').get('isAssessment')
            ? 'common.save-submit'
            : 'common.save-finish';
        }
      } else {
        if (this.get('resourceResult.submitted')) {
          i18nKey = this.get('collection').isLastResource(this.get('resource'))
            ? 'common.finish'
            : 'common.next';
        } else {
          i18nKey = 'common.submit';
        }
      }
      return i18nKey;
    }
  ),

  /** Calculated height designated for the content area of a resource
   * @see components/player/resources/qz-url-resource.js
   * The height of the content area needs to be calculated because the height of the narration varies and may cause a scroll bar to appear
   * @property {Number}
   */
  calculatedResourceContentHeight: 0,

  /**
   * The collection playing
   * @property {Collection} collection
   */
  collection: null,
  /**
   * Indicates if collection has an author
   * @property {string}
   */
  collectionHasAuthor: Ember.computed.notEmpty('collection.author'),

  /**
   * The text for the action in the instructions
   * @property {string}
   */
  instructionsActionTextKey: Ember.computed(
    'collection',
    'resource.id',
    'resourceResult.submitted',
    function() {
      let i18nKey = 'common.next';
      if (this.get('collection').isLastResource(this.get('resource'))) {
        i18nKey = this.get('collection.isAssessment')
          ? 'common.submitAll'
          : 'study-player.summary';
      }
      return i18nKey;
    }
  ),

  /**
   * @property {boolean}
   */
  isNotIframeUrl: null,

  /**
   * Indicates if the student is playing the collection
   * @property {boolean}
   */
  isStudent: Ember.computed.equal('role', 'student'),

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
   * The resource playing
   * @property {Resource} resource
   */
  resource: null,

  /**
   * The resource or question result playing
   * @property {ResourceResult}
   */
  resourceResult: null,

  /**
   * Indicates if the collection author is visible
   * @property {boolean} showCollectionAuthor
   */
  showCollectionAuthor: true,

  /**
   * Indicates the user's role, could be 'student', 'teacher' or null
   * @property {string}
   */
  role: null,

  /**
   * Indicates when the collection is already submitted
   * @property {boolean}
   */
  submitted: false,

  // -------------------------------------------------------------------------
  // Observers
  /**
   * Observes for the resource change
   */
  resourceObserver: function() {
    this.calculateResourceContentHeight();
  }.observes('resource.id'),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Calculates the height of the content area (it will change depending on height
   * of the narration -if there is one)
   */
  calculateResourceContentHeight: function() {
    if (
      this.get('resource.isUrlResource') ||
      this.get('resource.isPDFResource') ||
      (this.get('resource.isImageResource') &&
        this.get('isNotIframeUrl') === false)
    ) {
      var narrationHeight = this.$('.narration').innerHeight();
      var contentHeight = this.$('.content').height();

      // The 4 pixels subtracted are to make sure no scroll bar will appear for the content
      // (Users should rely on the iframe scroll bar instead)
      this.set(
        'calculatedResourceContentHeight',
        contentHeight - narrationHeight - 4
      );
    }
  },
  /**
   * Set jquery effect to narration
   * */
  setNarrationEffect: function() {
    $('.narration').effect('highlight', { color: '#84B7DD' }, 2000);
  }
});
