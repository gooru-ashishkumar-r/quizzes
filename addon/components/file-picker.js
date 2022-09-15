import Ember from 'ember';
import FilePicker from 'ember-cli-file-picker/components/file-picker';
import { FILE_MAX_SIZE_IN_MB } from 'quizzes-addon/config/quizzes-config';
import ConfigMixin from 'quizzes-addon/mixins/endpoint-config';

export default FilePicker.extend(ConfigMixin, {

  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:i18n
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Default handler when a file is removed
   * @type {Function}
   */
  onRemoveFile: null,

  // -------------------------------------------------------------------------
  // Methods

  /*
   * Validate the files per:
   * https://github.com/funkensturm/ember-cli-file-picker#validations
   */
  filesAreValid: function(files) {
    var file = files[0];
    var valid = true;

    // Clear any previous error messages
    this.get('errors').clear();


    //File size will be read from env config, if not default from config
    const fileMaxSize = this.getFileMaxSizeInMB() || FILE_MAX_SIZE_IN_MB;
    const fileMaxSizeInBytes = parseInt(fileMaxSize) * 1024 * 1024;
    if (file.size > fileMaxSizeInBytes) {
      const errorMessage = this.get('i18n').t('common.errors.file-max-size', {
        fileMaxSize
      }).string;
      this.get('errors').addObject(errorMessage);
      valid = false;
    }

    if (!valid) {
      // Remove the image preview and run the handler for removing the image
      this.clearPreview();
      this.get('onRemoveFile')();
    }

    return valid;
  },

  /**
   * When the file input changed (a file got selected)
   * Override original method to restore preview after selecting 'cancel' from the browser file dialog
   * @see https://github.com/funkensturm/ember-cli-file-picker/pull/18
   * @param  {Event} event The file change event
   */
  filesSelected: function(event) {
    var files = event.target.files;
    if (files.length) {
      this.handleFiles(files);
    } else {
      // The user chose to cancel the image selection from the browser file window
      // so preview will be cleared along with any error messages there might have been
      this.clearPreview();
      this.get('errors').clear();
      this.get('onRemoveFile')();
    }
  }
});
