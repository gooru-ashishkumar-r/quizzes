import Ember from 'ember';
import ModalMixin from 'quizzes-addon/mixins/modal';
export default Ember.Component.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-image-modal'],

  thumbnail: Ember.computed.alias('model.thumbnail'),

  zoomImg: 1,
  // -------------------------------------------------------------------------
  // Actions
  actions: {
    zoomPlus: function() {
      let zoomImg = this.get('zoomImg');
      zoomImg = zoomImg - 0.1;
      Ember.set(this, 'zoomImg', zoomImg);
    },
    zoomMinus: function() {
      let zoomImg = this.get('zoomImg');
      zoomImg = zoomImg + 0.1;
      Ember.set(this, 'zoomImg', zoomImg);
    },
    closeModal: function() {
      this.set('modal.isVisible', false);
    }
  }
});
