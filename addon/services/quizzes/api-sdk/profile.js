import Ember from 'ember';
import ProfileSerializer from 'quizzes-addon/serializers/profile/profile';
import ProfileAdapter from 'quizzes-addon/adapters/profile/profile';
import { arrayIntoChunks } from 'quizzes-addon/utils/utils';

export default Ember.Service.extend({
  init: function() {
    this._super(...arguments);
    this.set(
      'profileAdapter',
      ProfileAdapter.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'profileSerializer',
      ProfileSerializer.create(Ember.getOwner(this).ownerInjection())
    );
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {ProfileAdapter} adapter
   */
  profileAdapter: null,

  /**
   * @property {ProfileSerializer} serializer
   */
  profileSerializer: null,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Reads a profile by id
   * @param {String[]} profileIds
   * @param {Number} chunkSize number of profiles to read at once
   * @returns {Promise}
   */
  readProfiles: function(profileIds, chunkSize = 50) {
    const service = this;
    // the profiles endpoint only accepts 50 ids at the same time
    const chunks = arrayIntoChunks(profileIds, chunkSize).map(ids =>
      service
        .get('profileAdapter')
        .readProfiles(ids)
        .then(response =>
          service.get('profileSerializer').normalizeProfiles(response)
        )
    );
    return new Ember.RSVP.Promise((resolve, reject) =>
      Ember.RSVP
        .all(chunks)
        .then(responses => Object.assign({}, ...responses))
        .then(resolve, reject)
    );
  },

  /**
   * Gets the user Profile information of a given user id
   *
   * @returns {Promise}
   */
  readUserProfile: function(profileId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.readProfiles([profileId]).then(function(profiles) {
        resolve(profiles[profileId]);
      }, reject);
    });
  }
});
