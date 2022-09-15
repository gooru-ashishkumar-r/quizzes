import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',

  // -------------------------------------------------------------------------
  // Events

  renderMathExpression: Ember.on('didInsertElement', function() {
    var component = this;
    component.renderInMath();
  }),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Observe when the text change
   */
  mathRender: function() {
    var component = this;
    component.renderInMath();
  }.observes('text'),

  /**
   * Text to render
   */
  text: null,

  /**
   * based on this to show full videos
   */
  isShowVideo: false,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * It searches all of the text nodes in a given element for the given delimiters, and renders the math in place.
   */
  renderInMath: function() {
    var component = this;
    component.$('.gru-math-text').html(component.get('text'));
    let text = $('.gru-math-text a');
    if (text && text.length && component.get('isShowVideo')) {
      var i = text.length;
      for (i = 0; i < text.length; i++) {
        var aTag = text[i];
        if (aTag.host === 'www.youtube.com') {
          $(aTag).after(
            $('<iframe>', {
              src: aTag.href
            })
          );
          $(aTag).remove();
        }
      }
    } else if (text && text.length) {
      $('.gru-math-text a[href]').attr('target', '_blank');
    }
    window.renderMathInElement(component.$('.gru-math-text').get(0), {
      delimiters: [
        {
          left: '$$',
          right: '$$',
          display: false
        }
      ]
    });
  }
});
