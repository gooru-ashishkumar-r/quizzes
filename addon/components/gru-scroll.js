import Ember from 'ember';

/**
 * Scroll-To Link
 *
 * Component responsible for creating a link that when clicked on will scroll the user
 * to a target element on the page. Clicking on the element will also set a class on
 * it to distinguish it from its siblings.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  tagName: 'a',

  // -------------------------------------------------------------------------
  // Events

  setupOffset: Ember.on('didInsertElement', function() {
    const offset = this.get('offset');

    if (offset) {
      if (!isNaN(offset)) {
        this.set('offsetVal', offset);
      } else {
        const $offsetEl = Ember.$(offset);
        const offsetVal = $offsetEl.length
          ? $offsetEl.offset().top + $offsetEl.height()
          : 0;
        this.set('offsetVal', offsetVal);
      }
    }
  }),

  scrollTo: Ember.on('click', function() {
    var $el = Ember.$(this.get('to'));
    var offsetVal = this.get('offsetVal');
    var $this = this.$();
    var activeClass = this.get('activeClass');

    if (!$this.hasClass(activeClass)) {
      $this.siblings().removeClass(activeClass);
      $this.addClass(activeClass);
    }

    if ($el) {
      Ember.$('html, body').animate(
        {
          scrollTop: $el.offset().top - offsetVal
        },
        this.get('speed')
      );
    }
  }),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @prop { String } activeClass - Class to mark this element as selected among its siblings
   */
  activeClass: 'selected',

  /**
   * @prop { String | Number } offset - Number in pixels from the top of the page or
   * CSS selector of an element to determine an offset from which to scroll (instead of
   * scrolling from the top of the page as default)
   */
  offset: '',

  /**
   * @prop { Number } offsetVal - Offset in pixels from the top of the page
   * @private
   */
  offsetVal: 0,

  /**
   * @prop { Number } speed - animation length in seconds
   */
  speed: 1000,

  /**
   * @prop { String } to - target element on the page to scroll to
   */
  to: ''
});
