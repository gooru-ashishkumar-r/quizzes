import Ember from 'ember';
import QuestionComponent from 'quizzes-addon/components/player/questions/qz-question';
/**
 * Hot Spot Text
 *
 * Component responsible for controlling the logic and appearance of a hot spot
 * text question inside of the {@link player/qz-question-viewer.js}
 *
 * @module
 * @see controllers/player.js
 * @see components/player/qz-question-viewer.js
 * @augments Ember/Component
 */
export default QuestionComponent.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-hs-text'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  /**
   * Remove click event on answers
   */
  removeSubscriptions: Ember.on('willDestroyElement', function() {
    this.$('li.answer').off('click');
  }),

  /**
   * Initialize answers when the user has previous answers or not
   */
  setupInstanceProperties: Ember.on('init', function() {
    const component = this;
    component.setAnswers();
  }),

  /**
   * Set answers and set click events on every answer to selected and unselected answers
   */
  setupSubscriptions: Ember.on('didInsertElement', function() {
    const component = this;
    const readOnly = component.get('readOnly');

    component.setUserAnswer();

    if (!readOnly) {
      if (component.get('userAnswer')) {
        component.notify(true);
      }
      this.$('li.answer').on('click', function() {
        const $this = $(this);
        const answerId = $this.data('id');

        var selected = component.get('selectedAnswers');
        const answer = selected.findBy('value', answerId);

        $this.toggleClass('selected');

        if (!answer) {
          selected.push({ value: answerId });
        } else {
          var idx = selected.indexOf(answer);
          selected.splice(idx, 1);
        }

        component.notify(false);
      });
    }
  }),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @typedef answers
   * @property {String} value - answer value
   * @property {String} content - markup string containing the answer text
   */
  answers: Ember.computed.map('question.answers', function(answer) {
    return {
      value: answer.get('value'),
      text: answer.get('text')
    };
  }),

  /**
   * @property {String} instructions - Question instructions
   */
  instructions: Ember.computed(function() {
    return this.get('i18n').t('qz-hs-text.instructions');
  }),

  /**
   * @property {Array} selectedAnswers - Array of ids for each one of the answers selected by the user
   */
  selectedAnswers: Ember.A([]),

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Notifies answer events
   * @param {boolean} onLoad if this was called when loading the component
   */
  notify: function(onLoad) {
    const component = this;
    const selected = component.get('selectedAnswers');
    const cleared = !selected.length;

    component.notifyAnswerChanged(selected);
    if (cleared) {
      component.notifyAnswerCleared(selected);
    } else {
      if (onLoad) {
        component.notifyAnswerLoaded(selected);
      } else {
        component.notifyAnswerCompleted(selected);
      }
    }
  },

  /**
   * Set answers
   */
  setAnswers: function() {
    const userAnswer = this.get('userAnswer');
    this.set('selectedAnswers', userAnswer || []);
  },

  /**
   * Set the user answer
   */
  setUserAnswer: function() {
    if (this.get('hasUserAnswer')) {
      const userAnswer = this.get('userAnswer');
      userAnswer.forEach(function(answer) {
        const selector = `li.answer[data-id='${answer.value}']`;
        const $answer = Ember.$(selector);
        $answer.toggleClass('selected');
      });
    }
  }
});
