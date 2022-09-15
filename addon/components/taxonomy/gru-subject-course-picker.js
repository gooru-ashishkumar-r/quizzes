import Ember from 'ember';
import TaxonomyTagData from 'quizzes-addon/models/taxonomy/taxonomy-tag-data';
import { TAXONOMY_LEVELS } from 'quizzes-addon/config/quizzes-config';

/**
 * subject course picker component
 *
 * Component responsible for displaying subject courses
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['taxonomy', 'gru-subject-course-picker'],

  // -------------------------------------------------------------------------
  // Events

  didInsertElement() {
    this.$().on('click', 'ul.courses li', function(e) {
      e.stopPropagation();
    });
  },

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Select a subject course
     */
    selectSubjectCourse(course) {
      const component = this;
      const subject = component.get('selectedSubject');
      const taxonomyTagData = TaxonomyTagData.create({
        id: course.get('id'),
        code: course.get('code'),
        title: course.get('title'),
        parentTitle: subject.get('subjectTitle'),
        frameworkCode: subject.get('frameworkId'),
        taxonomyLevel: TAXONOMY_LEVELS.COURSE
      });
      component.addRemoveTaxonomyTagData(taxonomyTagData);
      if (component.get('onTaxonomySelected')) {
        component.sendAction(
          'onTaxonomySelected',
          this.get('selectedTaxonomy')
        );
      }
    },

    /**
     * Remove a specific tag
     */
    removeTag(tag) {
      const component = this;
      component.removeTaxonomyTagData(tag.get('data.id'));
      if (component.get('onTaxonomySelected')) {
        component.sendAction(
          'onTaxonomySelected',
          this.get('selectedTaxonomy')
        );
      }
    }
  },

  //
  // Methods
  /**
   * Removes a taxonomy tag data from taxonomy
   * @param id
   */
  removeTaxonomyTagData: function(taxonomyId) {
    const taxonomy = this.get('selectedTaxonomy');
    const taxonomyTagData = taxonomy.findBy('id', taxonomyId);
    if (taxonomyTagData) {
      taxonomy.removeObject(taxonomyTagData);
    }
  },

  /**
   * Adds or removes a taxonomy tag data
   * @param {TaxonomyTagData} taxonomyTagData
   */
  addRemoveTaxonomyTagData: function(taxonomyTagData) {
    const component = this;
    const taxonomy = component.get('selectedTaxonomy');
    const taxonomyId = taxonomyTagData.get('id');
    const existingTaxonomyTagData = taxonomy.findBy('id', taxonomyId);
    if (existingTaxonomyTagData) {
      taxonomy.removeObject(existingTaxonomyTagData);
    } else {
      taxonomy.pushObject(taxonomyTagData);
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {string[]} taxonomy ids
   */
  selectedTaxonomyIds: Ember.computed('selectedTaxonomy.[]', function() {
    return this.get('selectedTaxonomy').map(function(tagData) {
      return tagData.get('id');
    });
  }),

  /**
   * the subject selected
   * @property {TaxonomyRoot}
   */
  selectedSubject: null,

  /**
   * the subject courses to present
   * @property {[]}
   */
  subjectCourses: null,

  /**
   * @property {TaxonomyTagData[]}
   */
  selectedTaxonomy: Ember.A(),

  /**
   * when a taxonomy is selected
   * @property {string}
   */
  onTaxonomySelected: null

  // -------------------------------------------------------------------------
  // Observers
});
