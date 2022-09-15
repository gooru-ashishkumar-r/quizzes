import Ember from 'ember';
import GruImagePicker from 'quizzes-addon/components/gru-image-picker';

/**
 * Image picker for content authoring
 *
 * Component responsible for letting the user select/preview an image using a
 * system file browser dialog. Used in the creation/edition of courses,
 * collections and assessments.
 *
 * @module
 * @augments components/gru-image-picker.js
 */
export default GruImagePicker.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'gru-image'],

  classNameBindings: [
    'isEditing:is-editing:is-viewing',
    'srcImage:has-src-image',
    'editImage:has-edit-image',
    'hasErrors:picker-error'
  ],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * @function actions:resetImage
     */
    resetImage: function() {
      this.set('editImage', null);
      this.actions.resetPicker.call(this);
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Is the course being edited or not?
   * @property {Boolean}
   */
  isEditing: null,

  /**
   * @type {string} editImage - Edited image url
   */
  editImage: Ember.computed.alias('image'),

  /**
   * @type {boolean} hasErrors - if the picker has any errors
   */
  hasErrors: Ember.computed.notEmpty('filePickerErrors'),

  /**
   * @type {string} srcImage - Initial image url
   */
  srcImage: null,

  // -------------------------------------------------------------------------
  // Observers

  resetOnSave: function() {
    if (!this.get('isEditing')) {
      // Clear any previous errors
      this.get('filePickerErrors').clear();
      this.actions.resetPicker.call(this);
    }
  }.observes('isEditing')
});
