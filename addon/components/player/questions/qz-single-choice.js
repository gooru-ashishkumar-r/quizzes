import QuestionComponent from 'quizzes-addon/components/player/questions/qz-question';
import { generateUUID } from 'quizzes-addon/utils/utils';

/**
 * Single Choice Question
 *
 * Component responsible for controlling the logic and appearance of a multiple
 * choice question inside of the {@link player/qz-question-viewer.js}
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
  classNames: ['qz-single-choice'],

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

  didInsertElement: function() {
    this._super(...arguments);
    if (this.get('userAnswer')) {
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
   * @property {boolean} isChooseOne Help to handle selection for choose on question
   */
  isChooseOne: false

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
});
