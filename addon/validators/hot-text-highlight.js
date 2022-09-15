import BaseValidator from 'ember-cp-validations/validators/base';
import Ember from 'ember';

export default BaseValidator.extend({
  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  /**
   * Performs the string validation
   * @param {String} value The string to validate
   * @param {Object} options Validation options
   * @param {Object} model Answer model
   * @returns {Boolean|String} Validity of answer or error message
   */
  validate(value, options, model) {
    const validator = this;
    const highlightType = model.get('highlightType');
    if (highlightType) {
      const containsOpeningBracket = value.indexOf('[') >= 0;
      const containsEndingBracket = value.indexOf(']') >= 0;
      if (!containsOpeningBracket && !containsEndingBracket) {
        return validator.get('i18n').t(options.answerNotSelectedKey).string;
      } else {
        if (!validator.bracketsAreBalanced(value)) {
          return validator.get('i18n').t(options.wrongFormatKey).string;
        } else {
          if (!validator.validateSelections(value, highlightType)) {
            return validator.get('i18n').t(options.wrongFormatKey).string;
          }
        }
      }
    }
    return true;
  },

  /**
   * Checks that the brackets in the string are properly opened and closed
   * @returns {Boolean} String is bracket balanced
   */
  bracketsAreBalanced(string) {
    var count = 0,
      temp;
    for (var i = 0; i < string.length; i++) {
      temp = string[i];
      if (temp === '[') {
        count += 1;
      }
      if (temp === ']') {
        count -= 1;
        if (count < 0) {
          return false;
        }
      }
    }
    return count === 0;
  },

  /**
   * Validates that words or sentences are properly set in the text
   * @param {String} string The text to validate
   * @param {String} type The type of selection: word or sentence
   * @returns {Boolean} Validity of the answers
   */
  validateSelections(string, type) {
    var isValid = true;
    const regExp = /\[(.*?)]/gi;
    const matchedAnswers = string.match(regExp);
    for (var i = 0; i < matchedAnswers.length; i++) {
      const selection = matchedAnswers[i]
        .substring(1, matchedAnswers[i].length - 1)
        .trim();
      if (selection === '') {
        return false;
      }
      if (type === 'word') {
        if (selection.match(/(\.|\s)/)) {
          return false;
        }
      } else {
        if (selection.indexOf(' ') === -1 || selection.indexOf('.') === -1) {
          return false;
        }
      }
    }
    return isValid;
  }
});
