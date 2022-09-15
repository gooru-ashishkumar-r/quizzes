import Ember from 'ember';
import QuestionComponent from 'quizzes-addon/components/player/questions/qz-question';

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
  classNames: ['qz-scientific-free-response'],

  isShow: false,

  // -------------------------------------------------------------------------

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
   * @param answers
   */
  answers: Ember.computed('question', function() {
    const component = this;
    let answers = JSON.parse(
      JSON.stringify(component.get('question.answerDetails'))
    );
    let hints = component.get('question.hint');

    answers.forEach(function(choice) {
      choice.hint = hints[`${choice.answer_category}_explanation`];
    });

    return answers;
  }),
  // -------------------------------------------------------------------------
  // Methods
  /**
   * Notify input answers
   * @param {boolean} onLoad if this was called when loading the component
   */
  notifyInputAnswers: function(onLoad) {
    const component = this,
      inputs = component.$('.free-response input[type=text]'),
      answers = inputs
        .map(function(index, input) {
          let answerDetails =
            component.get('answerDetails') ||
            component.get('question.answerDetails');
          const answer = Ember.$(input).val();
          const category = answerDetails[index].answer_category;
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
    const inputs = component.$('.free-response');
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
  toggleAction(isShow, category) {
    const component = this;
    component.set('category', category);
    component.set('isShow', !isShow);
  }
});
