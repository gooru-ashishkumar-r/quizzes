import Ember from 'ember';
import GruTheme from 'quizzes-addon/utils/gru-theme';
import Env from '../config/environment';
import GooruLegacyUrl from 'quizzes-addon/utils/gooru-legacy-url';
import Error from 'quizzes-addon/models/error';

/**
 * @typedef {object} ApplicationRoute
 */
export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  i18n: Ember.inject.service(),

  /**
   * @type {ConfigurationService} Service to retrieve configuration information
   */
  configurationService: Ember.inject.service('quizzes/configuration'),

  /**
   * @requires service:notifications
   */
  notifications: Ember.inject.service('quizzes/notifications'),

  // -------------------------------------------------------------------------
  // Methods

  setupGlobalErrorHandling: Ember.on('init', function() {
    const route = this;

    // Ultimately all server and javascript errors will be caught by this handler
    Ember.onerror = function(error) {
      if (error.status !== 401) {
        const errorMessage = route.get('i18n').t('common.unexpectedError')
          .string;
        route.get('notifications').error(errorMessage);
        route.trackAppError(error);
      }
    };

    Ember.$(document).ajaxError(function(event, jqXHR, settings) {
      if (jqXHR.status !== 401) {
        route.trackEndPointError(event, jqXHR, settings);
      }
    });
  }),

  beforeModel: function() {
    const route = this;
    if (Env.embedded) {
      route.handleEmbeddedApplication();
    }
    if (Env.isTestEnv) {
      const configurationService = route.get('configurationService');
      configurationService.addProperties(Env.APP.properties);
    }
  },

  model: function(params) {
    const themeConfig = Env.themes || {};
    const themeId = params.themeId || Env.themes.default;

    var theme = null;
    if (themeId && themeConfig[themeId]) {
      theme = GruTheme.create(themeConfig[themeId]);
      theme.set('id', themeId);
    }

    return Ember.RSVP.hash({
      theme,
      translations: theme ? theme.loadTranslations() : null
    });
  },

  afterModel: function() {
    this.handleLegacyUrlIfNecessary();
  },

  setupController: function(controller, model) {
    const theme = model.theme;
    if (theme) {
      controller.set('theme', theme);
      this.setupTheme(theme, model.translations);
    }
  },

  /**
   * Setups the application theme
   * @param {GruTheme} theme
   * @param {*} translations
   */
  setupTheme: function(theme, translations) {
    this.setupThemeStyles(theme);
    this.setupThemeTranslations(theme.get('translations.locale'), translations);
  },

  /**
   * Setups theme translations
   * @param {string} locale theme locale
   * @param {{}} translations theme translations
   */
  setupThemeTranslations: function(locale, translations) {
    const i18n = this.get('i18n');
    //sets the theme locale
    i18n.set('locale', locale);

    //Add the translations
    Object.keys(translations).forEach(locale => {
      i18n.addTranslations(locale, translations[locale]);
    });
  },

  /**
   * Sets the theme styles if available
   * @param {GruTheme} theme
   */
  setupThemeStyles: function(theme) {
    //setting theme id at html tag
    Ember.$('html').attr('id', theme.get('id'));
    //adding theme styles to head tag
    const themeStylesUrl = theme.get('styles.url');
    if (themeStylesUrl) {
      Ember.$('head').append(
        `<link id="theme-style-link" rel="stylesheet" type="text/css" href="${themeStylesUrl}">`
      );
    }
  },

  /**
   * Handles a url when necessary
   */
  handleLegacyUrlIfNecessary: function() {
    const route = this;
    const legacyUrl = GooruLegacyUrl.create({
      url: route.get('router.url')
    });
    if (legacyUrl.get('isLegacyUrl')) {
      //checking for a legacy legacyUrl
      const routeParams = legacyUrl.get('routeParams');
      if (routeParams) {
        route.transitionTo.apply(route, routeParams);
      }
    }
  },

  /**
   * Tracks end point errors
   * @param event
   * @param jqXHR
   * @param settings
     */
  trackEndPointError: function(event, jqXHR, settings) {
    const route = this;
    const targetElement =
      event.currentTarget && event.currentTarget.activeElement
        ? event.currentTarget.activeElement
        : false;
    const model = Error.create({
      type: 'url',
      timestamp: new Date().getTime(),
      details: {
        route: route.get('router.url'),
        userAgent: navigator.userAgent,
        'element-selector': targetElement ? targetElement.className : null,
        endpoint: {
          url: settings.url,
          response: jqXHR.responseText,
          status: jqXHR.status,
          headers: settings.headers,
          responseHeaders: jqXHR.getAllResponseHeaders(),
          method: settings.type,
          data: settings.data
        }
      },
      description: 'Endpoint error'
    });
    Ember.Logger.error(model);
  },

  /**
   * Tracks application/js errors
   * @param error
   */
  trackAppError: function(error) {
    const route = this;

    // do not track errors at the user-error api, this to prevent a loop
    if (
      error.responseText &&
      error.responseText.indexOf('api/nucleus-utils/v1/user-error') >= 0
    ) {
      return;
    }

    const model = Error.create({
      type: 'page',
      timestamp: new Date().getTime(),
      details: {
        route: route.get('router.url'),
        userAgent: navigator.userAgent,
        stack: error.stack
      },
      description: JSON.stringify(error)
    });

    Ember.Logger.error(model);
    Ember.Logger.error(error);
  },

  deactivate: function() {
    Ember.$(document).off('ajaxError');
  },

  /**
   * Handle the logic for the embedded application
   * @returns {Promise.<TResult>}
   */
  handleEmbeddedApplication: function() {
    const route = this;
    const transition = Env.APP.transition;
    const configurationService = route.get('configurationService');
    configurationService.addProperties(Env.APP.properties);
    const routeName = 'index';
    if (transition) {
      route.transitionTo.apply(route, transition);
    } else {
      route.transitionTo(routeName);
    }
  }
});
