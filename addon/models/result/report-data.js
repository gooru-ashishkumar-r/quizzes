import Ember from 'ember';
import { CONTEXT_EVENT_TYPES } from 'quizzes-addon/config/quizzes-config';
import ReportDataEvent from 'quizzes-addon/models/result/report-data-event';
import QuestionResult from 'quizzes-addon/models/result/question';

/**
 * Report data model for context/assigment report
 *
 * @typedef {Object} ReportData
 *
 */
export default Ember.Object.extend({
  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Collection} collection
   */
  collection: null,

  /**
   * @property {string} collectionId
   */
  collectionId: null,

  /**
   * @property {string} contextId
   */
  contextId: null,

  /**
   * @property {ReportEvent[]} reportEvents
   */
  reportEvents: Ember.A(),

  /**
   * @property {string[]} studentIds - List of student ids
   */
  resourceIds: Ember.computed('collection.resources', function() {
    return this.get('collection.resources').map(function(resource) {
      return resource.get('id');
    });
  }),

  /**
   * @property {string[]} studentIds - List of student ids
   */
  students: Ember.computed('reportEvents.@each.profileId', function() {
    return this.get('reportEvents').map(student =>
      Ember.Object.create({
        id: student.get('profileId'),
        code: student.get('profileCode'),
        fullName: student.get('profileName'),
        lastFirstName: student.get('lastFirstName')
      })
    );
  }),

  /**
   * @property {string[]} studentIds - List of student ids
   */
  studentIds: Ember.computed('students.@each.id', function() {
    return this.get('students').map(student => student.get('id'));
  }),

  /**
   * @property {date} submittedAt Date of submission
   */
  submittedAt: 0,

  // -------------------------------------------------------------------------
  // Methods
  /**
   * Compares the answer values
   * @param {Answer} a
   * @param {Answer} b
   * @returns {Boolean}
   */
  compareAnswers: function(a, b) {
    let result = a && b && a.length === b.length;
    if (result) {
      a.forEach(answerA => {
        const filteredAnswers = b.find(
          answerB => answerB.value === answerA.value
        );
        result &= !!filteredAnswers;
      });
    }
    return result;
  },

  /**
   * Find an event by a profile id
   * @returns {ReportDataEvent[]}
   */
  findByProfileId: function(profileId) {
    return this.get('reportEvents').filter(
      reportEvent => reportEvent.get('profileId') === profileId
    );
  },

  /**
   * Find all results for the question id
   * @param {string} questionId
   * @returns {QuestionResult[]}
   */
  getResultsByQuestion: function(questionId) {
    return this.get('reportEvents')
      .map(reportEvent =>
        reportEvent
          .get('resourceResults')
          .find(result => result.get('resourceId') === questionId)
      )
      .filter(result => result);
  },

  /**
   * Find all results by answer
   * @param {string} questionId
   * @param {Answer} answer
   * @returns {QuestionResult[]}
   */
  getStudentsByQuestionAndAnswer: function(question, answer) {
    return this.get('reportEvents')
      .filter(reportEvent => {
        const questionResult = reportEvent
          .get('resourceResults')
          .find(result => result.get('resourceId') === question.get('id'));
        return questionResult
          ? this.compareAnswers(questionResult.get('answer'), answer)
          : false;
      })
      .map(student =>
        Ember.Object.create({
          id: student.get('profileId'),
          code: student.get('profileCode'),
          fullName: student.get('profileName')
        })
      );
  },

  /**
   * Parse and add event data from web socket
   * @param {Object} eventData
   */
  parseEvent: function(eventData) {
    if (eventData.eventName === CONTEXT_EVENT_TYPES.START) {
      this.parseStartEvent(eventData);
    } else if (eventData.eventName === CONTEXT_EVENT_TYPES.FINISH) {
      this.parseFinishEvent(eventData);
    } else if (eventData.eventName === CONTEXT_EVENT_TYPES.ON_RESOURCE) {
      this.parseOnResourceEvent(eventData);
    }
  },

  /**
   * Parse start event data from web socket
   * @param {Object} eventData
   */
  parseFinishEvent: function(eventData) {
    const oldReportEvents = this.findByProfileId(eventData.profileId);
    if (oldReportEvents.length) {
      oldReportEvents[0].setProfileSummary(
        eventData.eventBody.eventSummary,
        true
      );
      oldReportEvents[0].incrementProperty('updated');
    }
  },

  updatedProfileName: function(profileId, profile) {
    let student = this.get('students').findBy('id', profileId);
    if (student) {
      student.set('lastFirstName', profile.get('lastFirstName'));
      student.set('fullName', profile.get('fullName'));
    }
    const oldReportEvents = this.findByProfileId(profileId);
    if (oldReportEvents.length) {
      oldReportEvents[0].set('lastFirstName', profile.get('lastFirstName'));
      oldReportEvents[0].set('profileName', profile.get('fullName'));
      oldReportEvents[0].set('profileCode', profile.get('profileCode'));
      oldReportEvents[0].incrementProperty('updated');
    }
  },

  /**
   * Parse on resource event data from web socket
   * @param {Object} eventData
   */
  parseOnResourceEvent: function(eventData) {
    const oldReportEvents = this.findByProfileId(eventData.profileId);
    if (oldReportEvents.length) {
      const profileEvent = oldReportEvents[0];
      const previousResource = eventData.eventBody.previousResource;
      profileEvent.set('isAttemptStarted', true);
      profileEvent.setProfileSummary(eventData.eventBody.eventSummary, false);
      profileEvent.set(
        'currentResourceId',
        eventData.eventBody.currentResourceId
      );
      previousResource.skipped = previousResource.isSkipped;
      profileEvent.merge(previousResource.resourceId, previousResource);
      profileEvent.incrementProperty('updated');
    }
  },

  /**
   * Parse start event data from web socket
   * @param {Object} eventData
   */
  parseStartEvent: function(eventData) {
    if (eventData.eventBody.isNewAttempt) {
      const oldReportEvents = this.findByProfileId(eventData.profileId);

      const properties = {
        currentResourceId: eventData.eventBody.currentResourceId,
        profileId: eventData.profileId,
        profileName: '',
        isAttemptStarted: true,
        resourceResults: this.get('collection.resources').map(res =>
          QuestionResult.create(Ember.getOwner(this).ownerInjection(), {
            resourceId: res.id,
            resource: res,
            savedTime: 0,
            reaction: 0,
            answer: null,
            score: 0,
            skipped: true
          })
        )
      };
      if (oldReportEvents.length) {
        const currentReportEvent = oldReportEvents[0];
        currentReportEvent.setProperties(properties);
        currentReportEvent.clearProfileSummary();
        currentReportEvent.incrementProperty('updated');
      } else {
        const newProfileEvent = ReportDataEvent.create(
          Ember.getOwner(this).ownerInjection(),
          properties
        );
        this.get('reportEvents').pushObject(newProfileEvent);
      }
    }
  },

  /**
   * Replace an event using a profile id
   * @param {String} profileId
   * @param {Object} profileEvent
   */
  replaceByProfileId: function(profileId, profileEvent) {
    this.set(
      'reportEvents',
      this.get('reportEvents').map(
        reportEvent =>
          reportEvent.get('profileId') === profileId
            ? profileEvent
            : reportEvent
      )
    );
  },

  /**
   * Set the collection and update the events to have all resources
   * @param {Collection} collection
   */
  setCollection(collection) {
    this.set('collection', collection);
    const reportEvents = this.get('reportEvents');
    reportEvents.forEach(reportEvent => {
      reportEvent.setCollection(collection);
    });
  }
});
