import Ember from 'ember';
import {
  alphabeticalStringSort,
  formatTime,
  getAnswerResultIcon,
  getAnswerResultIconWithValue,
  getScoreString,
  getReactionIcon
} from 'quizzes-addon/utils/utils';
import { average } from 'quizzes-addon/utils/math';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

/**
 * Class assessment table view
 *
 * Component responsible for filtering and transforming the class assessment data
 * into a format readily consumable by the gru-two-tier-header-table component.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:i18n
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'class-assessment', 'qz-table-view'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * @function actions:selectQuestion
     * @param {Number} questionId
     */
    selectQuestion: function(questionId) {
      this.get('onSelectQuestion')(questionId);
    },

    /**
     * @function actions:selectStudent
     * @param {string} studentId
     */
    selectStudent: function(studentId) {
      this.get('onSelectStudent')(studentId);
    }
  },

  // -------------------------------------------------------------------------
  // Events

  init: function() {
    this._super(...arguments);
    this.set('questionProperties', this.initQuestionProperties());
    this.set('studentsHeader', this.initStudentsHeader());
  },

  willDestroyElement: function() {
    this.set('questionProperties', null);
    this.set('studentsHeader', null);
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Indicates if the report is displayed in anonymous mode
   * @property {boolean} anonymous
   */
  anonymous: false,

  /**
   * @prop { Collection } assessment
   */
  assessment: Ember.computed.alias('reportData.collection'),

  /**
   * @prop { Object[] } assessmentQuestions - An array made up of all the questions in the assessment
   *
   * Each question object will consist of:
   * - label: visual representation of the header
   * - value: internal header identifier
   *- type : type represented by in column
   * - title : title of the resource or question to display on list header
   * The questions will be ordered in the array in ascending order per the order value
   */
  assessmentQuestions: Ember.computed(
    'assessment.resources.@each.id',
    function() {
      const labelPrefix = this.get('i18n').t(
        'reports.qz-table-view.first-tier-header-prefix'
      ).string;

      const questions = this.get('assessment.resources')
        .sortBy('sequence')
        .map(function(question, index) {
          return {
            value: question.get('id'),
            label: labelPrefix + (index + 1),
            type: question.get('type'),
            title: question.get('title')
          };
        });

      // Add column used for showing totals at the beginning of the array
      questions.unshift({
        value: -1,
        label: this.get('i18n').t('reports.qz-table-view.totals').string
      });

      return questions;
    }
  ),

  /**
   * @prop { String[] } assessmentQuestionsIds - An array with the ids of all the questions in the assessment
   */
  assessmentQuestionsIds: Ember.computed(
    'assessmentQuestions.@each.value',
    'assessmentQuestions.@each.label',
    function() {
      return this.get('assessmentQuestions').map(question => question.value);
    }
  ),

  /**
   * @prop { Object[] } questionProperties - An array made up of question properties
   *
   * Each property object will consist of:
   * - filter: information to use for the corresponding filter checkbox
   * - label: visual representation of the header
   * - value: internal header identifier
   * - visible: should the property be visible or not?
   * - renderFunction: function to process values of this property for output
   * - aggregateFunction: if there's an aggregate column, this function will be
   *   used to aggregate all the values for this property that are in the same row
   * - aggregateRenderFunction: if there's an aggregate column, this function will
   *   take the result of the aggregateFunction and process it for output
   * - sortFunction: sort function for values of this property
   */
  questionProperties: null,

  /**
   * @prop { String[] } questionPropertiesIds - An array with the ids of all the question properties
   */
  questionPropertiesIds: Ember.computed(
    'questionProperties.@each.value',
    function() {
      return this.get('questionProperties').map(
        questionProperty => questionProperty.value
      );
    }
  ),

  /**
   * @prop { Object[] } scoresData - Array with all the scores in the assessment
   *
   * Each object corresponds to an assessment result by a student and will consist of:
   * - score: number of questions answered correctly vs. total number of questions
   * - completed: have all the questions in the assessment been answered?
   */
  scoresData: Ember.computed(
    'reportData.reportEvents.@each.updated',
    function() {
      const reportEvents = this.get('reportData.reportEvents');

      const results = [];
      reportEvents.forEach(reportEvent => {
        if (reportEvent.get('totalAnswered') > 0) {
          results.push({
            score: reportEvent.get('averageScore'),
            completed: reportEvent.get('isAttemptFinished')
          });
        }
      });
      return results;
    }
  ),

  /**
   * @prop { number } averageScore - average score in the assessment
   * for the entire group of students (per scoresData)
   */
  averageScore: Ember.computed('scoresData.@each.score', function() {
    const scores = this.get('scoresData').map(result =>
      result.score ? result.score : 0
    );
    return scores.length ? Math.round(average(scores)) : 0;
  }),

  /**
   * @prop { ReportData } reportData - Unordered 3D matrix of data to use as content for the table component
   */
  reportData: null,

  /**
   * @prop { User[] } students - Students taking the assessment
   */
  students: Ember.computed.alias('reportData.students'),

  /**
   * @prop { String? } studentsHeader - Header for the students names
   */
  studentsHeader: null,

  /**
   * @prop { String[] } studentsIds - An array with the ids of all the students taking the assessment
   */
  studentsIds: Ember.computed.alias('reportData.studentIds'),

  /**
   * @prop { Object[] } tableData - Ordered data to use as content for the table component
   * It merges the existing table frame with any updated table data.
   *
   * Each object in the array will consist of:
   * - id: row id
   * - header: row header
   * - content: an array of objects making up the row content where each object is made up of:
   *   - value: table cell un-formatted content
   *   - output: table cell content formatted for output (the formatting is done by
   *             the question property's render function)
   */
  tableData: Ember.computed(
    'anonymous',
    'tableFrame',
    'reportData.reportEvents.@each.updated',
    function() {
      const questionProperties = this.get('questionProperties');
      const questionPropertiesIds = this.get('questionPropertiesIds');
      const questionPropertiesIdsLen = questionPropertiesIds.length;
      const reportDataEvents = this.get('reportData.reportEvents');
      const assessmentQuestions = this.get('assessment.resources').sortBy(
        'sequence'
      );

      const component = this;
      // Copy the table frame contents
      const data = this.get('tableFrame').slice(0);
      let propertyValues;
      reportDataEvents.forEach(function(reportEvent, i) {
        propertyValues = [];
        for (let k = 0; k < questionPropertiesIdsLen; k++) {
          // Put all values for the same property into an array
          propertyValues[k] = [];
        }

        reportEvent
          .get('resourceResults')
          .map(questionResult => {
            const question = assessmentQuestions.findBy(
              'id',
              questionResult.get('resourceId')
            );
            questionResult.set('resource', question);
            return questionResult;
          })
          .sortBy('resource.sequence')
          .forEach(function(questionResult, l) {
            const j = l + 1;
            for (let k = 0; k < questionPropertiesIdsLen; k++) {
              const renderFunction = questionProperties[k].renderFunction;
              let value = questionResult.get(questionPropertiesIds[k]);
              let status = 'not-started';
              if (questionResult.get('skipped')) {
                status = 'skipped';
              } else if (
                questionResult.get('resource.type') === 'extended_text'
              ) {
                status = 'extended_text';
              } else if (questionResult.get('answer')) {
                status = value ? 'correct' : 'incorrect';
              }
              if (k === 0) {
                value = status;
              }
              let renderOut = !renderFunction ? value : renderFunction(value);
              if (renderFunction.name === 'formatTime' && value === 0) {
                renderOut = `<span class="ad score answer-not-started">${j}</span>`;
              }
              let questionRenderOut = component.getOutPutForCollectionQuestion(
                questionResult,
                j
              );
              renderOut = questionRenderOut ? questionRenderOut : renderOut;

              data[i].content[j * questionPropertiesIdsLen + k] = {
                value,
                output: renderOut
              };
              propertyValues[k].push(questionResult);
            }
          });

        // Compute the aggregate values
        for (let k = 0; k < questionPropertiesIdsLen; k++) {
          // Set the value in the aggregate (totals) column;
          const value = reportEvent.get(questionProperties[k].aggregateValue);
          const aggregateRenderFunction =
            questionProperties[k].aggregateRenderFunction;

          // For displaying the aggregate value, use the question property's aggregateRenderFunction.
          // If there's no aggregateRenderFunction, use the property's renderFunction by default.
          let aggregateOutput = aggregateRenderFunction
            ? aggregateRenderFunction(value)
            : questionProperties[k].renderFunction(value);
          aggregateOutput =
            aggregateOutput && aggregateOutput !== '' ? aggregateOutput : '-';

          data[i].content[k] = {
            value,
            output: aggregateOutput
          };
        }
      });

      return data;
    }
  ),

  getOutPutForCollectionQuestion(questionResult, idx) {
    const component = this;
    const questionPropertiesIds = this.get('questionPropertiesIds');

    let renderOut;
    let value = questionResult.get(questionPropertiesIds[0]);
    let status = 'not-started';
    if (questionResult.get('skipped')) {
      status = 'skipped';
    } else if (questionResult.get('resource.type') === 'extended_text') {
      status = 'extended_text';
    } else if (questionResult.get('answer')) {
      status = value ? 'correct' : 'incorrect';
    }
    let isQuestion = Object.values(QUESTION_TYPES).find(
      x => x === questionResult.get('resource.type')
    );
    if (component.isCollectionType && isQuestion) {
      renderOut = getAnswerResultIconWithValue(status, idx);
    }
    return renderOut;
  },
  /**
   * @prop {Object[]} tableFrame - The table frame that encloses the table data
   * @return {Object[]}
   */
  tableFrame: Ember.computed(
    'anonymous',
    'students.@each.lastFirstName',
    'students.@each.id',
    function() {
      const anonymous = this.get('anonymous');
      const reportDataEvents = this.get('reportData.reportEvents');
      return this.get('students').map(function(student) {
        let eventsStudent = reportDataEvents.findBy(
          'profileId',
          student.get('id')
        );
        return {
          id: student.get('id'),
          header: anonymous
            ? student.get('code')
            : student.get('lastFirstName'),
          lastFirstName: anonymous
            ? student.get('code')
            : student.get('lastFirstName'),
          avatarUrl: eventsStudent.avatarUrl,
          content: []
        };
      });
    }
  ),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Initialize the question properties array with values -including i18n labels
   * @return {Object[]}
   */
  initQuestionProperties: function() {
    return [
      Ember.Object.create({
        filter: {
          label: this.get('i18n').t('reports.qz-table-view.scores').string,
          disabled: true
        },
        label: this.get('i18n').t('reports.qz-table-view.score').string,
        value: 'correct',
        visible: true,
        renderFunction: getAnswerResultIcon,
        aggregateValue: 'averageScore',
        aggregateRenderFunction: getScoreString
      }),
      Ember.Object.create({
        filter: {
          label: this.get('i18n').t('reports.qz-table-view.study-time').string
        },
        label: this.get('i18n').t('reports.qz-table-view.study-time').string,
        value: 'timeSpent',
        renderFunction: formatTime,
        aggregateValue: 'totalTimeSpent'
      }),
      Ember.Object.create({
        filter: {
          label: this.get('i18n').t('reports.qz-table-view.reactions').string
        },
        label: this.get('i18n').t('reports.qz-table-view.reaction').string,
        value: 'reaction',
        renderFunction: getReactionIcon,
        aggregateValue: 'averageReaction'
      })
    ];
  },

  /**
   * Initialize the students header object with values including an i18n label
   * @return {Object[]}
   */
  initStudentsHeader: function() {
    return {
      label: this.get('i18n').t('reports.qz-table-view.student').string,
      value: 'lastFirstName',
      sortFunction: alphabeticalStringSort
    };
  }
});
