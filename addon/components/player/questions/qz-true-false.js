import Ember from 'ember';
import QuestionComponent from 'quizzes-addon/components/player/questions/qz-question';
import { generateUUID } from 'quizzes-addon/utils/utils';

/**
 * True or false Question
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

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-true-false'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * When the user changes the answer choice selection
     * @param {number} answerId
     * @param {boolean} onLoad if this was called when loading the component
     */
    selectAnswerChoice: function(answerId, onLoad) {
      const component = this;
      const answer = [
        {
          value: answerId
        }
      ];
      component.notifyAnswerChanged(answer);
      if (onLoad) {
        component.notifyAnswerLoaded(answer);
      } else {
        component.notifyAnswerCompleted(answer);
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events

  init: function() {
    this._super(...arguments);
    if (this.get('hasUserAnswer')) {
      this.actions.selectAnswerChoice.call(
        this,
        this.get('userAnswer.firstObject.value'),
        true
      );
    }
  },

  // -------------------------------------------------------------------------
  // Properties
  useGroup: function() {
    return this.get('userAnswer.firstObject.value') || generateUUID();
  }.property(),
  /**
   * Returns the answer value of first answer option
   */
  firstAnswerId: Ember.computed('question.answers', function() {
    const answers = this.get('question.answers');
    if (answers && answers.length) {
      return answers[0].value;
    } else {
      return null;
    }
  }),

  /**
   * Returns the first answer object
   */
  firstAnswerObject: Ember.computed('question.answers', function() {
    const answers = this.get('question.answers');
    return answers[0];
  }),

  /**
   * Returns the value of second answer option
   */
  secondAnswerId: Ember.computed('question.answers', function() {
    const answers = this.get('question.answers');
    if (answers && answers.length) {
      return answers[1].value;
    } else {
      return null;
    }
  }),

  /**
   * Returns the second answer object
   */
  secondAnswerObject: Ember.computed('question.answers', function() {
    const answers = this.get('question.answers');
    return answers[1];
  })

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
});
