import Ember from 'ember';
import ResourceSerializer from 'quizzes-addon/serializers/resource/resource';
import CollectionModel from 'quizzes-addon/models/collection/collection';
import TaxonomySerializer from 'quizzes-addon/serializers/taxonomy/taxonomy';
import {
  ASSESSMENT_SHOW_VALUES,
  DEFAULT_IMAGES
} from 'quizzes-addon/config/quizzes-config';

/**
 * Serializer for Collection
 *
 * @typedef {Object} CollectionSerializer
 */
export default Ember.Object.extend({
  /**
   * @property {ResourceSerializer} resourceSerializer
   */
  resourceSerializer: null,

  session: Ember.inject.service('session'),

  taxonomySerializer: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'resourceSerializer',
      ResourceSerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'taxonomySerializer',
      TaxonomySerializer.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Normalize the Collection data into a Collection object
   * @param payload
   * @returns {Collection}
   */
  normalizeReadCollection: function(payload) {
    const serializer = this;
    const taxonomySerializer = serializer.get('taxonomySerializer');
    return CollectionModel.create(Ember.getOwner(this).ownerInjection(), {
      id: payload.id,
      ownerId: payload.ownerId,
      isCollection: payload.isCollection,
      resources: serializer.normalizeResources(payload.resources),
      settings:
        !payload.isCollection && payload.metadata
          ? serializer.normalizeSettings(payload.metadata.setting || {})
          : null,
      title: payload.metadata ? payload.metadata.title : '',
      standards:
        payload.metadata && payload.metadata.taxonomy
          ? taxonomySerializer.normalizeTaxonomyObject(
            payload.metadata.taxonomy
          )
          : []
    });
  },

  /**
   * Normalize the Collection data into a Collection object
   * @param payload
   * @returns {Collection}
   */
  normalizeGetCollection: function(payload) {
    const serializer = this;
    const taxonomySerializer = serializer.get('taxonomySerializer');
    const basePath = serializer.get('session.cdnUrls.content');
    const thumbnailUrl = payload.thumbnail
      ? basePath + payload.thumbnail
      : DEFAULT_IMAGES.COLLECTION;
    const metadata = payload.metadata || {};
    return CollectionModel.create(Ember.getOwner(this).ownerInjection(), {
      id: payload.target_collection_id || payload.id,
      pathId: payload.id,
      title: payload.title,
      learningObjectives: payload.learning_objective,
      isVisibleOnProfile:
        typeof payload.visible_on_profile !== 'undefined'
          ? payload.visible_on_profile
          : true,
      courseId: payload.target_course_id || payload.course_id,
      unitId: payload.target_unit_id || payload.unit_id,
      lessonId: payload.target_lesson_id || payload.lesson_id,
      creatorId: payload.creator_id,
      ownerId: payload.owner_id,
      collectionSubType: payload.target_content_subtype,
      metadata,
      centurySkills:
        metadata['21_century_skills'] && metadata['21_century_skills'].length
          ? metadata['21_century_skills']
          : [],
      format: payload.format || payload.target_content_type,
      taxonomy: payload.taxonomy
        ? taxonomySerializer.normalizeTaxonomyObject(payload.taxonomy)
        : [],
      thumbnailUrl: thumbnailUrl,
      content: payload.content
    });
  },

  /**
   * Normalize the Assesment data into Assesment object
   * @param payload
   * @returns {Assesment}
   */
  normalizeGetAssessment: function(payload) {
    const serializer = this;
    const taxonomySerializer = serializer.get('taxonomySerializer');
    const basePath = serializer.get('session.cdnUrls.content');
    const thumbnailUrl = payload.thumbnail
      ? basePath + payload.thumbnail
      : DEFAULT_IMAGES.ASSESSMENT;
    const metadata = payload.metadata || {};
    return CollectionModel.create(Ember.getOwner(this).ownerInjection(), {
      id: payload.target_collection_id || payload.id,
      pathId: payload.id,
      title: payload.title,
      learningObjectives: payload.learning_objective,
      isVisibleOnProfile:
        typeof payload.visible_on_profile !== 'undefined'
          ? payload.visible_on_profile
          : true,
      courseId: payload.target_course_id || payload.course_id,
      unitId: payload.target_unit_id || payload.unit_id,
      lessonId: payload.target_lesson_id || payload.lesson_id,
      creatorId: payload.creator_id,
      ownerId: payload.owner_id,
      collectionSubType: payload.target_content_subtype,
      metadata,
      centurySkills:
        metadata['21_century_skills'] && metadata['21_century_skills'].length
          ? metadata['21_century_skills']
          : [],
      format: payload.format || payload.target_content_type,
      taxonomy: payload.taxonomy
        ? taxonomySerializer.normalizeTaxonomyObject(payload.taxonomy)
        : [],
      questionCount: payload.question ? payload.question.length : 0,
      thumbnailUrl: thumbnailUrl,
      content: payload.question
    });
  },

  /**
   * Normalize the resources from a collection
   * @param payload
   * @returns {Resource}
   */
  normalizeResources: function(payload) {
    let resources = [];
    if (Ember.isArray(payload)) {
      resources = payload.map(resource =>
        this.get('resourceSerializer').normalizeReadResource(resource)
      );
      // Fix sequence value
      resources
        .sort((a, b) => a.get('sequence') - b.get('sequence'))
        .forEach((resource, i) => resource.set('sequence', i + 1));
    }
    return resources;
  },

  /**
   * Normalize the settings from a collection
   * @param setting
   * @returns {Object}
   */
  normalizeSettings: function(setting) {
    return {
      attempts: setting.attempts_allowed || -1,
      bidirectional: setting.bidirectional_play || false,
      showFeedback: setting.show_feedback || ASSESSMENT_SHOW_VALUES.SUMMARY,
      showKey: setting.show_key === ASSESSMENT_SHOW_VALUES.SUMMARY
    };
  }
});
