import Ember from 'ember';

export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {Service} Configuration service
   */
  configurationService: Ember.inject.service('quizzes/configuration'),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Get model for the controller
   */
  model: function() {
    const teacherConfig = this.get(
      'configurationService.configuration.properties.teacher'
    );
    const context = this.get(
      'configurationService.configuration.properties.context'
    );

    return Ember.RSVP.hash({
      teacherConfig,
      context
    });
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    controller.set('teacherConfig', model.teacherConfig);
    controller.set('context', model.context);
  }
});
