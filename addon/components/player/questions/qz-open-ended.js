import Ember from 'ember';
import QuestionComponent from 'quizzes-addon/components/player/questions/qz-question';

/**
 * Open Ended Question
 *
 * Component responsible for controlling the logic and appearance of an open
 * ended question inside of the {@link player/qz-question-viewer.js}
 *
 * @module
 * @see controllers/player.js
 * @see components/player/qz-question-viewer.js
 * @augments Ember/Component
 */
export default QuestionComponent.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-open-ended'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  /**
   * When loading the user answer
   */
  updateUserAnswer: Ember.on('init', function() {
    const component = this;
    component.setAnswers();
  }),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {string} the user answer
   */
  answer: '',

  /**
   * @property {number} characters left
   */
  charactersLeft: function() {
    return this.get('maxLength') - this.get('answer').length;
  }.property('answer'),

  /**
   * Indicates when the answer is completed
   * @return {bool}
   */
  isAnswerCompleted: Ember.computed.bool('answer.length'),

  /**
   * @property {number} max answer length
   */
  maxLength: 1000,

  // -------------------------------------------------------------------------
  // Observers

  /**
   * When the user changes the response
   */
  updateAnswerObserver: function() {
    this.notify(false);
  },

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Notifies answer events
   * @param {boolean} onLoad if this was called when loading the component
   */
  notify: function(onLoad) {
    const component = this,
      answer = [{ value: Ember.$.trim(component.get('answer')) }];
    component.notifyAnswerChanged(answer);
    if (component.get('isAnswerCompleted')) {
      if (onLoad) {
        component.notifyAnswerLoaded(answer);
      } else {
        component.notifyAnswerCompleted(answer);
      }
    } else {
      component.notifyAnswerCleared(answer);
    }
  },

  /**
   * Set answer
   * */
  setAnswers: function() {
    if (this.get('hasUserAnswer')) {
      const userAnswer = this.get('userAnswer.firstObject.value');
      this.set('answer', userAnswer);
      this.notify(true);
    }
    // set observer for answer update
    this.addObserver('answer', this.updateAnswerObserver);
  }
});
