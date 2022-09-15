import BaseValidator from 'ember-cp-validations/validators/base';
import Ember from 'ember';

export default BaseValidator.extend({
  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  /**
   * Validate the value be greater than a specific model property
   */
  validate(value, options, model) {
    return (
      value > model.get(options.property) ||
      this.get('i18n').t('common.errors.due-date-error').string
    );
  }
});
