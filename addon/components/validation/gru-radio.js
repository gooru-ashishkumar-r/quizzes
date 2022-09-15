import Ember from 'ember';
const { computed, defineProperty } = Ember;

/**
 * Input radio button from role-radio-button component with validation
 *
 * Input radio button with support for ember-cp-validations.
 * It provides feedback based on certain validation criteria.
 *
 * @module
 * @augments ember/Component
 * @see ember-cp-validations
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-radio', 'validation'],
  classNameBindings: ['showErrorClass:has-error', 'isValid:has-success'],

  /**
   * @type {?string} string of classes (separated by a space) specific to the component instance
   */
  classes: null,

  // -------------------------------------------------------------------------
  // Actions
  /**
   * Update user birth date
   * @param {String} dateValue - birth date as a string
   */
  actions: {
    setValue: function(value) {
      this.set(`model.${this.valuePath}`, value);
    }
  },

  // -------------------------------------------------------------------------
  // Events

  init() {
    this._super(...arguments);
    var valuePath = this.get('valuePath');
    defineProperty(
      this,
      'attributeValidation',
      computed.oneWay(`model.validations.attrs.${valuePath}`)
    );
    this.set('rawInputValue', this.get(`model.${valuePath}`));
    defineProperty(this, 'value', computed.alias(`model.${valuePath}`));
  },
  // -------------------------------------------------------------------------
  // Properties
  /**
   * @param {Object} model - Model that will be attached to the component
   */
  model: null,
  /**
   * @param {String} value - formatted value of the input field.
   */
  value: null,
  /**
   * @param {String} rawInputValue - unformatted value of the input field
   */
  rawInputValue: null,
  /**
   * @param {String} type - type of the input field.
   */
  type: 'radio',
  /**
   * @param {String} valuePath - value used to set the rawInputValue
   */
  valuePath: '',
  /**
   * @param {Boolean} attributeValidation - value used to set the rawInputValue
   */
  attributeValidation: null,

  /**
   * @param {function} action to be performed on radio change.
   */
  onChange: null,

  /**
   * @param {Computed } didValidate - value used to check if input has been validated or not
   */
  didValidate: false,

  /**
   * @param {Computed } showErrorClass - computed property that defines the
   */
  showErrorClass: computed(
    'isTyping',
    'showMessage',
    'hasContent',
    'attributeValidation',
    function() {
      return (
        this.get('attributeValidation') &&
        !this.get('isTyping') &&
        this.get('showMessage') &&
        this.get('hasContent')
      );
    }
  ),
  /**
   * @param {Computed } hasContent - computed property that defines whether the rawInputValue is null or not.
   */
  hasContent: computed.notEmpty('rawInputValue'),
  /**
   * @param {Computed } isValid -  A computed property that says whether the value is valid
   */
  isValid: computed.and('hasContent', 'attributeValidation.isValid'),
  /**
   * @param {Computed } isInvalid - A computed property that says whether the value is invalid
   */
  isInvalid: computed.oneWay('attributeValidation.isInvalid'),
  /**
   * @param {Computed } hasContent - computed property that defines what message to show
   */
  showMessage: computed(
    'attributeValidation.isDirty',
    'isInvalid',
    'didValidate',
    function() {
      return (
        (this.get('attributeValidation.isDirty') || this.get('didValidate')) &&
        this.get('isInvalid')
      );
    }
  )
  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
});
