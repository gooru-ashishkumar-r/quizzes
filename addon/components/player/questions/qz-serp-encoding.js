import QuestionComponent from 'quizzes-addon/components/player/questions/qz-question';
import Ember from 'ember';

/**
 * SERP encoding question
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
  classNames: ['serp-encoding'],

  // -----------------------------------------------------------------------
  // Properties

  userAnswer: [],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  didInsertElement() {
    this._super(...arguments);
    const question = this.get('question');
    question.baseAnswers.map(baseAnswer => {
      baseAnswer.audio_file_url = baseAnswer.answer_audio_filename;
    });
    this.injectEncoding(question.baseAnswers);
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

  injectEncoding(baseAnswers) {
    const component = this;
    let userAnswer = component.get('userAnswer')
      ? component.get('userAnswer')
      : [];
    var user = {
      userId: this.get('userId')
    };
    let accessibilitySettings = JSON.parse(
      window.localStorage.getItem('accessibility_settings')
    );
    var content = {
      contentId: this.get('question.id'),
      contentTitle: this.get('question.title'),
      answers: baseAnswers,
      userAnswer,
      isHighContrast:
        accessibilitySettings && accessibilitySettings.is_high_contrast_enabled
          ? accessibilitySettings.is_high_contrast_enabled
          : false
    };
    window.serp
      .languageDecode()
      .select('#serp-encoding-answer-container')
      .dataIn(user, null, content)
      .encoding()
      .render()
      .listener(eventData =>
        this.callbackFn(eventData, component, baseAnswers)
      );
  },

  callbackFn(eventData, component = this, baseAnswers) {
    const answers = eventData.answers.map(answer => {
      return {
        value: answer.answerText
      };
    });

    if (baseAnswers.length === answers.length) {
      component.notifyAnswerCompleted(answers);
    }
  }
});
