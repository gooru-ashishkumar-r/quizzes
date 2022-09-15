import QuestionComponent from 'quizzes-addon/components/player/questions/qz-question';
import Ember from 'ember';

/**
 * SERP decoding question
 * Component responsible for controlling the logic and appearance of a true
 * or false question inside of the {@link player/qz-question-viewer.js}
 * @module
 * @see controllers/player.js
 * @see components/player/qz-question-viewer.js
 * @augments ember/Component
 */
export default QuestionComponent.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  session: Ember.inject.service('session'),

  /**
   * @type {MediaService} mediaService
   * @property {Ember.Service} Service to work with media
   */
  mediaService: Ember.inject.service('quizzes/api-sdk/media'),

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['serp-silent-reading'],

  // -------------------------------------------------------------------------
  // Properties

  userId: Ember.computed.alias('session.userId'),

  questions: Ember.computed('question', function() {
    return this.get('question.answerDetails');
  }),

  totalReadingTime: 0,

  intervalObject: null,

  // -------------------------------------------------------------------------
  // Events

  didInsertElement() {
    this._super(...arguments);
    this.set('intervalObject', this.readingTimer());
  },

  init: function() {
    this._super(...arguments);
  },

  didDestoryElement() {
    clearInterval(this.get('intervalObject'));
  },

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    onConfirm() {
      clearInterval(this.get('intervalObject'));
      let answers = this.get('questions').map(() => {
        return { value: this.get('totalReadingTime') };
      });
      this.notifyAnswerCompleted(answers);
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  readingTimer() {
    let component = this;
    return setInterval(() => {
      component.incrementProperty('totalReadingTime', 1000);
    }, 1000);
  }
});
