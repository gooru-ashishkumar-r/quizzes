import Ember from 'ember';

/**
 * Select Date Picker
 *
 * Component responsible to show the bootstrap selectpicker for a date.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['gru-select-date-picker'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  /**
   * DidInsertElement ember event
   */
  didInsertElement: function() {
    $('.selectpicker').selectpicker();

    $('.selectpicker').on(
      'loaded.bs.select',
      function() {
        $('.birth-day-date').on(
          'focusout',
          function(e) {
            e.stopPropagation();
            this.set('focusLost', true);
          }.bind(this)
        );

        $('.birth-day-date .bootstrap-select.months').on(
          'focusin',
          function(e) {
            e.stopPropagation();
            this.set('focusLost', false);
          }.bind(this)
        );

        $('.birth-day-date .bootstrap-select.days').on(
          'focusin',
          function(e) {
            e.stopPropagation();
            this.set('focusLost', false);
          }.bind(this)
        );

        $('.birth-day-date .bootstrap-select.years').on(
          'focusin',
          function(e) {
            e.stopPropagation();
            this.set('focusLost', false);
          }.bind(this)
        );
      }.bind(this)
    );

    $('.birth-day-date select.selectpicker.months').on(
      'change',
      function() {
        var monthSelected = $('.selectpicker.months option:selected').val();
        this.set('birthMonthSelected', monthSelected);
      }.bind(this)
    );

    $('.birth-day-date select.selectpicker.days').on(
      'change',
      function() {
        var daySelected = $('.selectpicker.days option:selected').val();
        this.set('birthDaySelected', daySelected);
      }.bind(this)
    );

    $('.birth-day-date select.selectpicker.years').on(
      'change',
      function() {
        var yearSelected = $('.selectpicker.years option:selected').val();
        this.set('birthYearSelected', yearSelected);
      }.bind(this)
    );
  },

  /**
   * willDestroyElement event
   */
  willDestroyElement: function() {
    this.set('birthDays', null);
    this.set('birthYears', null);
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * List of birthDays options
   *
   * @property {Array}
   */
  birthDays: function() {
    var birthDays = [];

    for (let d = 1; d <= 31; d++) {
      birthDays.push(`0${d}`.slice(-2));
    }

    return birthDays;
  }.property(),

  /**
   * List of birthYears options
   *
   * @property {Array}
   */
  birthYears: function() {
    var birthYears = [];
    var currentTime = new Date();

    // returns the current year (four digits)
    var year = currentTime.getFullYear();

    for (let y = year; y >= 1900; y--) {
      birthYears.push(y);
    }

    return birthYears;
  }.property(),

  /**
   * Stores the day value has been selected
   * @property {Array}
   */
  birthDaySelected: null,

  /**
   * Stores the month value has been selected
   * @property {Array}
   */
  birthMonthSelected: null,

  /**
   * Stores the year value has been selected
   * @property {Array}
   */
  birthYearSelected: null,

  /**
   * Show sign up form was submitted or not
   * @property {Boolean}
   */

  wasSubmitted: false,

  /**
   * Show error birth message or not, and tigger action when the gru-select-date-picker options are selected
   * @property {Boolean}
   */
  showBirthMessage: Ember.computed(
    'birthDaySelected',
    'birthMonthSelected',
    'birthYearSelected',
    'focusLost',
    'wasSubmitted',
    function() {
      if (
        this.get('birthMonthSelected') &&
        this.get('birthDaySelected') &&
        this.get('birthYearSelected')
      ) {
        this.sendAction('onValidDate');
      }

      return (
        ((!this.get('birthMonthSelected') ||
          !this.get('birthDaySelected') ||
          !this.get('birthYearSelected')) &&
          this.get('focusLost')) ||
        ((!this.get('birthMonthSelected') ||
          !this.get('birthDaySelected') ||
          !this.get('birthYearSelected')) &&
          this.get('wasSubmitted') &&
          this.get('focusLost') !== false)
      );
    }
  )
  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
});
