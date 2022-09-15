import Ember from 'ember';
import { getGradeColor } from 'quizzes-addon/utils/utils';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Handle event triggered by gru-bubbles
     */
    bubbleSelect: function(bubbleOption) {
      this.sendAction('onBubbleSelect', bubbleOption);
    },

    /**
     * Handle event triggered by gru-bubbles
     */
    selectAttempt: function(attempt) {
      this.set('selectedAttempt', attempt);
      this.sendAction('onSelectAttempt', attempt);
    }
  },

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'qz-summary'],

  // -------------------------------------------------------------------------
  // Events
  init: function() {
    this._super(...arguments);
    this.set('selectedAttempt', this.get('contextResult.totalAttempts'));
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {boolean} areQuestionLinksHidden - Should answer links be hidden?
   */
  areQuestionLinksHidden: false,

  /**
   * @property {ContextResult} assessment
   */
  contextResult: null,

  /**
   * @property {Collection}
   */
  collection: Ember.computed.alias('contextResult.collection'),

  /**
   * @property {String} gradeStyle style safe string for the grade
   */
  gradeStyle: Ember.computed('contextResult.correctPercentage', function() {
    const color = getGradeColor(
      this.get('contextResult.correctPercentage') ||
        this.get('contextResult.reportEvent.averageScore')
    );
    return Ember.String.htmlSafe(`background-color: ${color}`);
  }),

  /**
   * @property {number} selected attempt
   */
  selectedAttempt: null,

  /**
   * @property {boolean} is real time report
   */
  isRealTime: false,

  /**
   * @property {[]}
   */
  resourceLinks: Ember.computed(
    'contextResult.sortedResourceResults.@each.updated',
    function() {
      return this.getResourceLinks(
        this.get('contextResult.sortedResourceResults')
      );
    }
  ),

  /**
   * @property {[]}
   */
  attempts: Ember.computed('contextResult.totalAttempts', function() {
    return this.getAttemptList();
  }),
  /**
   * @property {boolean}showAttempts
   */
  showAttempts: true,

  hasQuestionScore: Ember.computed(
    'contextResult.reportEvent.totalAnswered',
    function() {
      return this.get('contextResult.reportEvent.totalAnswered') > 0;
    }
  ),

  /**
   * It has the total number of  question count.
   * @property {Number}
   */
  questionCount: 0,

  /**
   * It has the total number of  resource count.
   * @property {Number}
   */
  resourceCount: 0,

  /**
   * It has the total number of  OE question count.
   * @property {Number}
   */
  oeQuestionCount: 0,

  isSerptype: true,

  hasOnlyOEQuestion: Ember.computed(
    'questionCount',
    'resourceCount',
    'oeQuestionCount',
    function() {
      return (
        this.get('oeQuestionCount') > 0 &&
        this.get('resourceCount') === 0 &&
        this.get('questionCount') === 0
      );
    }
  ),

  didInsertElement() {
    for (
      let index = 0;
      index < this.get('contextResult.collection.resources').length;
      index++
    ) {
      const result = this.get('contextResult.collection.resources')[index];
      if (
        result.type.includes('serp') &&
        result.type !== 'serp_encoding_assessment'
      ) {
        this.set('isSerptype', false);
      } else {
        this.set('isSerptype', true);
        break;
      }
    }
  },
  // -------------------------------------------------------------------------
  // Methods

  /**
   * Create list of attempts to show on the UI
   * @returns {Array}
   */
  getAttemptList: function() {
    const attempts = [];
    let totalAttempts = this.get('contextResult.totalAttempts');

    for (; totalAttempts > 0; totalAttempts--) {
      attempts.push({
        label: totalAttempts,
        value: totalAttempts
      });
    }
    return attempts;
  },

  /**
   * Convenience structure to render resource information
   * @param resourceResults
   * @returns {Array}
   */
  getResourceLinks: function(resourceResults) {
    return resourceResults.map((resourceResult, index) =>
      Ember.Object.create({
        label: index + 1,
        status: resourceResult.get('attemptStatus'),
        value: resourceResult.get('id')
      })
    );
  }
});
