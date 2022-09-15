import Ember from 'ember';
import QuestionUtil from 'quizzes-addon/utils/question/question';
import { stats } from 'quizzes-addon/utils/question-result';
import {
  CORRECT_COLOR,
  INCORRECT_COLOR,
  ANONYMOUS_COLOR,
  OPEN_ENDED_COLOR
} from 'quizzes-addon/config/quizzes-config';

/**
 * Question Performance Component
 *
 * Component responsible for displaying the question performance information for several students
 *
 * @module
 * @augments Ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'class-assessment', 'qz-question-performance'],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Indicates if the report is displayed in anonymous mode
   * @property {boolean} anonymous
   */
  anonymous: null,

  /**
   * Indicates if is anonymous and show the performance Results
   * @property {boolean} anonymousAndShowResult
   */
  anonymousAndNotShowResult: Ember.computed(
    'anonymous',
    'showResult',
    function() {
      return this.get('anonymous') && !this.get('showResult');
    }
  ),

  /**
   * Indicates if is anonymous and show the performance Results
   * @property {boolean} anonymousAndShowResult
   */
  anonymousAndShowResult: Ember.computed.and('anonymous', 'showResult'),

  /**
   * Convenience structure to display the answers distribution
   * @property {*} answer distributions
   */
  answersData: Ember.computed('questionResults.@each.updated', function() {
    const component = this;
    const reportData = component.get('reportData');
    const question = component.get('question');
    const questionUtil = QuestionUtil.create({ question });
    const distribution = questionUtil.distribution(this.get('questionResults'));

    const answersData = Ember.A([]);
    distribution.forEach(function(answerDistribution) {
      const userAnswer = answerDistribution.get('answer');
      const students = reportData.getStudentsByQuestionAndAnswer(
        question,
        userAnswer
      );
      const correct = answerDistribution.get('correct');
      const percentage = answerDistribution
        ? answerDistribution.get('percentage')
        : 0;
      const result = answerDistribution.get('result');
      const isOpenEndedQuestion = answerDistribution.get('isOpenEndedQuestion');
      result.set('resource', question);
      answersData.addObject(
        Ember.Object.create({
          correct,
          userAnswer,
          percentage,
          students,
          result,
          isOpenEndedQuestion,
          charData: Ember.A([
            Ember.Object.create({
              color: correct ? CORRECT_COLOR : INCORRECT_COLOR,
              percentage
            })
          ])
        })
      );
    });

    return answersData;
  }),

  /**
   * @property {Resource} question
   */
  question: null,

  /**
   * Returns a convenient structure to display the x-bar-chart
   */
  questionBarChartData: Ember.computed(
    'questionResults.[]',
    'anonymousAndNotShowResult',
    function() {
      const questionResults = this.get('questionResults');

      const totals = stats(questionResults);
      const total = totals.get('total');
      const anonymousAndNotShowResult = this.get('anonymousAndNotShowResult');
      let isOpenEnded = totals.get('isOpenEnded');
      return Ember.Object.create({
        data: [
          {
            color: isOpenEnded ? OPEN_ENDED_COLOR : ANONYMOUS_COLOR,
            percentage: totals.get('openEndedPercentageTotal')
          },
          {
            color: anonymousAndNotShowResult
              ? ANONYMOUS_COLOR
              : INCORRECT_COLOR,
            percentage: totals.get('incorrectPercentageFromTotal')
          },
          {
            color: anonymousAndNotShowResult ? ANONYMOUS_COLOR : CORRECT_COLOR,
            percentage: totals.get('correctPercentageFromTotal')
          }
        ],
        completed: totals.get('totalCompleted'),
        total
      });
    }
  ),

  /**
   * Question results for this question, all students
   *
   * @property {QuestionResult[]}
   */
  questionResults: Ember.computed(
    'question',
    'reportData.reportEvents.@each.updated',
    function() {
      const reportData = this.get('reportData');
      return reportData.getResultsByQuestion(this.get('question.id'));
    }
  ),

  /**
   * @prop { ReportData } reportData - Representation of the data to show in the reports as a 3D matrix
   * Any changes on the content feed will cause the report data to update
   */
  reportData: null,

  /**
   * Indicates when the report is display in anonymous mode if show all performance results
   * @property {boolean} showResult
   */
  showResult: null,

  /**
   * @property {User[]} students
   */
  students: null,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * willDestroyElement event
   */
  willDestroyElement: function() {
    const component = this;
    component.set('showResult', false);
    component.set('anonymous', false);
  }
});
