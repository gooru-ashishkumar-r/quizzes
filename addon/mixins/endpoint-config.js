import Ember from 'ember';

export default Ember.Mixin.create({
  quizzesConfigurationService: Ember.inject.service('quizzes/configuration'),

  getEndpointUrl: function() {
    const configuration = this.get('quizzesConfigurationService.configuration');
    return configuration.get('endpoint.url');
  },

  getEndpointProviderUrl: function() {
    const configuration = this.get('quizzesConfigurationService.configuration');
    return configuration.get('endpoint.providerUrl');
  },

  getEndpointSecureUrl() {
    const configuration = this.get('quizzesConfigurationService.configuration');
    return configuration.get('endpoint.secureUrl');
  },

  getRealTimeWebServiceUrl: function() {
    const configuration = this.get('quizzesConfigurationService.configuration');
    return configuration.get('realTime.webServiceUrl');
  },

  getRealTimeWebServiceUri: function() {
    const configuration = this.get('quizzesConfigurationService.configuration');
    return configuration.get('realTime.webServiceUri');
  },

  getRealTimeWebSocketUrl: function() {
    const configuration = this.get('quizzesConfigurationService.configuration');
    return `${configuration.get(
      'realTime.webSocketUrl'
    )}${this.getRealTimeWebSocketUri()}`;
  },

  getRealTimeWebSocketUri: function() {
    const configuration = this.get('quizzesConfigurationService.configuration');
    return configuration.get('realTime.webSocketUri');
  },

  getFileMaxSizeInMB: function() {
    const configuration = this.get('quizzesConfigurationService.configuration');
    return configuration.get('FILE_UPLOAD.MAX_SIZE_IN_MB');
  }
});
