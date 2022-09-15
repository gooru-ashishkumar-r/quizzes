import Ember from 'ember';
import {
  TAXONOMY_CATEGORIES,
  GOORU_DEFAULT_STANDARD
} from 'quizzes-addon/config/quizzes-config';

/**
 * Taxonomy Root
 *
 * @typedef {Object} TaxonomyRoot
 */
const TaxonomyRoot = Ember.Object.extend({
  /**
   * @property {string} id - Item ID
   */
  id: null,

  /**
   * @property {string} frameworkId - Standard Framework ID
   */
  frameworkId: null,

  /**
   * @property {string} title - Text label for this item
   */
  title: '',

  /**
   * @property {string} subjectTitle - Text label for the subject item
   */
  subjectTitle: '',

  /**
   * @property {string} code - Code for this item
   */
  code: '',

  /**
   * @property {TaxonomyItem[]} courses - List of courses
   */
  courses: [],

  /**
   * @property {TaxonomyRoot[]} children - List of frameworks
   */
  frameworks: [],

  /**
   * Category
   * @property {string}
   */
  category: Ember.computed('id', function() {
    const code = this.get('id').split('.')[1];
    const category = Ember.A(TAXONOMY_CATEGORIES).findBy('apiCode', code);
    return category ? category.value : null;
  }),

  /**
   * @property {boolean}
   */
  hasCourses: Ember.computed.bool('courses.length'),

  /**
   * @property {boolean}
   */
  hasFrameworks: Ember.computed.bool('frameworks.length'),

  /**
   * Indicates if the subject has standards
   * A subject is considered to have standards if it has a framework that is
   * the Gooru Default Framework (GDF)
   * @property {boolean}
   */
  hasStandards: Ember.computed('frameworks', function() {
    const otherThanGDF = this.get('frameworkId') !== GOORU_DEFAULT_STANDARD;
    const frameworksWithStandards = this.get('frameworksWithStandards');
    return otherThanGDF && frameworksWithStandards.length;
  }),

  /**
   * Returns all the frameworks having standards
   * @propery {TaxonomyRoot[]}
   */
  frameworksWithStandards: Ember.computed('frameworks', function() {
    const frameworks = this.get('frameworks');
    return frameworks.filter(function(framework) {
      return framework.get('frameworkId') !== GOORU_DEFAULT_STANDARD; //Gooru default framework
    });
  })
});

export default TaxonomyRoot;
