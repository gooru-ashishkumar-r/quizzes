import Ember from 'ember';
import ModalMixin from 'quizzes-addon/mixins/modal';
import Profile from 'quizzes-addon/models/profile/profile';

export default Ember.Component.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  /**
   * @property {Service} profile service
   */
  profileService: Ember.inject.service('quizzes/profile'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-assignments-table'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Open add student modal
     */
    addStudent: function(assignment) {
      const component = this;
      let students = [];
      const profilesList = assignment
        .get('assignees')
        .map(profile => profile.id);

      if (profilesList && component.get('studentList')) {
        students = component.get('studentList').map(function(student) {
          const studentObject = Profile.create(student);
          const containsStudent = profilesList.includes(student.id);
          studentObject.set('isAssigned', containsStudent);
          studentObject.set('id', student.id);
          return studentObject;
        });
      }
      component.set('students', students);

      const model = {
        students: component.get('students'),
        assignment,
        width: '95%',
        callback: {
          success: assignment =>
            component.sendAction('onUpdateAssignment', assignment)
        }
      };
      component.actions.showModal.call(
        component,
        'gru-assign-student-modal',
        model,
        null,
        null,
        null,
        false
      );
    },
    /**
     * Open slide up actions
     */
    openActions: function(assignment) {
      this.set('actualAssignment', assignment);
      this.set('showMenu', true);
    },

    /**
     * Redirect to real time
     */
    openRealTime: function(assignment) {
      if (this.get('realTimeURL')) {
        const url = this.get('realTimeURL').replace(
          '{context-id}',
          assignment.get('id')
        );
        window.location.href = url;
      } else {
        this.get('router').transitionTo(
          'reports.context',
          assignment.get('id')
        );
      }
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

    /***
     * Search assignment
     */
    selectAssignment: function(assignment) {
      this.selectAssignment(assignment);
      this.sendAction('onSelectAssignment', assignment);
    },

    /**
     * Sort assignment list
     */
    sortBy: function(criteria) {
      if (criteria === this.get('sortBy')) {
        this.set('reverseSort', !this.get('reverseSort'));
      } else {
        this.set('sortBy', criteria);
        this.set('reverseSort', false);
      }
    }
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {Context} selected assignment
   */
  actualAssignment: null,

  /**
   * @property {Boolean} Indicate if is a teacher view
   * @see gru-assignments-list and assignments.js route
   */
  isTeacher: false,

  /**
   * Return menu mobile options
   */
  optionsMobile: Ember.computed('actualAssignment', 'isTeacher', function() {
    let options;
    if (this.get('isTeacher')) {
      options = this.teacherOptions(this.get('actualAssignment'));
    } else {
      //TODO STUDENT VIEW OPTIONS
    }
    return options;
  }),

  /**
   * @property {Array} Students list
   */
  students: [],

  /**
   * @property {Array} Total student list
   */
  studentList: [],

  /**
   *  @property {Boolean} show actions menu
   */
  showMenu: false,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Set assignment as selected
   */
  selectAssignment: function(assignment) {
    this.unSelectAssignment();
    assignment.set('selected', true);
  },
  /**
   * Return the teacher options for mobile menu
   */
  teacherOptions: function(assignment) {
    return Ember.A([
      Ember.Object.create({
        option: 'assign',
        action: 'onAssign',
        object: assignment
      }),
      Ember.Object.create({
        option: 'preview',
        action: 'onPreview',
        object: assignment
      })
    ]);
  },

  /**
   * Unselected assignment
   */
  unSelectAssignment: function() {
    var selectedAssignment = this.get('assignments').findBy('selected', true);
    if (selectedAssignment) {
      selectedAssignment.set('selected', false);
    }
  }
});
