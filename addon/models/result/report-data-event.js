import Ember from 'ember';
import QuestionResult from 'quizzes-addon/models/result/question';
import ResourceResult from 'quizzes-addon/models/result/resource';

/**
 * Profile results/events by resource
 *
 * @typedef {Object} ReportDataEvent
 *
 */
export default Ember.Object.extend({
  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {String} attemptId
   */
  attemptId: null,

  /**
   * @property {Number} averageReaction averaged student's reactions
   */
  averageReaction: 0,

  /**
   * @property {Number} averageScore calculated student score
   */
  averageScore: 0,

  /**
   * @property {Collection} collection
   */
  collection: null,

  /**
   * @property {String} collectionId
   */
  collectionId: null,

  /**
   * @property {String} contextId
   */
  contextId: null,

  /**
   * @property {string} currentResourceId
   */
  currentResourceId: null,

  /**
   * @property {boolean} isAttemptStarted - if the user started the attempt
   */
  isAttemptStarted: true,

  /**
   * @property {boolean} isAttemptFinished - if the user finished the attempt
   */
  isAttemptFinished: false,

  /**
   * @property {QuestionResult[]} questionResults
   */
  questionResults: Ember.computed('resourceResults.[]', function() {
    return this.get('resourceResults').filter(
      resourceResult => resourceResult instanceof QuestionResult
    );
  }),

  /**
   * @property {ResourceResult[]} questionResults
   */
  resourceResults: Ember.A(),

  /**
   * @property {string} profileId student's id
   */
  profileId: null,

  /**
   * @property {string} profileCode student's anonymous code
   */
  profileCode: Ember.computed('profileId', function() {
    return this.get('studentId')
      ? this.get('studentId')
      : this.get('profileId').slice(0, 4);
  }),

  /**
   * @property {string} profileName student's name
   */
  profileName: null,

  /**
   * @property {Number} totalAnswered total number of answered questions
   */
  totalAnswered: 0,

  /**
   * @property {Number} totalCorrect total number of correct answers
   */
  totalCorrect: 0,

  /**
   * @property {Number} totalIncorrect total number of incorrect answers
   */
  totalIncorrect: Ember.computed('totalAnswered', 'totalCorrect', function() {
    return this.get('totalAnswered') - this.get('totalCorrect');
  }),

  /**
   * @property {Number} totalTimeSpent summarized time spent
   */
  totalTimeSpent: 0,

  /**
   * @property {Number} updated keep track of updated to redraw realtime dashboard
   */
  updated: 0,

  /**
   * @property {string} profile student's ID
   */
  studentId: null,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Set summary properties coming from web sockets events
   */
  clearProfileSummary: function() {
    this.set('isAttemptFinished', false);
    this.set('totalAnswered', 0);
    this.set('totalCorrect', 0);
    this.set('averageReaction', 0);
    this.set('averageScore', 0);
    this.set('totalTimeSpent', 0);
  },

  /**
   * Find a resource's index by its id
   */
  findIndexByResourceId: function(resourceId) {
    return this.get('resourceResults').reduce(
      (index, result, current) =>
        result.get('resourceId') === resourceId ? current : index,
      -1
    );
  },

  /**
   * Merge a new result with the corresponding resource result
   */
  merge: function(resourceId, newResult) {
    const index = this.findIndexByResourceId(resourceId);
    newResult.savedTime = newResult.savedTime || newResult.timeSpent;
    const result = this.get('resourceResults').get(index);
    result.clear();
    result.setProperties({
      resourceId: newResult.resourceId,
      savedTime: newResult.savedTime,
      skipped: newResult.skipped,
      reaction: newResult.reaction,
      answer: newResult.answer,
      score: newResult.score
    });
    result.incrementProperty('updated');
  },

  /**
   * Set the collection and update the events to have all resources
   * @param {Collection} collection
   */
  setCollection(collection) {
    this.set('collection', collection);
    this.set('collectionId', collection.get('id'));
    const resources = collection.get('resources');
    const resourceResults = this.get('resourceResults');
    const resourceResultSet = Ember.A();
    resources.forEach(resource => {
      const resourceResult = resourceResults.find(
        res => res.resourceId === resource.id && !res.subQuestionId
      );
      let hasSubQuestion = !!(
        resource.subQuestions && resource.subQuestions.length
      );
      if (resourceResult) {
        if (resource.get('isResource')) {
          const result = ResourceResult.create({
            resourceId: resource.id,
            resource,
            savedTime: resourceResult.savedTime,
            reaction: resourceResult.reaction,
            answer: resourceResult.answer || null,
            score: resourceResult.score,
            skipped: !hasSubQuestion ? resourceResult.skipped : false
          });
          resourceResults.removeObject(resourceResult);
          resourceResults.pushObject(result);
        }
        resourceResult.set('resource', resource);
        resourceResultSet.pushObject(resourceResult);
      } else {
        const ResultModel = resource.get('isResource')
          ? ResourceResult
          : QuestionResult;
        const newResourceData = ResultModel.create(
          Ember.getOwner(this).ownerInjection(),
          {
            resourceId: resource.id,
            resource: resource,
            savedTime: 0,
            reaction: 0,
            answer: null,
            score: 0,
            skipped: true
          }
        );
        resourceResultSet.pushObject(newResourceData);
      }
      if (resource.subQuestions) {
        let subResource = Ember.A();
        let subQuestions = resource.subQuestions;
        subQuestions.forEach(subQuestion => {
          let subResultEvent =
            resourceResult &&
            resourceResult.subResources &&
            resourceResult.subResources.findBy('resourceId', subQuestion.id);
          if (subResultEvent) {
            const subResult = QuestionResult.create({
              subResourceId: subResultEvent.resourceId,
              resourceId: resource.baseResourceId,
              question: subQuestion,
              resource: subQuestion,
              savedTime: subResultEvent.savedTime,
              reaction: subResultEvent.reaction,
              answer: subResultEvent.answer || null,
              score: subResultEvent.score,
              skipped: subResultEvent.skipped
            });
            subResource.pushObject(subResult);
          }
        });
        resource.set('subResource', subResource);
      }
    });
    this.set('resourceResults', resourceResultSet);
  },

  /**
   * Set properties coming from the profile
   */
  setProfileProperties: function(profile) {
    if (profile) {
      this.set('profileName', profile.get('fullName'));
      this.set('studentId', profile.get('studentId'));
      this.set('lastFirstName', profile.get('lastFirstName'));
    }
  },

  /**
   * Set summary properties coming from web sockets events
   */
  setProfileSummary: function(summary, isAttemptFinished) {
    this.set('isAttemptFinished', isAttemptFinished);
    this.set('totalAnswered', summary.totalAnswered);
    this.set('totalCorrect', summary.totalCorrect);
    this.set('averageReaction', summary.averageReaction);
    this.set('averageScore', summary.averageScore);
    this.set('totalTimeSpent', summary.totalTimeSpent);
  }
});
