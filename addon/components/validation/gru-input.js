import Ember from 'ember';
const { computed, defineProperty } = Ember;

/**
 * Text field with validation
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

  classNames: ['gru-input', 'validation'],
  classNameBindings: [
    'showErrorClass:has-error',
    'isValid:has-success',
    'valuePath'
  ],

  /**
   * @type {?string} string of classes (separated by a space) specific to the component instance
   */
  classes: '',

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    inputValueChange: function() {
      this.set(
        'rawInputValue',
        this.removeWhiteSpaces(this.get('rawInputValue'))
      );
      this.set('value', this.get('rawInputValue'));
      this.set('isTyping', false);
      if (this.get('onFocusOut')) {
        this.sendAction('onFocusOut');
      }
    },

    inputTyping: function() {
      this.set('isTyping', true);
      if (this.get('onTyping')) {
        this.sendAction('onTyping');
      }
    },

    enterPressed: function() {
      this.set(
        'rawInputValue',
        this.removeWhiteSpaces(this.get('rawInputValue'))
      );
      this.set('value', this.get('rawInputValue'));
      this.set('isTyping', false);
      this.get('onEnter') &&
        this.get('isValid') === true &&
        this.get('onEnter')(this.get('value'));
    },

    clearContent: function() {
      this.set('rawInputValue', '');
      this.set('value', this.get('rawInputValue'));
      this.sendAction('onClearContent');
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
    var value = this.removeTags(this.get(`model.${valuePath}`));
    this.set('rawInputValue', value);
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
  type: 'text',
  /**
   * @param {String} valuePath - value used to set the rawInputValue
   */
  valuePath: '',
  /**
   * @param {Number} type - max length of the input field.
   */
  maxLength: 1000,
  /**
   * @param {Object} attributeValidation - value used to set the rawInputValue
   */
  attributeValidation: null,
  /**
   * @param {Boolean} isTyping - Flag for when user is typing
   */
  isTyping: false,
  /**
   * @param {Boolean} hasClearButton - Flag for when we want to show a clear button
   */
  hasClearButton: false,
  /**
   * @param {Computed} showClearButton - Flag that determines when the button should be shown when flag is true
   */
  showClearButton: computed('hasClearButton', 'hasContent', function() {
    return this.get('hasContent') && this.get('hasClearButton');
  }),

  /**
   * @property {string} onFocusOut action
   */
  onFocusOut: null,

  /**
   * @property {string} onTyping action
   */
  onTyping: null,

  /**
   * Indicates if
   * @property {boolean}
   */
  autofocus: false,

  /**
   * @param {Computed } didValidate - value used to check if input has been validated or not
   */
  didValidate: false,

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
  hasContent: computed.notEmpty('rawInputValue'),
  /**
   * @param {Computed } isValid -  A computed property that says whether the value is valid
   */
  isValid: computed.readOnly('attributeValidation.isValid'),
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
  // Observers

  // -------------------------------------------------------------------------
  // Methods
  /*
  * Remove white spaces from input
  */
  removeWhiteSpaces: function(value) {
    return $.trim(value);
  },

  /*
   * Remove html tags from value
   */
  removeTags: function(value) {
    return $('<p>').html(value).text();
  }
});
