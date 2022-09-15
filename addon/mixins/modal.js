import Ember from 'ember';

export default Ember.Mixin.create({
  modal: Ember.Object.create({
    isVisible: false,
    showHeader: false,
    name: null,
    model: null,
    target: null,
    activeChannel: null,
    'component-class': null
  }),

  actions: {
    showModal: function(
      componentName,
      componentModel,
      activeChannel,
      componentClass,
      showHeader
    ) {
      this.get('modal').setProperties({
        isVisible: true,
        showHeader: showHeader,
        name: componentName,
        model: componentModel,
        activeChannel: activeChannel,
        'component-class': componentClass,
        width: componentModel.width || '600px',
        height: componentModel.height,
        overflow: componentModel.overflow
      });
    }
  },

  didRender() {
    const context = this;
    if (
      context &&
      context.$() &&
      context.$().length &&
      context.$().hasClass('modal')
    ) {
      setTimeout(function() {
        if (context && context.$() && context.$().length) {
          context.$('input:first').focus();
        }
      }, 400);
      // Handles enter key press
      context.$().on('keyup', '.modal-body', function(e) {
        var keyCode = event.keyCode ? event.keyCode : event.which;
        if (keyCode === 13) {
          $(e.target)
            .blur()
            .focus();
        }
      });
    }
  }
});
