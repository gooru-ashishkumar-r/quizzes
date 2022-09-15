import Ember from 'ember';
import ContextResult from 'quizzes-addon/models/result/context';
import { ASSESSMENT_SHOW_VALUES } from 'quizzes-addon/config/quizzes-config';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'qz-student-report'],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {ReportDataEvent} attemptData all data for the current/last attempt
   */
  attemptData: null,

  /**
   * @property {ContextResult} contextResult data normalized for report
   */
  contextResult: Ember.computed('attemptData', function() {
    return ContextResult.create({
      reportEvent: this.get('attemptData'),
      averageReaction: Ember.computed.alias('reportEvent.averageReaction'),
      correctPercentage: Ember.computed.alias('reportEvent.averageScore'),
      correctAnswers: Ember.computed.alias('reportEvent.totalCorrect'),
      currentResourceId: Ember.computed.alias('reportEvent.currentResourceId'),
      totalTimeSpent: Ember.computed.alias('reportEvent.totalTimeSpent'),
      totalAttempts: 1,
      selectedAttempt: 1,
      submittedAt: Ember.computed.alias('reportEvent.submittedAt'),
      resourceResults: Ember.computed.alias('reportEvent.resourceResults'),
      collection: this.get('collection'),
      isRealTime: this.get('isRealTime'),
      showAttempts: this.get('showAttempts'),
      mastery: this.get('attemptData.mastery'),
      children: this.get('collectionObj')
        ? this.get('collectionObj.children')
        : Ember.A([])
    });
  }),

  /**
   * @property {Collection} collection
   */
  collection: Ember.computed.alias('attemptData.collection'),

  /**
   * @property {boolean} areAnswersHidden - Should answer results be hidden?
   */
  areAnswersHidden: Ember.computed(
    'collection.isAssessment',
    'collection.showFeedback',
    function() {
      return (
        this.get('collection.isAssessment') &&
        this.get('collection.showFeedback') === ASSESSMENT_SHOW_VALUES.NEVER
      );
    }
  ),

  /**
   * @property {boolean} isRealTime
   */
  isRealTime: true,

  /**
   * @property {boolean} showAttempts
   */
  showAttempts: false,

  /**
   * @property {Number} totalAttempts
   */
  totalAttempts: 0,

  sourceType: null
});
