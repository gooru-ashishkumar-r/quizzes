import Ember from 'ember';

/**
 * Event Context model
 * typedef {Object} Context
 */
const EventContext = Ember.Object.extend({
  /**
   * @property {String} classId
   */
  classId: null,

  /**
   * @property {String} collectionId
   */
  collectionId: null,

  /**
   * @property {String} collectionSubType
   */
  collectionSubType: null,

  /**
   * @property {String} courseId
   */
  courseId: null,

  /**
   * @property {String} lessonId
   */
  lessonId: null,

  /**
   * @property {String} partnerId
   */
  partnerId: null,

  /**
   * @property {String} pathId
   */
  pathId: null,

  /**
   * @property {String} pathType
   */
  pathType: null,

  /**
   * @property {String} source
   */
  source: null,

  /**
   * @property {String} sourceUrl
   */
  sourceUrl: null,

  /**
   * @property {String} tenantId
   */
  tenantId: null,

  /**
   * @property {String} timezone
   */
  timezone: moment.tz.guess(),

  /**
   * @property {String} unitId
   */
  unitId: null
});

export default EventContext;
