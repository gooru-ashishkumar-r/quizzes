import Ember from 'ember';

export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Attributes

  queryParams: ['themeId'],

  /**
   * @property {string} application theme
   */
  themeId: null,

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {GruTheme} application theme
   */
  theme: null
});
