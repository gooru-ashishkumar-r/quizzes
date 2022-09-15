import Ember from 'ember';
import { PARSE_EVENTS } from 'quizzes-addon/config/parse-event';

/**
 * Related Content
 *
 * Component responsible for showing related content.
 *
 * @module
 * @see controllers/player.js
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['related-content resource-child'],

  // -------------------------------------------------------------------------
  // Properties

  showRelatedContent: false,
  /**
   *Back drop for the related content
   */
  isShowBackdrop: false,

  /**
   * @property {Array} list of suggested resources of a collection
   */
  suggestedResources: null,

  /**
   * @property {String} classId - Class unique Id associated for the collection / assessment.
   */
  classId: null,

  /**
   * @property {String} courseId - course unique Id associated for the collection / assessment.
   */
  courseId: null,

  /**
   * @property {String} collectionUrl
   */
  collectionUrl: null,

  /**
   * @property {Service} parseEvent service
   */
  parseEventService: Ember.inject.service('quizzes/api-sdk/parse-event'),

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Action triggered when the user click related content tab.
     */
    onToggleRelatedContent() {
      this.toggleProperty('showRelatedContent');
      if (this.get('showRelatedContent')) {
        const context = {
          classId: this.get('classId')
        };
        this.get('parseEventService').postParseEvent(
          PARSE_EVENTS.CLICK_RELATED_CONTENT,
          context
        );
      }
    },

    /**
     * Action triggered when the user play a resource
     */
    onPlayResource(resource) {
      let collectionUrl = window.location.href;
      if (!this.get('collectionUrl')) {
        this.set('collectionUrl', collectionUrl);
      }
      let queryParams = {
        collectionUrl: this.get('collectionUrl')
      };
      let classId = this.get('classId');
      if (classId) {
        queryParams.classId = classId;
      }
      let isIframeMode = this.get('isIframeMode');
      if (isIframeMode) {
        queryParams.isIframeMode = isIframeMode;
      }
      this.get('router').transitionTo(
        'resource-player',
        this.get('courseId'),
        resource.id,
        {
          queryParams
        }
      );
    },

    clossRelatedContent() {
      this.sendAction('showRelatedContentContainer');
    }
  },

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Methods

  //--------------------------------------------------------------------------
  // Observer

  onChange: Ember.observer('showRelatedContent', function() {
    if (this.get('showRelatedContent')) {
      let component = this;
      component.$().animate(
        {
          bottom: '50px'
        },
        {
          complete: function() {
            // component.$().css('bottom', '50px');
            component.set('isShowBackdrop', true);
          }
        }
      );
    } else {
      let component = this;
      //check height and set bottom position based on orientation for mobile view
      let bottom = component.$().height() > 245 ? -385 : -150;
      component.$().animate(
        {
          bottom: `${bottom}px`
        },
        {
          complete: function() {
            // component.$().css('bottom', `${bottom}px`);
            component.set('isShowBackdrop', false);
          }
        }
      );
    }
  })
});
