import Ember from 'ember';

export default Ember.Component.extend({
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

  classNames: ['gru-assignments-list'],
  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Select assignment
     */
    selectAssignment: function(assignment) {
      this.set('selectedAssignment', assignment);
    },

    /**
     * Update assignment
     */
    updateAssignment: function(assignmentUpdated) {
      this.set('selectedAssignment', assignmentUpdated);
      const assignment = this.get('assignments').findBy(
        'id',
        assignmentUpdated.get('id')
      );
      this.get('assignments').removeAt(
        this.get('assignments').indexOf(assignment)
      );
      this.get('assignments').insertAt(
        this.get('assignments').indexOf(assignment),
        assignmentUpdated
      );
    }
  },

  // -------------------------------------------------------------------------
  // Events

  /**
   * DidInsertElement ember event
   */
  didInsertElement: function() {
    const component = this;
    $('.gru-assignments-table tbody tr').each(function() {
      $(this).attr(
        'data-search-term',
        $(this).find('td.title').text().toLowerCase()
      );
    });
    $('.search-box').on('keyup', function() {
      component.searchAssignment();
    });
  },
  // -------------------------------------------------------------------------
  // Properties
  /**
   * Selected assignment
   */
  selectedAssignment: null,

  /**
   * Assignments List
   */
  assignments: [],
  /**
   * Indicate if is a teacher view
   */
  isTeacher: false,
  /**
   * Sort order
   */
  reverseSort: false, // default sort in ascending order
  /**
   * Sort criteria
   */
  sortBy: 'createdDate',
  /**
   * Assignments sorted by criteria
   */
  sortedAssignments: Ember.computed.sort('assignments', 'sortDefinition'),

  /**
   * Sort definition
   */
  sortDefinition: Ember.computed('sortBy', 'reverseSort', function() {
    const sortOrder = this.get('reverseSort') ? 'desc' : 'asc';
    return [`${this.get('sortBy')}:${sortOrder}`];
  }),

  /**
   *Total students available
   */
  studentList: [],

  // -------------------------------------------------------------------------
  // Methods
  /**
   * Filter assignment by title
   */
  searchAssignment: function() {
    var searchTerm = $('.gru-assignments-list .search-box').val().toLowerCase();

    $('.gru-assignments-table tbody tr').each(function() {
      if (
        $(this).filter(`[data-search-term *= ${searchTerm}]`).length > 0 ||
        searchTerm.length < 1
      ) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }
});
