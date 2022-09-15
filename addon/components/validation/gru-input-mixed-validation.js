import Ember from 'ember';
import GruInput from 'quizzes-addon/components/validation/gru-input';
const { computed, defineProperty } = Ember;

/**
 * Text field with async and sync validation
 *
 * Text field with support for ember-cp-validations.
 * It provides feedback based on certain validation criteria.
 *
 * @module
 * @augments ember/Component
 * @see ember-cp-validations
 */
export default GruInput.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-input-mixed-validation', 'validation'],
  classNameBindings: [
    'showErrorClass:has-error',
    'isValid:has-success',
    'valuePath'
  ],

  /**
   * @type {?string} string of classes (separated by a space) specific to the component instance
   */
  classes: 'test',

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    inputTyping: function() {
      this._super(...arguments);
      this.set('didSubmit', false);
    }
  },

  // -------------------------------------------------------------------------
  // Events

  init() {
    this._super(...arguments);
    var valuePathHidden = `${this.get('valuePath')}Async`;
    this.set('valuePathHidden', valuePathHidden);
    defineProperty(
      this,
      'attributeValidationHidden',
      computed.oneWay(`model.validations.attrs.${valuePathHidden}`)
    );
    this.set('rawInputValueHidden', this.get(`model.${valuePathHidden}`));
    defineProperty(
      this,
      'valueHidden',
      computed.alias(`model.${valuePathHidden}`)
    );
  },
  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {string} didSubmit action
   */
  didSubmit: true,

  /**
   * @param {String} value - formatted value of the input field.
   */
  valueHidden: null,
  /**
   * @param {String} rawInputValue - unformatted value of the input field
   */
  rawInputValueHidden: null,
  /**
   * @param {String} valuePath - value used to set the rawInputValue
   */
  valuePathHidden: '',
  /**
   * @param {Object} attributeValidation - value used to set the rawInputValue
   */
  attributeValidationHidden: null,

  /**
   * @param {Computed } didValidate - value used to check if input has been validated or not
   */
  didValidateHidden: false,

  /**
   * @param {Computed } showErrorClass - computed property that defines the
   */
  showErrorClass: computed(
    'showMessage',
    'hasContent',
    'attributeValidation',
    'showMessageHidden',
    'hasContentHidden',
    'attributeValidationHidden',
    function() {
      return (
        (this.get('attributeValidation') &&
          this.get('showMessage') &&
          this.get('hasContent')) ||
        (this.get('attributeValidationHidden') &&
          this.get('showMessageHidden') &&
          this.get('hasContentHidden'))
      );
    }
  ),
  /**
   * @param {Computed } hasContent - computed property that defines whether the rawInputValue is null or not.
   */
  hasContentHidden: computed.notEmpty('rawInputValueHidden'),
  /**
   * @param {Computed } isValid -  A computed property that says whether the value is valid
   */
  isValid: computed.and(
    'hasContent',
    'attributeValidation.isValid',
    'hasContentHidden',
    'attributeValidationHidden.isValid'
  ),
  /**
   * @param {Computed } isInvalid - A computed property that says whether the value is invalid
   */
  isInvalidHidden: computed.oneWay('attributeValidationHidden.isInvalid'),
  /**
   * @param {Computed } showMessage - property that defines if the message should be shown
   */
  showMessageHidden: computed(
    'attributeValidationHidden.isDirty',
    'isInvalidHidden',
    'didValidateHidden',
    'isTyping',
    'didSubmit',
    function() {
      return (
        (this.get('attributeValidationHidden.isDirty') ||
          this.get('didValidateHidden')) &&
        this.get('isInvalidHidden') &&
        !this.get('isTyping') &&
        this.get('didSubmit')
      );
    }
  )

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
});
