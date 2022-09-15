import Ember from 'ember';

/**
 * This util class holds the information for a Gooru Theme.
 * Gooru themes are useful to setup the application branding, messages and locale
 *
 * @typedef {object} GruTheme
 */
export default Ember.Object.extend({
  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {string} theme id
   */
  id: null,

  /**
   * Loaded styles
   * @property {{url: string}} styles
   */
  styles: {
    url: null
  },

  /**
   * @property {{ url: string, locale: string }} path to a javascript translation file complaint with ember-i18n
   */
  translations: {
    url: null,
    locale: 'en'
  },

  // -------------------------------------------------------------------------
  // Methods
  /**
   * Returns theme translations
   *
   * {
   *   "en" : {
   *      "common" : {
   *        "search": "Search"
   *      }
   *    }
   * }
   *
   */
  loadTranslations: function() {
    const theme = this;
    const url = theme.get('translations.url');
    return url ? theme._loadTranslations(url) : Ember.A();
  },

  /**
   * Loads translations from a url
   * @param {string} url
   * @returns {Promise}
   * @private
   */
  _loadTranslations: function(url) {
    return new Ember.RSVP.Promise(function(resolve) {
      Ember.$.get(url, null, resolve);
    });
  }
});
