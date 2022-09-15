import Ember from 'ember';
import ResourceComponent from 'quizzes-addon/components/player/resources/qz-resource';

/**
 * Vimeo resource component
 *
 * Component responsible for controlling the logic and appearance of the vimeo resource type
 *
 * @module
 * @see controllers/player.js
 * @see components/player/qz-viewer.js
 * @augments Ember/Component
 **/
export default ResourceComponent.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-vimeo-resource'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  aspectRatio: {
    width: 16,
    height: 9
  },

  /**
   * @property {string} full resource vimeo url
   */
  vimeoUrl: Ember.computed('resource.body', function() {
    const component = this;
    const Env = Ember.getOwner(this).resolveRegistration('config:environment');
    var vimeoPlayerUrl = Env.player.vimeoPlayerUrl;

    return vimeoPlayerUrl + component.getVimeoID(this.get('resource.body'));
  }),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Get Video ID from a URL
   * @param {string} text
   * @returns {{id: number}} id
   */
  getVimeoID: function(text) {
    const regex = /([^/.]+)$/gm;

    var match = regex.exec(text);
    var id = '';
    if (match !== null) {
      id = match[0];
    }
    return id;
  }
});
