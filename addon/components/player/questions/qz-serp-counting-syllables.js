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

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['serp-counting-syllables'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  didInsertElement() {
    this._super(...arguments);
    const question = this.get('question');
    const decodingExcercies =
      question.baseAnswers &&
      question.baseAnswers.map(baseAnswer => {
        return {
          answer_text: baseAnswer.answer_text,
          correct_answer: baseAnswer.correct_answer.map(item =>
            JSON.parse(item)
          )
        };
      });
    this.injectDecoding(decodingExcercies);
  },

  init: function() {
    this._super(...arguments);
  },

  // -------------------------------------------------------------------------
  // Properties

  userId: Ember.computed.alias('session.userId'),

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods

  injectDecoding(baseAnswers) {
    let component = this,
      userAnswered;
    var user = {
      userId: this.get('userId')
    };
    let accessibilitySettings = JSON.parse(
      window.localStorage.getItem('accessibility_settings')
    );
    let userAnswerList = component.get('userAnswer');
    if (userAnswerList && userAnswerList.length) {
      userAnswered = userAnswerList.map(item => JSON.parse(item.value));
    }

    var content = {
      contentId: this.get('question.id'),
      contentTitle: this.get('question.title'),
      answers: baseAnswers,
      isHighContrast:
        accessibilitySettings && accessibilitySettings.is_high_contrast_enabled
          ? accessibilitySettings.is_high_contrast_enabled
          : false,
      userAnswer: userAnswered
    };
    window.serp
      .languageDecode()
      .select('#qz-counting-syllables-container')
      .dataIn(user, null, content)
      .countingSyllables()
      .render()
      .listener(function(eventData) {
        let userAnswers = [];
        const question = component.get('question');
        let eventUsers = eventData.userAnswers.filter(item => item);
        if (question.baseAnswers.length === eventUsers.length) {
          eventData.userAnswers.forEach(item => {
            userAnswers.push({
              value: JSON.stringify(item)
            });
          });
          component.notifyAnswerCompleted(userAnswers);
        }
      });
  }
});
