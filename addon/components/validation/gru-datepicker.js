import Ember from 'ember';
const { computed, defineProperty } = Ember;

/**
 * Text field validation
 *
 * Text field validations to be used with the datepicker-field.js component with support for ember-cp-validations.
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

  classNames: ['gru-datepicker', 'validation'],
  classNameBindings: ['showErrorClass:has-error', 'isValid:has-success'],

  /**
   * @type {?string} string of classes (separated by a space) specific to the component instance
   */
  classes: null,

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Update value of attached model.
     * @param {String} value - value as string
     */
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
   * @param {String} value - alias of 'model.${valuePath}'
   */
  value: null,
  /**
   * @param {String} rawInputValue - unformatted value of the input field
   */
  rawInputValue: null,
  /**
   * @param {String} type - type of the input field.
   */
  type: 'text',
  /**
   * @param {String} valuePath - name of the input, used to get the value to be set in the rawInputValue
   */
  valuePath: '',
  /**
   * @param {Boolean} attributeValidation - attribute used to determine whether to show the message or not
   */
  attributeValidation: null,

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
