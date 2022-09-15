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
  classNames: ['serp-phrase-reading'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  didInsertElement() {
    this._super(...arguments);
    const question = this.get('question');
    this.injectDecoding(question.baseAnswers);
  },

  init: function() {
    this._super(...arguments);
  },

  // -------------------------------------------------------------------------
  // Properties

  userId: Ember.computed.alias('session.userId'),

  isAudioUploaded: false,

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods

  injectDecoding(baseAnswers) {
    const component = this;
    var user = {
      userId: this.get('userId')
    };
    var content = {
      contentId: this.get('question.id'),
      contentTitle: this.get('question.title'),
      answers: baseAnswers,
      isPhraseCued: true
    };
    window.serp
      .languageDecode()
      .select('#serp-phrase-container')
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
            answers.push({ value: fileUrl });
            return resolve();
          } else {
            component.set('isAudioUploaded', true);
            decodingAns.find('.audio-error').show();
            return;
          }
        });
      });
    });

    Promise.all(audioPromises).then(() => {
      if (answers && answers.length) {
        if (answers && answers.length) {
          decodingAns.find('.audio-uploaded').show();
          decodingAns.find('.confirm-text').addClass('audio-saved');
          decodingAns.find('.loader-icons').hide();
          component.notifyAnswerCompleted(answers);
        }
      }
    });
  },

  uploadAudio(audioBlob) {
    return this.get('mediaService').uploadContentFile(audioBlob, true);
  }
});
