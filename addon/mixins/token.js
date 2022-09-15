import Ember from 'ember';

export default Ember.Mixin.create({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {ConfigurationService} configurationService
   * @property {Ember.Service} Service to retrieve configuration
   */
  quizzesConfigurationService: Ember.inject.service('quizzes/configuration'),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Object} headers Token header for API calls
   */
  headers: Ember.computed('token', function() {
    return {
      Authorization: `Token ${this.get('token')}`
    };
  }),

  /**
   * @property {String} token access token used for authorization on ajax requests
   */
  token: Ember.computed.alias(
    'quizzesConfigurationService.configuration.properties.token'
  )
});
