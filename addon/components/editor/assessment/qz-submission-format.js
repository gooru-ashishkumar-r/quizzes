import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['qz-submission-format'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Selected format type
     */
    selectType: function(type) {
      this.set('selectedType', type);
    }
  },
  // -------------------------------------------------------------------------
  // Properties

  /**
   * @type {String} selectedType
   */
  selectedType: null,

  /**
   * @type {Array[]} questionTypes
   */
  submissionFormats: Ember.A([
    Ember.Object.create({
      format: 'textbox'
    }),
    Ember.Object.create({
      format: 'upload'
    })
  ])
});
