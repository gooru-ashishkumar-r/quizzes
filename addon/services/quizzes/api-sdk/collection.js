import Ember from 'ember';
import CollectionSerializer from 'quizzes-addon/serializers/collection/collection';
import CollectionAdapter from 'quizzes-addon/adapters/collection/collection';

/**
 * @typedef {Object} CollectionService
 */
export default Ember.Service.extend({
  /**
   * @property {Profile} Profile service
   */
  profileService: Ember.inject.service('quizzes/profile'),

  /**
   * @property {Profile} Profile service
   */
  taxonomyService: Ember.inject.service('quizzes/api-sdk/taxonomy'),

  /**
   * @property {CollectionSerializer} collectionSerializer
   */
  collectionSerializer: null,

  /**
   * @property {CollectionAdapter} collectionAdapter
   */
  collectionAdapter: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'collectionSerializer',
      CollectionSerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'collectionAdapter',
      CollectionAdapter.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Gets a Collection by id
   * @param {string} collectionId
   * @param {string} type collection|assessment
   * @param {boolean} refresh
   * @returns {Promise.<Collection>}
   */
  readCollection: function(
    collectionId,
    type,
    refresh = false,
    isDefaultShowFW,
    classFramework
  ) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('collectionAdapter')
        .readCollection(collectionId, type, refresh)
        .then(function(responseData) {
          let collection = service
            .get('collectionSerializer')
            .normalizeReadCollection(responseData);
          if (isDefaultShowFW) {
            let taxonomyIds = [];
            let taxonomyId = collection.standards.map(data => data.taxonomyId);
            taxonomyIds = taxonomyIds.concat(taxonomyId);
            if (taxonomyIds.length) {
              service
                .getcrosswalkCompetency(collection, classFramework, taxonomyIds)
                .then(function() {
                  resolve(collection);
                });
            } else {
              resolve(collection);
            }
          } else {
            resolve(collection);
          }
        }, reject);
    });
  },

  findResourcesByCollectionforDCA: function(
    sessionId,
    collectionId,
    classId,
    userId,
    collectionType,
    date
  ) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('collectionAdapter')
        .queryRecordForDCA({
          sessionId: sessionId,
          collectionId: collectionId,
          classId: classId,
          userId: userId,
          collectionType: collectionType,
          date: date,
          startDate: date,
          endDate: date
        })
        .then(
          function(payload) {
            resolve(payload);
          },
          function(error) {
            reject(error);
          }
        );
    });
  },

  findAssessmentResultByCollectionAndStudent: function(
    collectionType,
    collectionId,
    userId,
    sessionId
  ) {
    const service = this;
    const params = {
      collectionType: collectionType,
      contentId: collectionId,
      userId: userId,
      sessionId: sessionId
    };
    return new Ember.RSVP.Promise(function(resolve) {
      return service
        .get('collectionAdapter')
        .queryRecord(params)
        .then(
          function(payload) {
            resolve(payload);
          },
          function() {
            resolve(undefined);
          }
        );
    });
  },

  /**
   * Gets a Collection by id
   * @param {string} collectionId
   * @returns {Promise.<Collection>}
   */
  getCollection: function(collectionId, classFramework, isDefaultShowFW) {
    const service = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('collectionAdapter')
        .getCollection(collectionId)
        .then(function(responseData) {
          let collection = service
            .get('collectionSerializer')
            .normalizeGetCollection(responseData);
          let profileService = service.get('profileService');
          if (window && window.sourceDetailsNoteTool) {
            window.sourceDetailsNoteTool.unit_id = collection.get('unitId');
            window.sourceDetailsNoteTool.lesson_id = collection.get('lessonId');
          }
          let taxonomyIds = [];
          let taxonomyId = collection.taxonomy.map(data => data.taxonomyId);
          taxonomyIds = taxonomyIds.concat(taxonomyId);
          Ember.RSVP.hash({
            getcrosswalkCompetency:
              isDefaultShowFW && taxonomyIds.length
                ? service.getcrosswalkCompetency(
                  collection,
                  classFramework,
                  taxonomyIds
                )
                : [],
            profile: profileService.readUserProfile(collection.get('ownerId'))
          }).then(function(hash) {
            collection.set('owner', hash.profile);
            resolve(collection);
          });
        }, reject);
    });
  },

  /**
   * Gets a Assesment by id
   * @param {string} collectionId
   * @returns {Promise.<Collection>}
   */

  getAssessment: function(collectionId, classFramework, isDefaultShowFW) {
    const service = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('collectionAdapter')
        .getAssessment(collectionId)
        .then(function(responseData) {
          let assessment = service
            .get('collectionSerializer')
            .normalizeGetAssessment(responseData);
          let profileService = service.get('profileService');
          if (window && window.sourceDetailsNoteTool) {
            window.sourceDetailsNoteTool.unit_id = assessment.get('unitId');
            window.sourceDetailsNoteTool.lesson_id = assessment.get('lessonId');
          }
          let taxonomyIds = [];
          let taxonomyId = assessment.taxonomy.map(data => data.taxonomyId);
          taxonomyIds = taxonomyIds.concat(taxonomyId);
          Ember.RSVP.hash({
            getcrosswalkCompetency:
              isDefaultShowFW && taxonomyIds.length
                ? service.getcrosswalkCompetency(
                  assessment,
                  classFramework,
                  taxonomyIds
                )
                : [],
            profile: profileService.readUserProfile(assessment.get('ownerId'))
          }).then(function(hash) {
            assessment.set('owner', hash.profile);
            resolve(assessment);
          });
        }, reject);
    });
  },
  /**
   * Notifies a collection change
   * @param {string} collectionId
   * @param {string} type collection|assessment
   * @returns {Promise.<boolean>}
   */
  notifyCollectionChange: function(collectionId, type) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve) {
      service.readCollection(collectionId, type, true).then(
        function() {
          resolve();
        },
        function() {
          resolve();
        }
      );
    });
  },

  getcrosswalkCompetency: function(collection, classFramework, taxonomyIds) {
    const service = this;
    let taxonomyService = service.get('taxonomyService');
    return taxonomyService
      .crosswalkCompetency(classFramework, taxonomyIds)
      .then(function(crosswalkResponse) {
        let frameworkCrossWalkComp = crosswalkResponse;
        let collectionStandrs = collection.taxonomy || collection.standards;
        collectionStandrs.map(standard => {
          let taxonomyData = frameworkCrossWalkComp.findBy(
            'sourceDisplayCode',
            standard.code
          );
          if (taxonomyData) {
            standard.code = taxonomyData.targetDisplayCode;
            standard.frameworkCode = taxonomyData.targetFrameworkId;
          }
        });
      });
  }
});
