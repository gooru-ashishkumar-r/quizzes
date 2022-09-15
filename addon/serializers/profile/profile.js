import Ember from 'ember';
import Profile from 'quizzes-addon/models/profile/profile';
import { DEFAULT_IMAGES } from 'quizzes-addon/config/quizzes-config';

export default Ember.Object.extend({
  /**
   * @property {Ember.Service} Service to session
   */
  session: Ember.inject.service('session'),

  /**
   * @property {Ember.Service} Service to configuration properties
   */
  configurationService: Ember.inject.service('configuration'),

  /**
   * Normalizes a list of profiles
   * @param {Object[]} payload
   * @returns {Profile[]}
   */
  normalizeProfiles: function(profiles) {
    const serializer = this;
    return profiles.users.reduce((profilesById, profile) => {
      profilesById[profile.id] = serializer.normalizeProfile(profile);
      return profilesById;
    }, {});
  },

  /**
   * Normalize a profile
   * @param {Object} payload
   * @returns {Profile}
   */
  normalizeProfile: function(profile) {
    const serializer = this;
    const basePath = serializer.get('session.cdnUrls.user');
    const appRootPath = serializer.get(
      'configurationService.configuration.appRootPath'
    ); //configuration appRootPath
    const thumbnailUrl = profile.thumbnail
      ? basePath + profile.thumbnail
      : appRootPath + DEFAULT_IMAGES.USER_PROFILE;

    return Profile.create({
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      username: profile.username,
      avatarUrl: thumbnailUrl,
      studentId: profile.roster_global_userid
    });
  }
});
