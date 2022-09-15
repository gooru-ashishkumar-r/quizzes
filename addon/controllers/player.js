import Ember from 'ember';

export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Attributes

  queryParams: [
    'resourceId',
    'sourceId',
    'source',
    'isStudyPlayer',
    'pathId',
    'pathType',
    'ctxPathId',
    'isLTIResourceLinkLaunch'
  ],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {string} resourceId
   */
  resourceId: null,

  /**
   * @property {Collection} collection
   */
  collection: Ember.computed.alias('contextResult.collection'),

  /**
   * @property {ContextResult} contextResult
   */
  contextResult: null,

  /**
   * Indicates the component of the application that is originating the events
   * @property {String} source
   */
  source: null,

  /**
   * Indicates if it should show the back button
   * @property {boolean}
   */
  showBackButton: true,

  /**
   * @property {unit} unit
   */
  unit: null,

  /**
   * @property {lesson} lesson
   */
  lesson: null,

  /**
   * @property {class} classId
   */
  classId: null,

  /**
   * @property {class} class
   */
  course: null,

  /**
   * @property {String} It decide to show the back to collection or not.
   */
  showBackToCollection: false,

  /**
   * @property {String} It decide to show the back to course map or not.
   */
  showBackToCourseMap: false,

  /**
   * Indicates if it should default player header
   * @property {boolean}
   */
  showPlayerHeader: true,

  /**
   * @property {Array} list of suggested resources of a collection
   */
  suggestedResources: null,

  /**
   * @property {Boolean}
   * Property to find out whether study-player rendered or not
   */
  isStudyPlayer: false
});
