import Ember from 'ember';

/**
 * Notify
 *
 * Component used to notify when questions answers have been loaded
 * (@see gru-collection-list-item.hbs)
 *
 * @module
 * @augments ember/Component
 */

export default Ember.Component.extend({
  tagName: 'span',

  onLoad: null,

  // -------------------------------------------------------------------------
  // Events

  didInsertElement: function() {
    this.sendAction('onLoad');
  }
});
