import Ember from 'ember';

/**
 * Taxonomy Tag
 *
 * Model of a visual representation of a taxonomy tag
 *
 * @typedef {Object} TaxonomyTag
 */
const TaxonomyTag = Ember.Object.extend({
  /**
   * @property {boolean} isActive - Is the state of the tag active or not?
   */
  isActive: false,

  /**
   * @property {boolean} isReadonly - Is the tag read-only or does it accept changes
   * to its state
   */
  isReadonly: false,

  /**
   * @property {boolean} isRemovable - Can the tag be removed or not?
   */
  isRemovable: false,

  /**
   * @property {TaxonomyTagData} data - Data for the taxonomy tag
   */
  data: null
});

TaxonomyTag.reopenClass({
  /**
   * Gets the taxonomy tags
   * @param {TaxonomyTagData[]} taxonomy
   * @param editable
   * @returns {Array}
   */
  getTaxonomyTags: function(
    taxonomy = [],
    editable = false,
    removable = false
  ) {
    return taxonomy.map(function(tagData) {
      return TaxonomyTag.create({
        isActive: false,
        isReadonly: !editable,
        isRemovable: removable,
        data: tagData
      });
    });
  }
});

export default TaxonomyTag;
