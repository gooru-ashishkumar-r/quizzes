import Ember from 'ember';
import ConfigurationAdapter from 'quizzes-addon/adapters/configuration';
import DevelopmentConfiguration from 'quizzes-addon/config/env/development';
import TestConfiguration from 'quizzes-addon/config/env/test';
import ProductionConfiguration from 'quizzes-addon/config/env/production';

const ConfigurationService = Ember.Service.extend({
  configurationAdapter: null,

  configuration: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'configurationAdapter',
      ConfigurationAdapter.create(Ember.getOwner(this).ownerInjection())
    );
  },

  loadConfiguration: function() {
    const service = this;
    const environment = Ember.getOwner(this).resolveRegistration(
      'config:environment'
    ).environment;
    const isProduction = environment === 'production';
    const isDevelopment = environment === 'development';
    const envConfiguration = isProduction
      ? ProductionConfiguration
      : isDevelopment
        ? DevelopmentConfiguration
        : TestConfiguration;

    const configuration = Ember.Object.create(envConfiguration);
    configuration.set('properties', {});

    service.set('configuration', configuration);

    //setting the configuration to the global variable
    ConfigurationService.configuration = configuration;

    return Ember.RSVP.resolve(configuration);
  },

  mergeConfiguration: function(configuration) {
    this.get('configuration').setProperties(configuration);
  },

  addProperties: function(properties) {
    this.set('configuration.properties', properties);
  },

  /**
   * Sets the token property
   * @param {string} token
   */
  setToken: function(token) {
    const service = this;
    service.set('configuration.properties.token', token);
  },

  /**
   * Sets the cdn url
   * @param {string} url
   */
  setCdnUrl: function(url) {
    const service = this;
    service.set('configuration.properties.cdnURL', url);
  }
});

ConfigurationService.reopenClass({
  /**
   * Application configuration properties
   */
  configuration: null
});

export default ConfigurationService;
