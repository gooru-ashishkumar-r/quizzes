import QuestionComponent from 'quizzes-addon/components/player/questions/qz-question';
import Ember from 'ember';

/**
 * SERP classic
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
  classNames: ['serp-classic'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  didInsertElement() {
    this._super(...arguments);
    const question = this.get('question');
    let baseAnswers = question.baseAnswers;
    let answersObj = [];
    baseAnswers.forEach(item => {
      if (item.correct_answer && item.correct_answer.length) {
        answersObj.push({
          answer_text: item.correct_answer[0],
          text_image: item.text_image || null,
          additional_letters: item.additional_letters
            ? item.additional_letters.map(letter => letter.text)
            : []
        });
      }
    });
    this.injectDecoding(answersObj);
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
    const component = this;
    var user = {
      userId: this.get('userId')
    };
    let accessibilitySettings = JSON.parse(
      window.localStorage.getItem('accessibility_settings')
    );
    let userAnswer = this.get('userAnswer');
    var content = {
      contentId: this.get('question.id'),
      contentTitle: this.get('question.title'),
      answers: baseAnswers,
      isHighContrast:
        accessibilitySettings && accessibilitySettings.is_high_contrast_enabled
          ? accessibilitySettings.is_high_contrast_enabled
          : false,
      userAnswer: userAnswer
    };
    window.serp
      .languageDecode()
      .select('#serp-classic-player-container')
      .dataIn(user, null, content)
      .classic()
      .render()
      .listener(function(eventData) {
        let userAnswers = [];
        if (eventData.userAnswers.length) {
          eventData.userAnswers.forEach(item => {
            userAnswers.push({
              value: `[${item}]`
            });
          });
          component.notifyAnswerCompleted(userAnswers);
        }
      });
  }
});
