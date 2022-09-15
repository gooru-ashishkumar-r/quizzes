import Ember from 'ember';
import ModalMixin from 'quizzes-addon/mixins/modal';

/**
 * Modal window
 *
 * Modal window to dynamically display any component
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Attributes

  /** @type {String[]} */
  classNames: ['qz-modal', 'fade', 'modal'],

  /** @type {String[]} */
  classNameBindings: ['component-class'],

  // -------------------------------------------------------------------------
  // Events

  didInsertElement: function() {
    var self = this;

    // Add event listener
    this.$().on('hidden.bs.modal', function() {
      // Force the ember run loop to run right away
      Ember.run(function() {
        // The property 'is-visible' controls the visibility of a particular modal instance
        // However, all modals in the app must be controlled simultaneously. That is what
        // the modal mixin is for: to keep all modal instances in sync; therefore,
        // the value of 'modal.isVisible' is set instead of the property 'is-visible'.
        self.set('modal.isVisible', false);
      });
    });

    this.controlVisibility();
  },

  willDestroyElement: function() {
    this.$().off('hidden.bs.modal');
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Specific component class(es). Multiple classes are separated with spaces.
   * @type {?String}
   */
  'component-class': Ember.computed.alias('modal.component-class'),

  /**
   * Component data
   * @type {*}
   * @private
   */
  'component-model': Ember.computed.alias('modal.model'),

  /**
   * Name of the component to display
   * @type {String}
   * @private
   */
  'component-name': Ember.computed.alias('modal.name'),

  /**
   * Modal style
   * @type {String}
   */
  style: Ember.computed('modal.width', function() {
    let width = this.get('modal.width');
    if (window.outerHeight < 768) {
      width = '93%';
    }
    let style = `width: ${width}`,
      height = this.get('modal.height'),
      overflow = this.get('modal.overflow');
    style = height ? `${style};height: ${height}` : style;
    style = overflow ? `${style};overflow: ${overflow}` : style;
    return Ember.String.htmlSafe(style);
  }),

  height: Ember.computed('modal.height', function() {
    let height = this.get('modal.height');
    return height ? Ember.String.htmlSafe(`;height: ${height}`) : height;
  }),
  /**
   * Name of the channel this modal component will be listening to.
   * A global modal component will not have a channel value.
   * @type {String}
   */
  channel: null,

  /**
   * Whether the modal window should be visible or not
   * @type {Boolean}
   * @private
   */
  'is-visible': function() {
    var activeChannel = this.get('modal.activeChannel');
    var isVisible = this.get('modal.isVisible');
    var modalChannel = this.get('channel');

    if (!activeChannel) {
      // Addressing the global modal
      return !modalChannel ? isVisible : false;
    } else {
      return activeChannel === modalChannel ? isVisible : false;
    }
  }.property('modal.isVisible', 'modal.activeChannel', 'channel'),

  // -------------------------------------------------------------------------
  // Observers

  /**
   * Display the modal based on its state
   * @type {String}
   */
  controlVisibility: function() {
    if (this.get('is-visible')) {
      this.$().modal('show');
    } else {
      this.$().modal('hide');
    }
  }.observes('is-visible'),

  actions: {
    closeModal: function() {
      this.set('modal.isVisible', false);
    }
  }
});
