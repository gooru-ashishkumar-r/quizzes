import Ember from 'ember';

/**
 * Image picker
 *
 * Component responsible for letting the user select/preview an image using a
 * system file browser dialog. Only certain file types are allowed
 * (@see gru-image-picker.hbs); otherwise an error is presented to the user.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-image-picker'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * @function actions:enableButtons
     */
    prepareForSubmission(file) {
      this.set('isFileInputEmpty', false);
      this.set('image', file);
    },

    /**
     * @function actions:disableButtons
     */
    disableButtons() {
      this.set('isFileInputEmpty', true);
    },

    /**
     * @function actions:resetPicker
     */
    resetPicker() {
      // Reset the input element in the file picker
      // http://stackoverflow.com/questions/1043957/clearing-input-type-file-using-jquery/13351234#13351234
      var $fileInput = this.$('input[type="file"]');
      $fileInput.wrap('<form>').closest('form').get(0).reset();
      $fileInput.unwrap();

      // Prompt the file picker to reset the image preview
      this.set('isFileInputEmpty', true);
    },

    submitImage() {
      // TODO: Save the image by calling an endpoint
      Ember.Logger.log('Submit image: ', this.get('image'));
    }
  },

  init: function() {
    this._super(...arguments);
    this.set('filePickerErrors', Ember.A());
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Image for submission
   * @prop {Object}
   */
  image: null,

  /**
   * Has a file been selected and loaded into the file picker?
   * @prop {Bool}
   */
  isFileLoaded: Ember.computed.not('isFileInputEmpty'),

  /**
   * Has the file picker's input field been reset?
   * @prop {Bool}
   */
  isFileInputEmpty: true,

  /**
   * List of error messages to present to the user for conditions that the loaded image does not meet
   * @prop {String[]}
   */
  filePickerErrors: null
});
