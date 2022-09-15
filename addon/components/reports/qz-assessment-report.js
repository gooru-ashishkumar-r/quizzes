import Ember from 'ember';
import TaxonomyTag from 'quizzes-addon/models/taxonomy/taxonomy-tag';
import TaxonomyTagData from 'quizzes-addon/models/taxonomy/taxonomy-tag-data';
import WpmReadingMixin from 'gooru-web/mixins/reports/wpm-reading-question-mixin';
import TenantSettingsMixin from 'gooru-web/mixins/tenant-settings-mixin';
import {
  REPORT_SCORE_QUESTION_TYPES,
  ANSWER_SCORE_TYPE_ENUM,
  QUESTION_TYPES
} from 'quizzes-addon/config/quizzes-question';

export default Ember.Component.extend(WpmReadingMixin, TenantSettingsMixin, {
  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Handle event triggered by qz-summary
     * Scroll to specific question
     **/
    bubbleSelect: function(bubbleOption) {
      const animationSpeed = 1000; // milliseconds
      const trSelector = $(
        `.qz-assessment-report table:visible .tr-number-${bubbleOption.label}`
      );
      const cardSelector = $(
        `.qz-assessment-report ul:visible .xs-number-${bubbleOption.label}`
      );

      const $trTable = $(trSelector);
      const $card = $(cardSelector);

      const isModal = $('.qz-assessment-report').parents('.qz-modal');
      //Check if the assessment report is showing into a modal
      if (isModal.length) {
        if ($trTable.length) {
          $('.qz-modal').animate(
            {
              scrollTop: $trTable.offset().top - $('.qz-modal').offset().top
            },
            animationSpeed
          );
        }
      } else {
        //Check if the questions details are showing on table (md or sm devices) or  a list (xs devices)
        if ($trTable.length) {
          $('html,body').animate(
            {
              scrollTop:
                $($trTable).offset().top -
                $('.controller.analytics.collection.student').offset().top
            },
            animationSpeed
          );
        } else if ($card.length) {
          $('html,body').animate(
            {
              scrollTop:
                $($card).offset().top -
                $('.controller.analytics.collection.student').offset().top
            },
            animationSpeed
          );
        } else {
          Ember.Logger.error(
            `No element was found for selectorTable: ${$trTable}`
          );
        }
      }
    },

    selectAttempt: function(attempt) {
      this.sendAction('onSelectAttempt', attempt);
    },

    /**
     * Selects Performance Option or not
     * @function actions:selectPerformanceOption
     */
    selectPerformanceOption: function(showPerformance) {
      if (!this.get('isAnswerKeyHidden')) {
        this.set('showPerformance', showPerformance);
      }
    },

    toggleDesction() {
      $(
        '.summary-report-container .header-panel .collection-desc .description'
      ).slideToggle();
      this.toggleProperty('isDisplayDescription');
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  isDisplayDescription: false,

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'qz-assessment-report'],

  // -------------------------------------------------------------------------
  // Events
  /**
   * Listening for model to update component properties
   */
  onInit: Ember.on('init', function() {
    if (this.get('model')) {
      this.set('contextResult', this.get('model').contextResult);
      if (this.get('model').profile) {
        this.set('profile', this.get('model').profile);
      }
    }
    this.set('selectedAttempt', this.get('contextResult.totalAttempts'));

    for (
      let index = 0;
      index < this.get('contextResult.collection.resources').length;
      index++
    ) {
      const result = this.get('contextResult.collection.resources')[index];
      if (
        result.type.includes('serp') &&
        REPORT_SCORE_QUESTION_TYPES.indexOf(result.type) === -1
      ) {
        this.set('isSerptype', false);
      } else {
        this.set('isSerptype', true);
        break;
      }
    }
    if (this.get('sourceType') === 'coursemap') {
      this.fetchReadingContent();
    }
  }),

  // -------------------------------------------------------------------------
  // Events
  didInsertElement() {
    const component = this;
    $(
      '.summary-report-container .header-panel .collection-desc .description'
    ).slideDown();
    let isShowDefault = component.get('isShowDescription');
    if (isShowDefault === false) {
      this.send('toggleDesction');
    }

    let collection = component.get('collection');
    let contentCount = component.getResourceQuestionCount(collection.resources);
    Ember.set(collection, 'questionCount', contentCount.questionCount);
    collection.resourceCount = contentCount.resourceCount;
  },

  didRender() {
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    });
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {ContextResult} assessment
   */
  contextResult: null,

  /**
   * @property {boolean} areAnswersHidden - Should answer results be hidden?
   */
  areAnswersHidden: false,

  /**
   * @property {boolean} isAnswerKeyHidden - Should the answer key be hidden?
   */
  isAnswerKeyHidden: false,

  /**
   * @property {string} on select attempt action name
   */
  onSelectAttempt: null,

  /**
   * @property {boolean} isRealTime
   */
  isRealTime: Ember.computed('model.contextResult.isRealTime', function() {
    return this.get('model.contextResult.isRealTime');
  }),

  /**
   * @property {boolean} showAttempts
   */
  showAttempts: Ember.computed('model.contextResult.showAttempts', function() {
    return (
      this.get('model.contextResult.showAttempts') === undefined ||
      this.get('model.contextResult.showAttempts')
    );
  }),

  /**
   * Return ordered questions/resources array
   * @return {Ember.Array}
   */
  orderedQuestions: Ember.computed(
    'contextResult.sortedResourceResults.@each.updated',
    function() {
      const component = this;
      this.get('contextResult.sortedResourceResults').forEach(function(
        result,
        index
      ) {
        result.set(
          'resource.data',
          component
            .get('contextResult.children')
            .findBy('id', result.get('resourceId'))
        );
        result.correct = component.partialScoreCalulate(result);
        result.tooltip = component.partialScoreTooltip(result);
        result.set('resource.sequence', index + 1);
      });
      return this.get('contextResult.sortedResourceResults');
    }
  ),
  /**
   * List of open ended questions to be displayed
   *
   * @constant {Array}
   */
  resultsOpenEnded: Ember.computed(
    'orderedQuestions.@each.updated',
    function() {
      return this.get('orderedQuestions').filter(resourceResult =>
        resourceResult.get('isOpenEnded')
      );
    }
  ),

  resultsLikertScale: Ember.computed(
    'orderedQuestions.@each.updated',
    function() {
      return this.get('orderedQuestions').filter(resourceResult => {
        return resourceResult.get('resource.isLikertScale');
      });
    }
  ),

  class: Ember.computed.alias('currentClass'),

  partialScoreCalulate(result) {
    if (this.partailCheckQType(result.resource.type)) {
      if (result.score) {
        if (result.score === 100) {
          return ANSWER_SCORE_TYPE_ENUM.correct;
        } else if (result.score === 0) {
          return ANSWER_SCORE_TYPE_ENUM.incorrect;
        } else {
          return ANSWER_SCORE_TYPE_ENUM.partiallyCorrect;
        }
      } else {
        return ANSWER_SCORE_TYPE_ENUM.incorrect;
      }
    } else {
      return result.score > 0
        ? ANSWER_SCORE_TYPE_ENUM.correct
        : ANSWER_SCORE_TYPE_ENUM.incorrect;
    }
  },

  partialScoreTooltip(result) {
    if (this.partailCheckQType(result.resource.type)) {
      if (result.score) {
        if (result.score === 100) {
          return 'common.correct';
        } else if (result.score === 0) {
          return 'common.incorrect';
        } else {
          return 'common.partial-correct';
        }
      } else {
        return 'common.skipped';
      }
    } else {
      return result.score > 0 ? 'common.correct' : 'common.incorrect';
    }
  },

  partailCheckQType(qtype) {
    const partailCheckQType = [
      QUESTION_TYPES.serpIdentifyVowel,
      QUESTION_TYPES.hotSpotText,
      QUESTION_TYPES.fib,
      QUESTION_TYPES.multipleAnswer,
      QUESTION_TYPES.serpEncoding,
      QUESTION_TYPES.serpBaseword,
      QUESTION_TYPES.serpVowelTeams,
      QUESTION_TYPES.serpCountingSyllables,
      QUESTION_TYPES.serpSyllablesDivision,
      QUESTION_TYPES.serpSorting,
      QUESTION_TYPES.serpClassic,
      QUESTION_TYPES.serp_encoding_assessment,
      QUESTION_TYPES.serp_lang_counting_syllables,
      QUESTION_TYPES.serp_classic,
      QUESTION_TYPES.serp_lang_syllable_division,
      QUESTION_TYPES.serpPickNChooseQuestion,
      QUESTION_TYPES.hotTextReorder,
      QUESTION_TYPES.hotSpotImage,
      QUESTION_TYPES.hotTextHighlightWord,
      QUESTION_TYPES.hotTextHighlightSentence,
      QUESTION_TYPES.singleChoice,
      QUESTION_TYPES.scientificFreeResponse,
      QUESTION_TYPES.scientificfib,
      QUESTION_TYPES.serpDecoding,
      QUESTION_TYPES.serpSayOutLoud,
      QUESTION_TYPES.serpDigraph,
      QUESTION_TYPES.serpWordsPerMinute,
      QUESTION_TYPES.serpSilentReading,
      QUESTION_TYPES.srepPhrase,
      QUESTION_TYPES.serpComprehension,
      QUESTION_TYPES.serpChooseOne,
      QUESTION_TYPES.serpPickNChoose,
      QUESTION_TYPES.serpMultiChoice,
      QUESTION_TYPES.openEnded,
      QUESTION_TYPES.matchTheFollowing,
      QUESTION_TYPES.likertScale,
      QUESTION_TYPES.trueFalse
    ];
    return partailCheckQType.includes(qtype);
  },
  /**
   * List of scientific questions to be displayed
   *
   * @constant {Array}
   */
  resultsScientificQuestion: Ember.computed(
    'orderedQuestions.@each.updated',
    function() {
      return this.get('orderedQuestions').filter(resourceResult =>
        resourceResult.get('isScientific')
      );
    }
  ),

  /**
   * List of questions to be displayed (Not open ended)
   *
   * @constant {Array}
   */
  resultsQuestions: Ember.computed(
    'orderedQuestions.@each.updated',
    function() {
      return this.get('orderedQuestions').filter(
        resourceResult =>
          resourceResult.get('isQuestion') &&
          !resourceResult.get('isOpenEnded') &&
          !resourceResult.get('isScientific')
      );
    }
  ),

  /**
   * List of questions to be displayed (Not open ended)
   *
   * @constant {Array}
   */
  resultsResources: Ember.computed(
    'orderedQuestions.@each.updated',
    function() {
      return this.get('orderedQuestions').filter(resourceResult =>
        resourceResult.get('isResource')
      );
    }
  ),

  /**
   * @property {boolean} isAssessment - if collection is an Assessment
   */
  isAssessment: Ember.computed.alias('contextResult.collection.isAssessment'),

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed('contextResult.collection.standards.[]', function() {
    let standards = this.get('contextResult.collection.standards');
    if (standards) {
      standards = standards.filter(function(standard) {
        // Filter out learning targets (they're too long for the card)
        return !TaxonomyTagData.isMicroStandardId(standard.get('id'));
      });
      return TaxonomyTag.getTaxonomyTags(standards);
    }
  }),

  /**
   * @property {Collection}
   */
  collection: Ember.computed.alias('contextResult.collection'),

  /**
   * @property {Collection}
   */
  collections: Ember.computed.alias('contextResult.collection'),

  hasOnlyOEQuestion: Ember.computed(
    'resultsQuestions',
    'resultsResources',
    'resultsOpenEnded',
    'resultsScientificQuestion',
    function() {
      return (
        (this.get('resultsOpenEnded.length') > 0 ||
          this.get('resultsScientificQuestion.length') > 0) &&
        this.get('resultsResources.length') === 0 &&
        this.get('resultsQuestions.length') === 0
      );
    }
  ),

  hasOnlyLikertScale: Ember.computed('resultsLikertScale', function() {
    return this.get('resultsLikertScale.length') > 0;
  }),

  hasQuestionScore: Ember.computed(
    'contextResult.reportEvent.totalAnswered',
    function() {
      return this.get('contextResult.reportEvent.totalAnswered') > 0;
    }
  ),

  /**
   * @property {number} selected attempt
   */
  selectedAttempt: null,

  /**
   * @property {[]}
   */
  attempts: Ember.computed('contextResult.totalAttempts', function() {
    return this.getAttemptList();
  }),

  /**
   * Indicate if the table show the performance columns
   *
   * @property {Boolean}
   */
  showPerformance: Ember.computed('isAnswerKeyHidden', function() {
    return this.get('isAnswerKeyHidden');
  }),

  /**
   * Property used to  identify whether collection object has items to play.
   */
  hasCollectionItems: Ember.computed('collection', function() {
    const component = this;
    let collection = component.get('collection');
    let contentCount = component.getResourceQuestionCount(collection.resources);
    let resourceCount = contentCount.resourceCount;
    let questionCount = contentCount.questionCount;
    let hasCollectionItems = false;
    let isCollection = collection.get('isCollection');
    if (isCollection && (resourceCount > 0 || questionCount > 0)) {
      hasCollectionItems = true;
    } else if (questionCount > 0) {
      hasCollectionItems = true;
    }
    return hasCollectionItems;
  }),

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
  }
});
