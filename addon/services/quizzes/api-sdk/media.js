import Ember from 'ember';
import { ENTITY_TYPE } from 'quizzes-addon/config/quizzes-config';
import MediaAdapter from 'quizzes-addon/adapters/media/media';

export default Ember.Service.extend({
  init: function() {
    this._super(...arguments);
    this.set(
      'mediaAdapter',
      MediaAdapter.create(Ember.getOwner(this).ownerInjection())
    );
  },

  session: Ember.inject.service('session'),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {mediaAdapter} adapter
   */
  mediaAdapter: null,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Uploads a file to the content cdn
   *
   * @param fileData object with the data
   * @returns {Promise}
   */
  uploadContentFile: function(fileData, isAudio = false) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('mediaAdapter')
        .uploadFile(fileData, ENTITY_TYPE.CONTENT, isAudio)
        .then(
          function(response) {
            resolve(service.get('session.cdnUrls.content') + response.filename);
          },
          function(error) {
            reject(error);
          }
        );
    });
  },

  /**
   * Help to split words per minutes from the audio
   */
  wordsPerMinuteTextUpdate(params) {
    const service = this;
    return new Ember.RSVP.Promise(resolve => {
      service
        .get('mediaAdapter')
        .wordsPerMinuteTextUpdate(params)
        .then(
          text => {
            return resolve(text);
          },
          () => {
            return resolve({
              audioText: '',
              audioTime: 0,
              avgWordCount: 0,
              fullAudioText: ''
            });
          }
        );
    });
  }
});
