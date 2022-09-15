import Ember from 'ember';

/**
 * Depth of Knowledge component
 *
 * Component responsible for show the  Depth of Knowledge
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @property {Ember.Service} Service to do retrieve depth of knowledge
   */
  lookupService: Ember.inject.service('quizzes/lookup'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'qz-depth-of-knowledge'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events
  init: function() {
    var component = this;
    component._super(...arguments);

    component
      .get('lookupService')
      .readDepthOfKnowledgeItems()
      .then(function(knowledge) {
        component.set('knowledge', knowledge);
        component.set(
          'editKnowledge',
          component.getOptionsArray(
            knowledge,
            component.get('srcSelectedKnowledge')
          )
        );
      });
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @type {Ember.A}
   */
  editKnowledge: null,

  /**
   * @type {Ember.A} editSelectedKnowledge - Editable list of knowledge selected for the assessment
   */
  editSelectedKnowledge: null,

  /**
   * Is the assessment being edited or not?
   * @property {Boolean}
   */
  isEditing: null,

  /**
   * @type {Ember.A}
   */
  srcKnowledge: Ember.computed('srcSelectedKnowledge', 'knowledge', function() {
    return this.getOptionsArray(
      this.get('knowledge'),
      this.get('srcSelectedKnowledge')
    );
  }),

  /**
   * @type {Ember.A} srcSelectedKnowledge - Initial list of knowledge selected for the assessment
   */
  srcSelectedKnowledge: null,

  /**
   * @type {Ember.A} knowledge - List of knowledge for the assessment
   */
  knowledge: Ember.A(),

  // -------------------------------------------------------------------------
  // Observers

  /**
   * Observes if the selection has changed
   */
  updateSelectedKnowledge: Ember.observer(
    'editKnowledge.@each.checked',
    function() {
      var selectedKnowledge = this.get('editKnowledge')
        .filterBy('checked')
        .map(function(knowledge) {
          return knowledge.get('checked') === true ? knowledge.get('id') : null;
        });
      this.set('editSelectedKnowledge', selectedKnowledge);
    }
  ),

  resetSelectedKnowledge: Ember.observer('isEditing', function() {
    if (this.get('isEditing')) {
      this.set(
        'editKnowledge',
        this.getOptionsArray(
          this.get('knowledge'),
          this.get('srcSelectedKnowledge')
        )
      );
    }
  }),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Create a copy of an array of value-label objects and add an additional property
   * 'checked' to each one, where its value will depend on whether the object value is
   * present or not in the 'selectedOptions' array (list of values)
   * @param {Object[]} allOptions - Array of objects
   * @param {Number[]} selectedOptions - Array of values
   */
  getOptionsArray: function(allOptions, selectedOptions) {
    return allOptions.slice(0).map(function(object) {
      object.checked =
        selectedOptions && selectedOptions.indexOf(object.id) > -1;
      return Ember.Object.create(object);
    });
  }
});
