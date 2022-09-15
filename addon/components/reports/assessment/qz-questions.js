import Ember from 'ember';
import TaxonomyTag from 'quizzes-addon/models/taxonomy/taxonomy-tag';
import TaxonomyTagData from 'quizzes-addon/models/taxonomy/taxonomy-tag-data';
import {
  SERP_QUESTION_TYPES,
  QUESTION_TYPES,
  REPORT_SCORE_QUESTION_TYPES,
  EXCLUDE_SCORE_QUESTION_TYPES
} from 'quizzes-addon/config/quizzes-question';
import { ANSWER_HEAD } from 'gooru-web/config/config';
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:i18n
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'qz-questions'],

  classNameBindings: [
    'isAnswerKeyHidden:key-hidden',
    'showPerformance:performance-view'
  ],

  actions: {
    onShowPullUp: function(file) {
      this.set('activeFile', file);
      this.set('isShowFilePullUp', true);
    },

    onClosePullup: function() {
      this.set('activeFile', null);
      this.set('isShowFilePullUp', false);
    },

    onShowMore() {
      this.toggleProperty('isExpanded');
    }
  },
  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {boolean} isAnswerKeyHidden - Should the answer key be hidden?
   */
  isAnswerKeyHidden: false,

  /**
   * List of questions to be displayed by the component
   *
   * @constant {Array}
   */
  results: null,

  isShowComp: false,

  isShowFilePullUp: false,

  activeFile: Ember.A(),

  isExpanded: false,

  hasMoreText: Ember.computed(
    'content.resource.description',
    'content.resource.baseAnswers',
    'isShowMore',
    function() {
      let questionText = this.get('content.resource.description');
      let answerText = '';
      const questionTypes = [
        'serp_phrase_cued_reading',
        'serp_words_per_minute',
        'serp_silent_reading'
      ];
      const baseAnswerText = this.get('content.resource.baseAnswers');
      const type = this.get('content.resource.type');
      let baseAnswer = baseAnswerText ? baseAnswerText.get(0) : null;
      if (baseAnswer) {
        answerText = baseAnswer.answer_text;
      }
      return (
        ((questionText && questionText.length > 130) ||
          (answerText &&
            answerText.length > 130 &&
            questionTypes.includes(type))) &&
        this.get('enableMorebtn') &&
        this.get('isShowMore')
      );
    }
  ),

  answerHead: Ember.computed('i18n', function() {
    const labelText = this.get('i18n').t(
      ANSWER_HEAD[this.get('content.resource.type')]
    ).string;
    return labelText
      ? labelText
      : this.get('i18n').t('report.answer-label').string;
  }),

  /**
   * Indicate if the table show the performance columns
   *
   * @property {Boolean}
   */
  showPerformance: Ember.computed('isSerp', function() {
    return !this.get('isSerp');
  }),

  /**
   * Indicate if the table show the score column
   *
   * @property {Boolean}
   */
  showScore: Ember.computed('isSerp', function() {
    return (
      (!this.get('isSerp') ||
        REPORT_SCORE_QUESTION_TYPES.indexOf(
          this.get('content.resource.type')
        ) !== -1) &&
      EXCLUDE_SCORE_QUESTION_TYPES.indexOf(
        this.get('content.resource.type')
      ) === -1
    );
  }),

  /**
   * The components title
   *
   * @property {String}
   */
  title: null,

  /**
   * Indicates if the view is open ended
   * @property {boolean}
   */
  isOpenEnded: Ember.computed('viewMode', function() {
    return this.get('viewMode') === 'open-ended';
  }),

  isSerp: Ember.computed('content.resource.type', function() {
    return !!SERP_QUESTION_TYPES[this.get('content.resource.type')];
  }),

  isHideDescription: Ember.computed('content.resource.type', function() {
    return !(
      this.get('content.resource.type') === 'serp_classic' ||
      this.get('content.resource.type') === 'serp_sorting'
    );
  }),

  isChooseOne: Ember.computed('content.resource.type', function() {
    return this.get('content.resource.type') === QUESTION_TYPES.serpChooseOne;
  }),

  isWPM: Ember.computed('content.resource.type', function() {
    return (
      this.get('content.resource.type') === QUESTION_TYPES.serpWordsPerMinute
    );
  }),

  isH5PContent: Ember.computed('content.resource.type', function() {
    return this.get('content.resource.type') === 'h5p_drag_and_drop_question';
  }),

  isShowMore: false,

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  taxonomyTags: Ember.computed('content.resource.standards.[]', function() {
    var standards = this.get('content.resource.standards');
    if (standards) {
      standards = standards.filter(function(standard) {
        // Filter out learning targets (they're too long for the card)
        return !TaxonomyTagData.isMicroStandardId(standard.get('id'));
      });
    }
    return TaxonomyTag.getTaxonomyTags(standards);
  }),

  wpmCount: 0,

  // ------------------------------------------------------------------
  // Hooks

  didInsertElement() {
    const component = this;
    this.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
    if (this.get('isWPM')) {
      let answer = this.get('content.answer.firstObject');
      let ansParse = JSON.parse(answer.value);
      let textCount = ansParse.selectedText.wpmCount || 0;
      this.set('wpmCount', textCount);
    }
    Ember.run.scheduleOnce('afterRender', function() {
      Ember.run.later(function() {
        component.set(
          'isShowMore',
          component.$('.show-more-container-panel').height() > 30
        );
      }, 100);
    });
  }
});
