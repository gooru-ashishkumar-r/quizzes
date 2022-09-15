import GruInput from 'quizzes-addon/components/validation/gru-input';

/**
 * Number field with validation (It only accepts integers)
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
  // Actions
  actions: {
    inputValueChange: function() {
      this.set(
        'rawInputValue',
        this.get('rawInputValue') ? +this.get('rawInputValue') : null
      );
      this.set('value', this.get('rawInputValue'));
      this.set('isTyping', false);
      if (this.get('onFocusOut')) {
        this.sendAction('onFocusOut');
      }
    },

    inputTyping: function() {
      this._super(...arguments);
      this.set('oldValue', this.get('rawInputValue'));
    }
  },

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-input-number', 'validation'],
  classNameBindings: [
    'showErrorClass:has-error',
    'isValid:has-success',
    'valuePath'
  ],

  // -------------------------------------------------------------------------
  // Events

  init() {
    this._super(...arguments);
    this.set('oldValue', this.get('rawInputValue'));
  },

  didRender: function() {
    this._super(...arguments);
    const component = this;
    // only accept numbers
    component.$('input[type=number]').keypress(function(event) {
      // 0 means key without character input, 8 is backspace, 48-57 are numbers
      const keyCode =
        typeof event.which === 'number' ? event.which : event.keyCode;
      return keyCode === 0 || keyCode === 8 || (keyCode >= 48 && keyCode <= 57);
    });
    // check that it is between min and max
    component.$('input[type=number]').on('input', function() {
      // accept the empty value
      if (this.value) {
        var tempValue = +this.value;
        if (
          tempValue < component.get('min') ||
          tempValue > component.get('max')
        ) {
          this.value = component.get('oldValue');
        }
      }
    });
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @param {Number} max - maximum number value
   */
  max: 100,

  /**
   * @param {Number} min - minimum number value
   */
  min: 0,

  /**
   * @param {Number} step - step between values when using the picker
   */
  step: 1,

  /**
   * @param {String} oldValue - before the value has changed / before the input event
   */
  oldValue: null
});
