import Ember from 'ember';
import ProfileSerializer from 'quizzes-addon/serializers/profile/profile';

/**
 * Serializer to support the Class CRUD operations for API 3.0
 *
 * @typedef {Object} ClassSerializer
 */
export default Ember.Object.extend({
  init: function() {
    this._super(...arguments);
    this.set(
      'profileSerializer',
      ProfileSerializer.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Normalize the response from class members endpoint
   * @param payload is the endpoint response in JSON format
   * @returns {ClassMembersModel} a class members model object
   */
  normalizeReadClassMembers: function(payload) {
    const serializer = this;
    return Ember.Object.create({
      owner: this.get('profileSerializer').normalizeProfile(
        payload.details.findBy('id', payload.owner[0])
      ),
      collaborators: serializer.filterCollaborators(payload),
      members: serializer.filterMembers(payload)
    });
  },

  filterCollaborators: function(payload) {
    return this.filterElements(payload, 'collaborator');
  },

  filterMembers: function(payload) {
    return this.filterElements(payload, 'member');
  },

  filterElements: function(payload, property) {
    const serializer = this;
    let elements = payload[property];
    if (Ember.isArray(elements) && elements.length > 0) {
      return elements
        .map(function(elementId) {
          return serializer
            .get('profileSerializer')
            .normalizeProfile(payload.details.findBy('id', elementId));
        })
        .compact();
    } else {
      return [];
    }
  }
});
