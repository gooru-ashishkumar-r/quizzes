import BaseValidator from 'ember-cp-validations/validators/base';
import Ember from 'ember';

export default BaseValidator.extend({
  i18n: Ember.inject.service(),
  validate(value, options) {
    if (value !== null) {
      if (
        value.match(
          '^(https?://)?(([\\w!~*\'().&=+$%-]+: )?[\\w!~*\'().&=+$%-]+@)?(([0-9]{1,3}\\.){3}[0-9]{1,3}|([\\w!~*\'()-]+\\.)*([\\w^-][\\w-]{0,61})?[\\w]\\.[a-z]{2,6})(:[0-9]{1,4})?((/*)|(/+[\\w!~*\'().;?:@&=+$,%#-]+)+/*)$'
        )
      ) {
        return value.indexOf(options.location) !== -1
          ? this.get('i18n').t('common.errors.resource-same-host-url').string
          : true;
      }
      return this.get('i18n').t('common.errors.resource-invalid-url').string;
    }
    return true;
  }
});
