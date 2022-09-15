import Ember from 'ember';
import ModalMixin from 'quizzes-addon/mixins/modal';

export default Ember.Component.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-assessment-confirmator'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {number} Ammount of attempts left on the assessment
   */
  attempts: null,

  /**
   * @property {bool} Boolean used to determine whether you can navigate both ways on an assessment or only forward
   */
  bidirectional: null,

  didInsertElement() {
    this._super(...arguments);
    const component = this;
    var model = {
      bidirectional: component.get('bidirectional'),
      attempts: component.get('attempts'),
      title: component.get('title'),
      onStart: () => component.sendAction('onStart'),
      onCancel: () => component.sendAction('onCancel')
    };

    this.actions.showModal.call(
      this,
      'content.modals.gru-assessment-confirmation',
      model
    );
  }
});
