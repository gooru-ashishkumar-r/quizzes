import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-resource'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  didInsertElement: function() {
    if (this.get('aspectRatio')) {
      const delay = 300; // milliseconds
      var timer = null;

      // Get the component dimensions from the css
      Ember.run.scheduleOnce('afterRender', this, 'updateHeight');

      $(window).resize(() => {
        clearTimeout(timer);
        // The resize callback won't be processed until the resizing has stopped
        timer = setTimeout(this.updateHeight.bind(this), delay);
      });
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Resource} the resource
   */
  resource: null,

  /**
   * @property {Number} height - Component height
   * This value will be read from the css and will be updated on any window.resize events
   */
  height: 0,

  /**
   * @property {Number} width - Component width
   * This value will be read from the css and will be updated on any window.resize events
   */
  width: 0,

  /**
   * @property {string} bind the height css style for the component
   */
  resourceSize: Ember.computed('width', 'height', function() {
    const width = this.get('width');
    const widthString = width > 0 ? `${width}px` : '100%';
    const height = this.get('height');
    const heightString = height > 0 ? `${height}px` : '100%';
    return Ember.String.htmlSafe(
      `width: ${widthString}; height: ${heightString};`
    );
  }),

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Update the width value of the component per the css width value
   */
  updateHeight: function() {
    const component = this;
    const aspectRatio = component.get('aspectRatio');
    const $element = Ember.$(component.element);
    const height = $element.css('height')
      ? parseInt($element.css('height').split('px')[0])
      : 0;
    const width = $element.css('width')
      ? parseInt($element.css('width').split('px')[0])
      : 0;
    let newWidth = height * aspectRatio.width / aspectRatio.height;
    let newHeight = 0;
    if (newWidth > width) {
      newWidth = 0;
      newHeight = width * aspectRatio.height / aspectRatio.width;
    }
    if (!component.isDestroyed) {
      component.set('width', newWidth);
      component.set('height', newHeight);
    }
  }
});
