import Ember from 'ember';
import TaxonomySerializer from 'quizzes-addon/serializers/taxonomy/taxonomy';
import Rubric from 'quizzes-addon/models/rubric/rubric';
import RubricCategory from 'quizzes-addon/models/rubric/rubric-category';

/**
 * Serializer to support the Rubric CRUD operations
 *
 * @typedef {Object} RubricSerializer
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  /**
   * @property {TaxonomySerializer} taxonomySerializer
   */
  taxonomySerializer: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'taxonomySerializer',
      TaxonomySerializer.create(Ember.getOwner(this).ownerInjection())
    );
  },
  /**
   * Normalizes a rubric
   * @param {*} data
   * @return {Rubric}
   */
  normalizeRubric: function(data, owners) {
    const serializer = this;
    const metadata = data.metadata || {};
    const ownerId = data.creator_id;
    const filteredOwners = Ember.A(owners).filterBy('id', ownerId);
    const categories = data.categories;
    const basePath = serializer.get('session.cdnUrls.content');
    const thumbnail = data.thumbnail ? basePath + data.thumbnail : null;
    const url =
      data.url && !data.isRemote ? basePath + data.url : data.url || null;

    return Rubric.create(Ember.getOwner(this).ownerInjection(), {
      id: data.id,
      title: data.title,
      description: data.description,
      thumbnail: thumbnail,
      standards: serializer
        .get('taxonomySerializer')
        .normalizeTaxonomyObject(data.taxonomy),
      audience: metadata.audience,
      url: url,
      isPublished: data.publishStatus === 'published',
      publishDate: data.publishDate,
      rubricOn: data.isRubric,
      uploaded: !data.isRemote,
      feedback: data.feedback,
      requiresFeedback: data.overallFeedbackRequired,
      categories: categories
        ? categories.map(category =>
          serializer.normalizeRubricCategory(category)
        )
        : null,
      owner: filteredOwners.get('length')
        ? filteredOwners.get('firstObject')
        : ownerId,
      createdDate: data.createdAt,
      updatedDate: data.updatedAt,
      tenant: data.tenant,
      grader: data.gradingType
    });
  },

  /**
   * Normalizes a rubric category
   * @param {*} data
   * @return {RubricCategory}
   *
   */
  normalizeRubricCategory(data) {
    const levels = data.levels || [];
    return RubricCategory.create(Ember.getOwner(this).ownerInjection(), {
      title: data.title,
      feedbackGuidance: data.feedback,
      requiresFeedback: data.requiredFeedback,
      allowsLevels: data.level,
      allowsScoring: data.scoring,
      levels: levels.map(function(level) {
        return { name: level.name, score: level.score || null };
      })
    });
  }
});
