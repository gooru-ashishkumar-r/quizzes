/* global toastr */
import Ember from 'ember';

const { Service, on } = Ember;

const defaultOptions = {
  closeButton: false,
  debug: false,
  newestOnTop: true,
  progressBar: false,
  positionClass: 'toast-top-full-width',
  preventDuplicates: false,
  onclick: null,
  showDuration: 300,
  hideDuration: 1000,
  timeOut: 3000,
  extendedTimeOut: 1000,
  showEasing: 'swing',
  hideEasing: 'linear',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut'
};

/*
 * Wrapper for the toastr library: https://github.com/CodeSeven/toastr
 */
export default Service.extend({
  initToaster: on('init', function() {
    toastr.options = defaultOptions;
  }),

  /**
   * Clear all notifications using animation
   *
   * @function
   * @return {undefined}
   */
  clear() {
    toastr.clear();
  },

  /**
   * Remove all notifications without animation
   *
   * @function
   * @return {undefined}
   */
  remove() {
    toastr.remove();
  },

  /**
   * Post a success notification
   *
   * @function
   * @param message - Body of the notification
   * @param title - Title of the notification
   * @return {undefined}
   */
  success(message, title) {
    toastr.success(message, title);
    this.restoreOptions();
  },

  /**
   * Post a notification for information purposes
   *
   * @function
   * @param message - Body of the notification
   * @param title - Title of the notification
   * @return {undefined}
   */
  info(message, title) {
    toastr.info(message, title);
    this.restoreOptions();
  },

  /**
   * Post a notification for warning purposes
   *
   * @function
   * @param message - Body of the notification
   * @param title - Title of the notification
   * @return {undefined}
   */
  warning(message, title) {
    toastr.warning(message, title);
    this.restoreOptions();
  },

  /**
   * Post an error notification
   *
   * @function
   * @param message - Body of the notification
   * @param title - Title of the notification
   * @return {undefined}
   */
  error(message, title) {
    toastr.error(message, title);
    this.restoreOptions();
  },

  setOptions(options) {
    toastr.options = options;
  },

  restoreOptions() {
    toastr.options = defaultOptions;
  }
});
