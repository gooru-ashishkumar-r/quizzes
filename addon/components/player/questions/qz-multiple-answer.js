import Ember from 'ember';
import QuestionComponent from 'quizzes-addon/components/player/questions/qz-question';

/**
 * Multiple Answer Question
 *
 * Component responsible for controlling the logic and appearance of a multiple
 * answer question inside of the {@link player/qz-question-viewer.js}
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
  classNames: ['qz-multiple-answer'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * When the user changes the answer choice selection
     * @param {string} answerId
     * @param {boolean} onLoad if this was called when loading the component
     */
    selectAnswerChoice: function(answerId) {
      const component = this;
      component.setUserAnswerChoice(answerId);
      component.notify(false);
    }
  },

  // -------------------------------------------------------------------------
  // Events

  init: function() {
    this._super(...arguments);
    const component = this;
    Ember.run.scheduleOnce('afterRender', component, function() {
      const userAnswers = component.get('userAnswer');
      const answers = component.get('question.answers');
      const userSelection = userAnswers
        ? answers.map(answer => ({
          value: answer.value,
          selection: !!userAnswers.findBy('value', answer.value)
        }))
        : Ember.A();
      component.set('userSelection', userSelection);
      if (component.get('hasUserAnswer')) {
        component.notify(true);
      }
    });
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * Convenient structure to render options
   * @property {[]}
   */
  answers: Ember.computed('question.answers', 'userSelection', function() {
    const component = this;
    const answers = this.get('question.answers');
    const userSelection = this.get('userSelection');
    return answers.map(function(answer) {
      const answerId = answer.get('value');
      const filteredUserAnswer = userSelection
        ? userSelection.findBy('value', answerId)
        : null;
      return {
        value: answerId,
        text: answer.get('text'),
        groupValue: filteredUserAnswer
          ? component.userSelectionItemToChoice(filteredUserAnswer)
          : null
      };
    });
  }),

  // -------------------------------------------------------------------------
  // Observers

  resetUserSelection: Ember.observer('question', function() {
    this.set('userSelection', Ember.A());
  }),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Converts the answer choice string to a  user selection item
   * @param {string} answerChoice  in the format value|id, i.e yes|answer_1
   * @returns {{id: *, selection: boolean}}
   */
  choiceToUserSelectionItem: function(answerChoice) {
    const values = answerChoice.split('|');
    const value = values[1];
    const selection = values[0] === 'yes';
    return { value, selection };
  },

  /**
   * Indicates when the answer is completed
   * @return {boolean}
   */
  isAnswerCompleted: function() {
    const component = this,
      userSelection = component.get('userSelection'),
      totalAnswerChoices = component.get('question.answers.length');
    return userSelection.get('length') === totalAnswerChoices;
  },

  /**
   * Notifies answer events
   * @param {boolean} onLoad if this was called when loading the component
   */
  notify: function(onLoad) {
    const component = this;
    const userSelection = component
      .get('userSelection')
      .filter(answer => answer.selection)
      .map(answer => ({ value: answer.value }));
    component.notifyAnswerChanged(userSelection);
    if (component.isAnswerCompleted()) {
      if (onLoad) {
        component.notifyAnswerLoaded(userSelection);
      } else {
        component.notifyAnswerCompleted(userSelection);
      }
    }
  },

  /**
   * Sets the user answer choice
   * @param {string} answerChoice containing the user selection yes|120202 or no|20200392
   */
  setUserAnswerChoice: function(answerChoice) {
    const userSelection = this.get('userSelection');
    const userSelectionItem = this.choiceToUserSelectionItem(answerChoice);
    const value = userSelectionItem.value;
    const selection = userSelectionItem.selection;
    const found = userSelection.findBy('value', value);
    if (found) {
      found.selection = selection;
    } else {
      userSelection.addObject(userSelectionItem);
    }
  },

  /**
   * Converts user selection item to answer choice
   * @param {{value: *, selection: boolean}} userSelectionItem
   *
   * @return {string} in the format selection|value, i.e yes|answer_1
   */
  userSelectionItemToChoice: function(answer) {
    return `${answer.selection ? 'yes' : 'no'}|${answer.value}`;
  },
  didInsertElement: function() {
    const $fileInput = this.$('input[type="radio"]');
    if ($fileInput) {
      for (let i = 0; i < $fileInput.length; i++) {
        $fileInput[i].title = $fileInput[i].id;
      }
    }
  }
});
