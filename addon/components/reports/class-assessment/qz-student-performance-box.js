import Ember from 'ember';
import {
  getGradeColor,
  roundTimeToGreatestValue
} from 'quizzes-addon/utils/utils';
import { DEFAULT_IMAGES } from 'quizzes-addon/config/quizzes-config';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'class-assessment', 'qz-student-performance-box'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * When the user clicks at the box
     */
    selectStudent: function() {
      const component = this;
      component.get('onSelectStudent')(component.get('student.profileId'));
      Ember.Logger.debug(
        `Clicking at student: ${component.get('student.profileId')}`
      );
    },

    /**
     * @function actions:selectQuestion
     * @param {Number} questionId
     */
    selectQuestion: function(questionId) {
      if (questionId) {
        this.get('onSelectQuestion')(questionId);
      }
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Indicates if the report is displayed in anonymous mode
   * @property {boolean} anonymous
   */
  anonymous: false,

  /**
   * @property {Function} onSelectQuestion - Event handler called when a question in a column is selected
   */
  onSelectQuestion: null,

  /**
   * It returns an object representing the status for each question
   * @property {[]} questions
   */
  questions: Ember.computed('reportData.@each.answer', function() {
    const component = this;
    const reportData = component.get('reportData');
    return reportData.map(item => component.getQuestionStatus(item));
  }),

  /**
   * Array containing the QuestionResult or empty object based on the student responses
   * empty object for not started questions
   * @property {QuestionResult[]} reportData
   */
  reportData: null,

  /**
   * @property {number} user assessment score
   */
  score: Ember.computed.alias('student.averageScore'),

  /**
   * @property {String} startedStyle style safe string for started
   */
  startedStyle: Ember.computed('score', 'student.totalAnswered', function() {
    return this.get('student.totalAnswered')
      ? Ember.String.htmlSafe(
        `background-color: ${getGradeColor(this.get('score'))}`
      )
      : '';
  }),

  /**
   * @property {User} student
   */
  student: null,

  /**
   * Get students avatar url if present,
   * if not returns the default profile img
   */
  studentAvatarUrl: Ember.computed('student.avatarUrl', function() {
    let imageUrl;
    if (
      this.get('student.avatarUrl') &&
      this.get('student.avatarUrl') !== 'undefined'
    ) {
      imageUrl = this.get('student.avatarUrl');
    } else {
      const appRootPath = this.get(
        'configurationService.configuration.appRootPath'
      )
        ? this.get('configurationService.configuration.appRootPath')
        : '/';
      imageUrl = appRootPath + DEFAULT_IMAGES.USER_PROFILE;
    }

    return imageUrl;
  }),

  /**
   * returns split of lastFirstName of student
   */
  studentLastFirstName: Ember.computed('student.lastFirstName', function() {
    let studentNameArray,
      studentLastName = '',
      studentFirstName = '',
      studentLastFirstNameObject;
    if (
      this.get('student.lastFirstName') &&
      this.get('student.lastFirstName') !== 'undefined'
    ) {
      studentNameArray = this.get('student.lastFirstName').split(',');
      if (studentNameArray.length === 1) {
        studentLastName = studentNameArray[0];
        studentFirstName = '';
      } else if (studentNameArray.length > 1) {
        studentNameArray.map((curVal, curIndex) => {
          if (curIndex === 0) {
            studentLastName = curVal;
          } else {
            studentFirstName = studentFirstName + curVal;
          }
        });
      } else {
        studentLastName = '';
        studentFirstName = '';
      }
      studentLastFirstNameObject = {
        studentLastName: studentLastName,
        studentFirstName: studentFirstName
      };
    }

    return studentLastFirstNameObject;
  }),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Gets the question status
   * @param {QuestionResult} questionResult
   */
  getQuestionStatus: function(questionResult) {
    let status = 'not-started',
      questionId = questionResult.get('resourceId'),
      title;
    if (
      questionResult.get('isResource') === true &&
      questionResult.get('skipped') === false
    ) {
      status = 'started';
      questionId = questionResult.get('questionId');
    } else {
      if (questionResult.get('started')) {
        //if it has been started
        status = questionResult.get('attemptStatus');
        questionId = questionResult.get('questionId');
      }
    }
    title = this.getResourceTitle(questionId);

    return Ember.Object.create({
      status,
      savedTime: roundTimeToGreatestValue(questionResult.savedTime),
      id: questionId,
      title: title
    });
  },

  getResourceTitle(questionId) {
    return this.get('student.collection.resources') &&
      this.get('student.collection.resources').findBy('id', questionId)
      ? this.get('student.collection.resources').findBy('id', questionId).title
      : '';
  }
});
