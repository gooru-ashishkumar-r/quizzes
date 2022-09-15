import Ember from 'ember';

/**
 * Questions summary component
 *
 * Component responsible for laying out the question details for the class assessment report
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'class-assessment', 'qz-questions-detail'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * When clicking at any navigation bubble
     * @param bubbleOption
     */
    bubbleSelect: function(bubbleOption) {
      this.set('selectedQuestion', bubbleOption.get('value'));
    },
    /**
     * Show performance results
     */
    showResult: function() {
      if (this.get('anonymous')) {
        this.set('showResult', !this.get('showResult'));
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties
  /**
   * Component model, this was necessary because this component is rendered in a modal
   * @see qz-modal.js
   */
  model: null,

  /**
   * @property {Collection} assessment
   */
  assessment: Ember.computed.alias('reportData.collection'),

  /**
   * @prop { ReportData } reportData - Representation of the data to show in the reports as a 3D matrix
   * Any changes on the content feed will cause the report data to update
   */
  reportData: Ember.computed.alias('model.reportData'),

  /**
   * Indicates if the report is displayed in anonymous mode
   * @property {boolean} anonymous
   */
  anonymous: Ember.computed.alias('model.anonymous'),

  /**
   * Indicates when the report is display in anonymous mode if show all performance results
   * @property {boolean} showResult
   */
  showResult: false,

  /**
   * @prop { User[] } students - Group of students taking an assessment
   */
  students: Ember.computed.alias('reportData.students'),

  /**
   * Returns a convenience structure to display the question navigation bubbles
   * @returns {Array}
   */
  questionsNavOptions: Ember.computed(
    'assessment.resources.@each.id',
    function() {
      const questions = this.get('assessment.resources');
      const selectedQuestion = this.get('selectedQuestion');
      return questions.map((question, index) =>
        Ember.Object.create({
          label: index + 1,
          status: null, //no status needed
          value: question,
          selected:
            selectedQuestion &&
            selectedQuestion.get('id') === question.get('id')
        })
      );
    }
  ),

  /**
   * @property {Resource} selected question
   */
  selectedQuestion: Ember.computed.alias('model.selectedQuestion')

  // -------------------------------------------------------------------------
  // Methods
});
