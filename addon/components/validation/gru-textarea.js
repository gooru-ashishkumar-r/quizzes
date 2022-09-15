import Ember from 'ember';
const { computed, defineProperty } = Ember;

/**
 * Text area with validation
 *
 * Text field with support for ember-cp-validations.
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

  classNames: ['gru-textarea', 'validation'],
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
    textareaValueChange: function() {
      this.set(
        'rawTextareaValue',
        this.removeWhiteSpaces(this.get('rawTextareaValue'))
      );
      this.set('value', this.get('rawTextareaValue'));
      this.set('isTyping', false);
      if (this.get('onFocusOut')) {
        this.sendAction('onFocusOut');
      }
    },
    textareaTyping: function() {
      this.set('isTyping', true);
      if (this.get('onTyping')) {
        this.sendAction('onTyping');
      }
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
    this.set('rawTextareaValue', this.get(`model.${valuePath}`));
    defineProperty(this, 'value', computed.alias(`model.${valuePath}`));
  },
  didInsertElement: function() {
    var $component = this;
    this.$('textarea').bind('paste', function(e) {
      //Handle paste event http://stackoverflow.com/questions/11605415/jquery-bind-to-paste-event-how-to-get-the-content-of-the-paste
      var pastedData = e.originalEvent.clipboardData.getData('text');
      $component.set('rawTextareaValue', pastedData);
      $component.set('value', $component.get('rawTextareaValue'));
    });
  },
  // -------------------------------------------------------------------------
  // Properties

  /**
   * @param {Object} model - Model that will be attached to the component
   */
  model: null,
  /**
   * @param {String} value - formatted value of the textarea field.
   */
  value: null,
  /**
   * @param {String} rawInputValue - unformatted value of the textarea field
   */
  rawTextareaValue: null,
  /**
   * @param {String} type - type of the textarea field.
   */
  type: 'text',
  /**
   * @param {String} valuePath - value used to set the rawTextareaValue
   */
  valuePath: '',
  /**
   * @param {Number} type - max length of the textarea field.
   */
  maxLength: null,

  /**
   * @param {Number} rows of the textarea field.
   */
  rows: 1,
  /**
   * @param {Object} attributeValidation - value used to set the rawTextareaValue
   */
  attributeValidation: null,

  isTyping: false,

  /**
   * @property {string} onFocusOut action
   */
  onFocusOut: null,

  /**
   * @property {string} onTyping action
   */
  onTyping: null,

  /**
   * @property {string} placeholder
   */
  placeholder: null,

  /**
   * @param {Computed } didValidate - value used to check if input has been validated or not
   */
  didValidate: false,

  isMaxLength: computed('value.length', 'maxLength', function() {
    return this.get('value.length') >= this.get('maxLength');
  }),

  /**
   * @param {Computed } showErrorClass - computed property that defines the
   */
  showErrorClass: computed(
    'showMessage',
    'hasContent',
    'attributeValidation',
    function() {
      return (
        this.get('attributeValidation') &&
        this.get('showMessage') &&
        this.get('hasContent')
      );
    }
  ),
  /**
   * @param {Computed } hasContent - computed property that defines whether the rawInputValue is null or not.
   */
  hasContent: computed.notEmpty('rawTextareaValue'),
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
    'isTyping',
    function() {
      return (
        (this.get('attributeValidation.isDirty') || this.get('didValidate')) &&
        this.get('isInvalid') &&
        !this.get('isTyping')
      );
    }
  ),

  // -------------------------------------------------------------------------
  // Methods
  /*
   * Remove white spaces from input
   */
  removeWhiteSpaces: function(value) {
    return $.trim(value);
  }
});
