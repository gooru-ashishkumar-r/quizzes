import BaseValidator from 'ember-cp-validations/validators/base';
import Ember from 'ember';

export default BaseValidator.extend({
  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  /**
   * Validates string by removing all html tags
   * @param {String} value The string to validate
   * @param {Object} options Validation options with messageKey for i18n
   * @returns {Boolean|String} Validity of answer or error message
   */
  validate(value, options) {
    const validator = this;
    const cleanValue = Ember.$('<div>').html(value).text().trim();
    return cleanValue
      ? true
      : validator.get('i18n').t(options.messageKey).string;
  }
});
