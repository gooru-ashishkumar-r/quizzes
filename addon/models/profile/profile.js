import Ember from 'ember';

/**
 * Profile model with the user information
 *
 * @typedef {Object} ProfileModel
 */
export default Ember.Object.extend({
  /**
   * @property {string} avatarUrl - The profile image
   */
  avatarUrl: null,

  /**
   * @property {string} email - The profile email
   */
  email: null,

  /**
   * @property {string} firstName - The user first name
   */
  firstName: null,

  /**
   * @property {string} fullName - The user full name
   */
  fullName: Ember.computed('firstName', 'lastName', function() {
    const firstName = this.get('firstName');
    const lastName = this.get('lastName');
    return `${firstName} ${lastName}`.trim();
  }),

  /**
  * @property {String} fullName - The user lastname, firstname
  */
  lastFirstName: Ember.computed('firstName', 'lastName', function() {
    const firstName = this.get('firstName');
    const lastName = this.get('lastName');
    return `${lastName}, ${firstName}`.trim();
  }),

  /**
   * @property {string} id - The profile id
   */
  id: null,

  /**
   * @property {boolean} isAssigned
   */
  isAssigned: null,

  /**
   * @property {string} lastName - The user last name
   */
  lastName: null,

  /**
   * @property {string} username - The user username
   */
  username: null,

  /**
   * @property {string} studentId - The user student id
   */
  studentId: null
});
