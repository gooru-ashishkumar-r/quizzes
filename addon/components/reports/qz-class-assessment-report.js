import Ember from 'ember';
import ModalMixin from 'quizzes-addon/mixins/modal';
import { VIEW_LAYOUT_PICKER_OPTIONS } from 'quizzes-addon/config/quizzes-config';
import ContextResult from 'quizzes-addon/models/result/context';
import TenantSettingsMixin from 'gooru-web/mixins/tenant-settings-mixin';

export default Ember.Component.extend(ModalMixin, TenantSettingsMixin, {
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @type {CollectionService} collectionService
   * @property {Ember.Service} Service to retrieve a collection
   */
  quizzesCollectionService: Ember.inject.service('quizzes/collection'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'qz-class-assessment-report'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Set a new emotion as selected and update the component appearance accordingly
     *
     * @function actions:changeView
     * @param {string} layout type @see gru-view-layout-picker
     * @returns {undefined}
     */
    changeView: function(layout) {
      const thumbnails = layout === VIEW_LAYOUT_PICKER_OPTIONS.LIST;
      this.set('isTableView', !thumbnails);
    },

    /**
     * When showing the student details
     * @param {string} studentId
     */
    viewAssessmentReport: function(studentId) {
      Ember.Logger.debug(
        `Class assessment report: student with ID ${studentId} was selected`
      );

      const reportData = this.get('reportData');
      const assessment = this.get('assessment');
      const reportEvent = reportData.findByProfileId(studentId)[0];
      const resourceResults = reportEvent.get('resourceResults');
      const classFramework = this.get('classFramework');
      const isDefaultShowFW = this.get('isDefaultShowFW');
      resourceResults.forEach(function(resourceResult) {
        const resource = assessment
          .get('resources')
          .findBy('id', resourceResult.get('resourceId'));
        resourceResult.set('resource', resource);
      });
      const contextResult = ContextResult.create({
        reportEvent,
        averageReaction: Ember.computed.alias('reportEvent.averageReaction'),
        correctPercentage: Ember.computed.alias('reportEvent.averageScore'),
        correctAnswers: Ember.computed.alias('reportEvent.totalCorrect'),
        currentResourceId: Ember.computed.alias(
          'reportEvent.currentResourceId'
        ),
        totalTimeSpent: Ember.computed.alias('reportEvent.totalTimeSpent'),
        totalAttempts: 1,
        selectedAttempt: 1,
        resourceResults: Ember.computed.alias('reportEvent.resourceResults'),
        collection: assessment,
        isRealTime: this.get('isRealTime'),
        showAttempts: this.get('showAttempts')
      });

      let isCollection = contextResult.reportEvent.collection.isCollection;

      const profile = Ember.Object.create({
        username: contextResult.reportEvent.profileName
      });

      if (isCollection) {
        this.get('quizzesCollectionService')
          .getCollection(
            contextResult.reportEvent.collectionId,
            classFramework,
            isDefaultShowFW
          )
          .then(collectionData => {
            Ember.set(
              contextResult.collection,
              'thumbnailUrl',
              collectionData.thumbnailUrl
            );
            Ember.set(
              contextResult.collection,
              'standards',
              collectionData.taxonomy
            );

            const modalModel = {
              contextResult,
              width: '80%',
              profile: profile
            };

            this.actions.showModal.call(
              this,
              'reports.qz-assessment-report',
              modalModel,
              null,
              'qz-assessment-report-modal',
              true
            );
          });
      } else {
        this.get('quizzesCollectionService')
          .getAssessment(
            contextResult.reportEvent.collectionId,
            classFramework,
            isDefaultShowFW
          )
          .then(collectionData => {
            Ember.set(
              contextResult.collection,
              'thumbnailUrl',
              collectionData.thumbnailUrl
            );
            Ember.set(
              contextResult.collection,
              'standards',
              collectionData.taxonomy
            );

            const modalModel = {
              contextResult,
              width: '80%',
              profile: profile
            };

            this.actions.showModal.call(
              this,
              'reports.qz-assessment-report',
              modalModel,
              null,
              'qz-assessment-report-modal',
              true
            );
          });
      }
    },

    /**
     * When showing the question details
     * @param {string} questionId
     */
    viewQuestionDetail: function(questionId) {
      Ember.Logger.debug(
        `Assessment report: question with ID ${questionId} was selected`
      );

      const question = this.get('assessment.resources').findBy(
        'id',
        questionId
      );
      const modalModel = {
        anonymous: this.get('anonymous'),
        selectedQuestion: question,
        reportData: this.get('reportData'),
        width: '75%'
      };
      this.actions.showModal.call(
        this,
        'reports.class-assessment.qz-questions-detail',
        modalModel,
        null,
        'qz-questions-detail-modal',
        true
      );
    }
  },

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Indicates if the report is displayed in anonymous mode
   * @property {boolean} anonymous
   */
  anonymous: false,

  /**
   * @prop { Collection } assessment - Assessment taken by a group of students
   */
  assessment: Ember.computed.alias('reportData.collection'),

  /**
   * @prop { boolean } isTableView - is the table view currently selected?
   */
  isTableView: true,

  /**
   * @property { ReportData } report data
   */
  reportData: null,

  /**
   * @prop { boolean } isRealTime - if the report is a real time report
   */
  isRealTime: false,

  /**
   * @prop { boolean } isRealTime - if the report is a real time report
   */
  showAttempts: false,

  isCollectionType: Ember.computed('', function() {
    const reportData = this.get('reportData');
    const reportEvent =
      reportData.reportEvents && reportData.reportEvents.length > 0
        ? reportData.reportEvents[0]
        : reportData;
    let isCollection =
      reportEvent &&
      reportEvent.collection &&
      reportEvent.collection.isCollection
        ? reportEvent.collection.isCollection
        : false;
    return isCollection;
  }),

  classFramework: Ember.computed('class', function() {
    return this.get('class.preference') &&
      this.get('class.preference.framework')
      ? this.get('class.preference.framework')
      : null;
  })
});
