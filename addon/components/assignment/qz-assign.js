import Ember from 'ember';
import Profile from 'quizzes-addon/models/profile/profile';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Events
  init: function() {
    this._super(...arguments);
    this.set(
      'teacher',
      Profile.create({
        id: this.get('teacherConfig.id'),
        firstName: this.get('teacherConfig.firstName'),
        lastName: this.get('teacherConfig.lastName'),
        username: this.get('teacherConfig.username'),
        email: this.get('teacherConfig.email')
      })
    );
  },
  // -------------------------------------------------------------------------
  // Properties
  /**
   * Owner of the assignment
   */
  teacher: null,
  /**
   * Student list
   */
  students: null
});
