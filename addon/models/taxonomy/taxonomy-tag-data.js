import Ember from 'ember';
import { TAXONOMY_LEVELS } from 'quizzes-addon/config/quizzes-config';

/**
 * Taxonomy Tag Data
 *
 * Model representation of a taxonomy tag
 *
 * @typedef {Object} TaxonomyTagData
 */
var TaxonomyTagData = Ember.Object.extend({
  /**
   * @property {String} id
   */
  id: null,

  /**
   * @property {String} title
   */
  title: '',

  /**
   * @property {String} code
   */
  code: '',

  /**
   * @property {String} description
   */
  description: '',

  /**
   * @property {String} framework code
   */
  frameworkCode: '',

  /**
   * @property {String} parentTitle - Text label
   */
  parentTitle: '',

  /**
   * @property {String} label - Text label
   */
  label: Ember.computed('taxonomyLevel', function() {
    return this.get('taxonomyLevel') === TAXONOMY_LEVELS.STANDARD
      ? this.get('code')
      : this.get('title');
  }),

  /**
   * @property {String} caption - Additional detail for the label
   */
  caption: Ember.computed('taxonomyLevel', function() {
    var taxonomyLevel = this.get('taxonomyLevel');
    var value;

    switch (taxonomyLevel) {
    case TAXONOMY_LEVELS.STANDARD:
    case TAXONOMY_LEVELS.COURSE:
      value = `${this.get('frameworkCode')} ${this.get('parentTitle')}`;
      break;
    case TAXONOMY_LEVELS.DOMAIN:
      value = this.get('parentTitle');
      break;
    default:
      // Micro standards
      value = this.get('code');
    }
    return value;
  }),

  /**
   * @property {String} taxonomyLevel
   */
  taxonomyLevel: TAXONOMY_LEVELS.STANDARD
});

TaxonomyTagData.reopenClass({
  /**
   * @function Create a taxonomy tag data instance from an existing taxonomy item
   * @static
   * @param {TaxonomyItem} taxonomyItem
   * @param {TaxonomyRoot} subject - Taxonomy item subject
   * @return {TaxonomyTagData}
   */
  createFromTaxonomyItem: function(taxonomyItem, subject) {
    var level = taxonomyItem.get('level');
    var tagData = TaxonomyTagData.create({
      id: taxonomyItem.get('id'),
      title: taxonomyItem.get('title'),
      code: taxonomyItem.get('code'),
      description: taxonomyItem.get('description'),
      frameworkCode: subject.get('frameworkId')
    });

    switch (level) {
    case 2:
      tagData.setProperties({
        parentTitle: `${taxonomyItem.get('parent.title')} ${subject.get(
          'subjectTitle'
        )}`,
        taxonomyLevel: TAXONOMY_LEVELS.DOMAIN
      });
      break;
    case 3:
    case 4:
    case 5:
      tagData.setProperties({
        parentTitle: subject.get('subjectTitle'),
        taxonomyLevel: TAXONOMY_LEVELS.STANDARD
      });
      break;
    case 6:
      tagData.setProperties({
        parentTitle: taxonomyItem.get('parent.title'),
        taxonomyLevel: TAXONOMY_LEVELS.MICRO
      });
      break;
    }

    return tagData;
  },

  /**
   * Determines whether an ID looks like an ID for a learning target (micro-standard) or not
   * @param {String} id
   * @return {Boolean}
   */
  isMicroStandardId: function(id) {
    return /.*\d{2}-\d{2}/.test(id) || /.*\.\d{2}\.\d{2}\./.test(id);
  },

  /**
   * It returns only taxonomy tag data objects related to the subject
   * @param {TaxonomyRoot} subject
   * @param {TaxonomyTagData[]} tagDataList
   */
  filterBySubject: function(subject, tagDataList) {
    const id = subject.get('id');
    return tagDataList.filter(function(tagData) {
      return tagData.get('id').indexOf(id) >= 0;
    });
  },

  /**
   * It returns only taxonomy tag data objects non related to the subject
   * @param {TaxonomyRoot} subject
   * @param {TaxonomyTagData[]} tagDataList
   */
  filterByNotInSubject: function(subject, tagDataList) {
    const id = subject.get('id');
    return tagDataList.filter(function(tagData) {
      return tagData.get('id').indexOf(id) < 0;
    });
  }
});

export default TaxonomyTagData;
