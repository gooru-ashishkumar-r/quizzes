import Ember from 'ember';
export default Ember.Route.extend({
  queryParams: {
    isTeacher: {}
  },
  // -------------------------------------------------------------------------
  // Dependencies

  quizzesConfigurationService: Ember.inject.service('quizzes/configuration'),

  quizzesContextService: Ember.inject.service('quizzes/context'),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Get model for the controller
   */
  model: function(params) {
    const profileId = params.profileId;
    let assignments;
    const studentList = this.get(
      'quizzesConfigurationService.configuration.properties.students'
    );
    const playerURL = this.get(
      'quizzesConfigurationService.configuration.properties.playerURL'
    );
    const realTimeURL = this.get(
      'quizzesConfigurationService.configuration.properties.realTimeURL'
    );

    const isTeacher = params.isTeacher === 'true';

    assignments = isTeacher
      ? this.get('quizzesContextService').getContextsCreated()
      : this.get('quizzesContextService').getContextsAssigned();

    return Ember.RSVP.hash({
      profileId,
      isTeacher,
      assignments,
      studentList,
      playerURL,
      realTimeURL
    });
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    controller.set('profileId', model.profileId);
    controller.set('isTeacher', model.isTeacher);
    controller.set('assignments', model.assignments);
    controller.set('studentList', model.studentList);
    controller.set('playerURL', model.playerURL);
    controller.set('realTimeURL', model.realTimeURL);
  }
});
