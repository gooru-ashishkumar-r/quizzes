import Ember from 'ember';
import ModalMixin from 'quizzes-addon/mixins/modal';
import Profile from 'quizzes-addon/models/profile/profile';
import { getGradeColor } from 'quizzes-addon/utils/utils';

export default Ember.Component.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  /**
   * @property {Service} Context service
   */
  contextService: Ember.inject.service('quizzes/context'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-assignments-detail'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Open add student modal
     */
    addStudent: function() {
      const assigned = this.get('assignment.assignees');
      let assignedStudents = [];
      let students = [];
      if (assigned) {
        assignedStudents = assigned.getEach('id');
        if (this.get('studentList')) {
          students = this.get('studentList').map(function(student) {
            const studentObject = Profile.create(student);
            studentObject.set(
              'isAssigned',
              assignedStudents.includes(student.id)
            );
            return studentObject;
          });
        }
      }
      this.set('students', students);

      const model = {
        students: this.get('students'),
        assignment: this.get('assignment'),
        width: '95%'
      };
      this.actions.showModal.call(
        this,
        'gru-assign-student-modal',
        model,
        null,
        null,
        null,
        false
      );
    },

    /**
     * Redirect to real time
     */
    openRealTime: function() {
      if (this.get('realTimeURL')) {
        const url = this.get('realTimeURL').replace(
          '{context-id}',
          this.get('assignment.id')
        );
        window.location.href = url;
      } else {
        this.get('router').transitionTo(
          'reports.context',
          this.get('assignment.id')
        );
      }
    },
    /**
     * Preview player
     */
    previewPlayer: function(assignment) {
      const playerURL = this.get('playerURL');
      assignment.set('classId', null);
      this.get('contextService').createContext(assignment).then(({ id }) => {
        if (playerURL) {
          const url = playerURL.replace('{context-id}', id);
          window.location.href = url;
        } else {
          this.get('router').transitionTo('player', id);
        }
      });
    },
    /**
     * Open player
     */
    openPlayer: function(assignment) {
      if (this.get('playerURL')) {
        const url = this.get('playerURL').replace(
          '{context-id}',
          assignment.get('id')
        );
        window.location.href = url;
      } else {
        this.get('router').transitionTo('player', assignment.get('id'));
      }
    },
    /**
     * View Report
     */
    viewReport: function(assignment) {
      Ember.Logger.log('View Report:', assignment);
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Assignment to show
   */
  assignment: null,

  /**
   *Indicate if the assignment has attempts left
   */
  hasAttempts: Ember.computed(
    'assignment.attempts',
    'assignment.totalAttempts',
    function() {
      return (
        this.get('assignment.totalAttempts') - this.get('assignment.attempts') >
        0
      );
    }
  ),

  /**
   * @property {Boolean} Indicate if is a teacher view
   * @see gru-assignments-list and assignments.js route
   */
  isTeacher: false,

  /**
   * @property {String} scoreStyle style safe string for the score span
   */
  scoreStyle: Ember.computed('assignment.score', function() {
    const color = getGradeColor(this.get('assignment.score') || 'NA');
    return Ember.String.htmlSafe(`background-color: ${color}`);
  }),

  /**
   * @property {Array} Students list
   */
  students: null
});
