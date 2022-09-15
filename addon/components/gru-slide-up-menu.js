import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-slide-up-menu'],

  actions: {
    /**
     * Close mobile menu
     */
    closeMenu: function() {
      this.set('visible', false);
    },
    /**
     * Send option action to his parent
     */
    sendOptionAction: function(option) {
      this.sendAction(option.action, option.object);
    }
  },
  // -------------------------------------------------------------------------
  // Events
  /**
   * DidInsertElement ember event
   */
  didInsertElement: function() {
    !this.get('visible') ? $('.gru-slide-up-menu').addClass('hide') : '';
  },

  setVisible: Ember.observer('visible', function() {
    const $menu = $('.gru-slide-up-menu .slide-menu');
    const component = this;
    if (component.get('visible')) {
      component.toggleVisibility();
      component.set('menuHeight', `-${$menu.innerHeight()}px`);
      $menu.css('bottom', component.get('menuHeight')).animate(
        {
          bottom: '0'
        },
        600
      );
    } else {
      $menu.animate(
        {
          bottom: component.get('menuHeight')
        },
        600,
        function() {
          component.toggleVisibility();
        }
      );
    }
  }),
  // -------------------------------------------------------------------------
  // Properties
  /**
   * Menu height on pixels
   */
  menuHeight: 0,

  /**
   * Indicate if the menu is visible
   */
  visible: false,

  // -------------------------------------------------------------------------
  // Methods
  toggleVisibility: function() {
    $('.gru-slide-up-menu').toggleClass('hide');
    $('html,body').toggleClass('disabled-screen');
  }
});
