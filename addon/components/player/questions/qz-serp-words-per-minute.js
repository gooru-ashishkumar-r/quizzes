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
   * @type {CollectionService} mediaService
   * @property {Ember.Service} Service to work with media
   */
  mediaService: Ember.inject.service('quizzes/api-sdk/media'),

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['serp-words-per-minute'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  didInsertElement() {
    this._super(...arguments);
    const question = this.get('question');
    this.injectDecoding(question.baseAnswers);
    let timer = setInterval(() => {
      $('#wpm-timer-clk').text(this.$('.record-actions .timer-count').text());
    }, 1000);
    this.set('intervalTimer', timer);
  },

  init: function() {
    this._super(...arguments);
  },

  didDestroyElement() {
    clearInterval(this.get('intervalTimer'));
  },

  // -------------------------------------------------------------------------
  // Properties

  userId: Ember.computed.alias('session.userId'),

  isAudioUploaded: false,

  intervalTimer: null,

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
      userAnswered = userAnswerList.map(item => {
        let data = JSON.parse(item.value);
        data.audio = {
          url: data.value
        };
        return data;
      });
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
      .select('#serp-words-per-minute-container')
      .dataIn(user, null, content)
      .wordsPerMinute()
      .render()
      .listener(function(eventData) {
        component.handleDecodingSubmission(eventData);
      });
  },

  handleDecodingSubmission(eventData) {
    const component = this;
    component.set('isAudioUploaded', false);
    let decodingAns = $('.panel-body .decoding-answers');
    decodingAns.find('.loader-icons').show();
    const answers = [];
    const audioPromises = eventData.decoding_answers.map(answer => {
      return new Promise(resolve => {
        return component.uploadAudio(answer.audio.blob).then(fileUrl => {
          if (fileUrl) {
            setTimeout(() => {
              let answerData = {
                value: fileUrl,
                selectedText: answer.audio.selectedText,
                speechText: {
                  audioText: '',
                  audioTime: 0,
                  avgWordCount: 0,
                  fullAudioText: ''
                }
              };
              answers.push({
                value: JSON.stringify(answerData)
              });
              return resolve();
            }, 1000);
          } else {
            component.set('isAudioUploaded', true);

            decodingAns.find('.audio-error').show();
            return;
          }
        });
      });
    });
    if (!component.set('isAudioUploaded')) {
      Promise.all(audioPromises).then(() => {
        if (answers && answers.length) {
          decodingAns.find('.audio-uploaded').show();
          decodingAns.find('.confirm-text').addClass('audio-saved');
          decodingAns.find('.loader-icons').hide();
          clearInterval(component.get('intervalTimer'));
          component.notifyAnswerCompleted(answers);
        }
      });
    }
  },
  uploadAudio(audioBlob) {
    return this.get('mediaService').uploadContentFile(audioBlob, true);
  }
});
