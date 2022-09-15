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

  isAudioUploaded: false,
  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['serp-decoding'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  didInsertElement() {
    this._super(...arguments);
    const question = this.get('question');
    this.injectDecoding(question.baseAnswers, this.get('userAnswer'));
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

  injectDecoding(baseAnswers, userAnswer) {
    let component = this;
    var user = {
      userId: this.get('userId')
    };
    let accessibilitySettings = JSON.parse(
      window.localStorage.getItem('accessibility_settings')
    );

    let userAnswerList = [];
    if (userAnswer) {
      userAnswer.map(userAnswers => {
        let dataList = {
          audio: {
            url: userAnswers.value
          }
        };
        userAnswerList.pushObject(dataList);
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
      userAnswer: userAnswerList
    };
    window.serp
      .languageDecode()
      .select('#serp-decoding-answer-container')
      .dataIn(user, null, content)
      .decoding()
      .render()
      .listener(function(eventData) {
        component.handleDecodingSubmission(eventData);
      });
  },

  handleDecodingSubmission(eventData) {
    const component = this;
    if (eventData.decoding_answers && eventData.decoding_answers.length) {
      $('.panel-body .serp-decoding')
        .find('.loader-icons')
        .show();
      component.set('isAudioUploaded', false);
      const answers = [];
      const audioPromises = eventData.decoding_answers.map(answer => {
        return new Ember.RSVP.Promise(resolve => {
          component
            .get('mediaService')
            .uploadContentFile(answer.audio.blob, true)
            .then(filename => {
              if (filename) {
                answers.push({
                  value: filename,
                  text: answer.audio.text
                });
                resolve(filename);
              } else {
                component.set('isAudioUploaded', true);
                component
                  .$('.panel-body .serp-decoding')
                  .find('.audio_error')
                  .show();
                return;
              }
            });
        });
      });

      if (!component.set('isAudioUploaded')) {
        Promise.all(audioPromises).then(() => {
          var result = [];
          if (answers && answers.length) {
            eventData.decoding_answers.map(data => {
              let decodeValue = answers.findBy('text', data.audio.text);
              result.push({
                value: decodeValue.value
              });
            });
            $('.panel-body .serp-decoding')
              .find('.loader-icons')
              .hide();
            $('.panel-body .serp-decoding')
              .find('.audio-uploaded')
              .show();
            $('.panel-body .serp-decoding')
              .find('.confirm-text')
              .addClass('audio-saved');
            component.notifyAnswerCompleted(result);
          }
        });
      }
    }
  }
});
