import Ember from 'ember';
import ClassSerializer from 'quizzes-addon/serializers/class/class';
import ClassAdapter from 'quizzes-addon/adapters/class/class';

/**
 * @typedef {Object} ClassService
 */
export default Ember.Service.extend({
  classSerializer: null,

  classAdapter: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'classSerializer',
      ClassSerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'classAdapter',
      ClassAdapter.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Gets the members, collaborators, invitees and owner for a specified class ID
   * @param classId the class id to read
   * @returns {Promise}
   */
  readClassMembers: function(classId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('classAdapter')
        .readClassMembers(classId)
        .then(
          function(response) {
            resolve(
              service.get('classSerializer').normalizeReadClassMembers(response)
            );
          },
          function(error) {
            reject(error);
          }
        );
    });
  }
});
