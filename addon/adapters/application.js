import Ember from 'ember';
import ConfigMixin from 'quizzes-addon/mixins/endpoint-config';

/**
 * Adapter to support the Lookup API 3.0 integration
 *
 * @typedef {Object} LookupAdapter
 */
export default Ember.Object.extend(ConfigMixin, {
  namespace: '/config',

  /**
   * Gets custom configuration
   * @returns {Promise.<[]>}
   */
  sendAjaxRequest: function(url, options) {
    options.beforeSend = (jqXHR, settings) => {
      const url = settings.url;
      if (url.startsWith('/')) {
        if (
          url.startsWith(this.getRealTimeWebServiceUri()) ||
          url.startsWith(this.getRealTimeWebSocketUri())
        ) {
          const realTimeUrl = this.getRealTimeWebServiceUrl();
          settings.url = `${realTimeUrl}${url}`;
        }
        if (url.startsWith('/quizzes')) {
          const endpointUrl = this.getEndpointUrl();
          settings.url = `${endpointUrl}${url}`;
        } else {
          const endpointUrl = this.getEndpointProviderUrl();
          settings.url = `${endpointUrl}${url}`;
        }
      }
    };
    return Ember.$.ajax(url, options);
  }
});
