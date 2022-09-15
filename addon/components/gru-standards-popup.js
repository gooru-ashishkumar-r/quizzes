import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['gru-standards-popup'],

  classNameBindings: ['component-class'],

  /**
   * @type {?String} specific class
   */
  'component-class': null,

  /**
   * List of standards
   * @property {array}
   */
  model: []
});
