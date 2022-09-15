import Ember from 'ember';
import QuestionComponent from 'quizzes-addon/components/player/questions/qz-question';
import { FIB_REGEX } from 'quizzes-addon/config/quizzes-config';

/**
 * Fill in the blank
 *
 * Component responsible for controlling the logic and appearance of a fill in the blank
 * question inside of the {@link player/qz-question-viewer.js}
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
  classNames: ['qz-scientific-fill-in-the-blank'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events
  initInputEvents: function() {
    const component = this;
    component.$('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    });
    component.setAnswersEvents();
  }.on('didInsertElement'),

  // -------------------------------------------------------------------------
  // Properties
  /**
   * Replace '[]' to an input, but not []{
   * @param question.body
   */
  answers: Ember.computed('question', function() {
    const component = this;
    let answers = component.get('question.answerDetails');
    let hints = component.get('question.hint');
    const readOnly = component.get('readOnly');
    const disabled = readOnly ? 'disabled' : '';

    // matches [] but not []{, which indicates a malformed sqrt
    let answerData = Ember.A([]);
    answers.map(choice => {
      const input = `<input type='text' value='' data=${choice.answer_category} ${disabled}/>`;
      let answerText = choice.answer_text.replace(
        new RegExp(FIB_REGEX.source, 'g'),
        input
      );
      let hint = hints[`${choice.answer_category}_explanation`];
      let answerObj = Ember.Object.create({
        answer_category: choice.answer_category,
        answer_text: answerText,
        hint: hint
      });
      answerData.pushObject(answerObj);
    });
    return answerData;
  }),
  // -------------------------------------------------------------------------
  // Methods
  /**
   * Notify input answers
   * @param {boolean} onLoad if this was called when loading the component
   */
  notifyInputAnswers: function(onLoad) {
    const component = this,
      inputs = component.$('.fib-answers input[type=text]'),
      answers = inputs
        .map(function(index, input) {
          const answer = Ember.$(input).val();
          const category = Ember.$(input).attr('data');
          return { value: `${Ember.$.trim(category)}:${Ember.$.trim(answer)}` };
        })
        .toArray();

    const answerCompleted = answers.join('').length > 0; //to check that at least 1 answer has text
    component.notifyAnswerChanged(answers);
    if (answerCompleted) {
      if (onLoad) {
        component.notifyAnswerLoaded(answers);
      } else {
        component.notifyAnswerCompleted(answers);
      }
    } else {
      component.notifyAnswerCleared(answers);
    }
  },

  /**
   * Set answers
   */
  setAnswersEvents: function() {
    const component = this;
    const inputs = component.$('.fib-answers');
    if (component.get('hasUserAnswer')) {
      component.notifyInputAnswers(true);
    }
    inputs.off('focusout');
    inputs.on('keyup', 'input[type=text]', function() {
      if (!component.get('isComprehension')) {
        component.notifyInputAnswers(false);
      }
    });
    if (component.get('isComprehension')) {
      inputs.on('focusout', 'input[type=text]', function() {
        component.notifyInputAnswers(false);
      });
    }
  },
  toggleAction(item) {
    let flag = item.get('ishintShow');
    item.set('ishintShow', !flag);
  }
});
