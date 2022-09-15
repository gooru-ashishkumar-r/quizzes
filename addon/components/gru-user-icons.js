import Ember from 'ember';

/**
 * User Icons
 *
 * Component responsible for indicating how many users are active/inactive
 * in a specific context (e.g. unit, lesson, assessment)
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['gru-user-icons'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    showMoreUsers: function() {
      const component = this;
      const viewMoreIn =
        this.get('viewMoreIn') === 'modal' ? 'modal' : 'tooltip';

      if (!this.get('showOnlyNumbers')) {
        if (viewMoreIn === 'modal') {
          component.$('.remaining').modal('toggle');
        } else {
          const openClass = component.get('tooltipOpenClass');
          const anyTooltipSelector = `.gru-user-icons .${openClass}`;
          // The popovers are controlled manually so that only one popover
          // is visible at a time
          var $open = Ember.$(anyTooltipSelector);

          if ($open.length) {
            $open.removeClass(openClass).popover('hide');
          }

          if ($open.get(0) !== this) {
            $(this).addClass(openClass).popover('show');
          }
        }
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events
  setup: Ember.on('didInsertElement', function() {
    const viewMoreIn = this.get('viewMoreIn') === 'modal' ? 'modal' : 'tooltip';
    if (!this.get('showOnlyNumbers')) {
      if (viewMoreIn !== 'modal') {
        this.setupTooltip();
      }
    }
  }),

  cleanUp: Ember.on('willDestroyElement', function() {
    // Handler bound to the anchor if using a modal or tooltip to display more users
    const $anchor = this.$('a.first-view');

    $anchor.off('click');

    // In case a popover was open, it will need to be destroyed
    $anchor.popover('destroy');
  }),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @prop {String} tooltipOpenClass - Class added to the component when its tooltip is displayed
   */
  tooltipOpenClass: 'gru-popover-open',

  /**
   * @prop {Ember.Array} firstUsers - List of users to be displayed at first glance
   */
  firstUsers: Ember.computed.filter('usersSorted', function(user, index) {
    var viewThreshold = this.get('viewThreshold') - 1;
    return index < viewThreshold;
  }),

  /**
   * @prop {Bool} isTooltipVisible - Flag to control the visibility of the tooltip
   */
  isTooltipHidden: false,

  /**
   * @prop {Ember.Array} remainingUsers - List of users to be displayed if the
   * user requires to view more
   */
  remainingUsers: Ember.computed.filter('usersSorted', function(user, index) {
    var viewThreshold = this.get('viewThreshold') - 1;
    return index >= viewThreshold;
  }),

  /**
   * @prop {Number} remainingUsersNumber - Number of users surpassing the view threshold
   */
  remainingUsersNumber: Ember.computed(
    'usersSorted.length',
    'viewThreshold',
    function() {
      return this.get('usersSorted.length') - (this.get('viewThreshold') - 1);
    }
  ),

  /**
   * @prop {Bool} showMoreUsers - Should the user be allowed to require to view more users
   */
  showMoreUsers: Ember.computed.gt('remainingUsersNumber', 1),

  /**
   * @prop {Ember.Array} users - List of users to be displayed by the component
   */
  users: null,

  /**
   * @prop {Ember.Array} users - List of users to be displayed by the component
   */
  usersSorted: Ember.computed.sort('users', function(a, b) {
    // Sort first by status (i.e. active before inactive) and then alphabetically
    // in ascending order by last name
    var firstStatus = a.get('isActive');
    var firstName = a.get('user.lastName');
    var secondStatus = b.get('isActive');
    var secondName = b.get('user.lastName');

    return firstStatus > secondStatus
      ? -1
      : firstStatus < secondStatus ? 1 : firstName <= secondName ? -1 : 1;
  }),

  /**
   * @prop {String} viewMoreIn - Method for viewing additional users
   * Valid values are: 'tooltip' | 'modal'
   */
  viewMoreIn: 'tooltip',

  /**
   * @prop {Number} viewThreshold - Number of users that will be seen at first
   * glance (without requiring to view more)
   */
  viewThreshold: 3,

  /**
   * @prop {Bool} showOnlyNumbers - Shoy only the number of users
   */
  showOnlyNumbers: false,

  /**
   * @prop {Number} totalUsers - Number of total users
   */
  totalUsers: Ember.computed('usersSorted.length', function() {
    return this.get('usersSorted.length');
  }),

  membersCount: 0,

  // -------------------------------------------------------------------------
  // Observers

  hideTooltip: Ember.observer('isTooltipHidden', function() {
    const selector = `a.first-view.${this.get('tooltipOpenClass')}`;

    if (this.get('isTooltipHidden')) {
      // Simulate a click on the anchor element to hide the tooltip
      this.$(selector).click();
    }
  }),

  // -------------------------------------------------------------------------
  // Methods

  setupTooltip: function() {
    const component = this;
    const $anchor = this.$('a.first-view');

    if (this.get('showMoreUsers')) {
      $anchor.addClass('clickable');
      $anchor.attr('data-html', 'true');
      $anchor.popover({
        placement: 'auto bottom',
        content: function() {
          return component.$('.remaining .modal-body').html();
        },
        trigger: 'manual'
      });
    }
  }
});
