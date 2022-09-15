import Ember from 'ember';
import {
  RESOURCE_COMPONENT_MAP,
  CONTENT_TYPES
} from 'quizzes-addon/config/quizzes-config';
import ResourceResult from 'quizzes-addon/models/result/resource';
import { generateUUID } from 'quizzes-addon/utils/utils';

/**
 * Player question viewer
 *
 * Component responsible for providing a frame where all question types
 * will be displayed i.e. it will be responsible for selecting any specific
 * question components per question type.
 *
 * @module
 * @see controllers/player.js
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['qz-resource-viewer'],

  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {resourceService} resourceService
   * @property {Ember.Service} Service to send resource events
   */
  quizzesResourceService: Ember.inject.service('quizzes/resource'),

  session: Ember.inject.service('session'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Action triggered when the next button is clicked
     */
    next: function() {
      this.set('isNextDisabled', true);
      const resourceResult = this.get('resourceResult');
      const eventContext = this.get('eventContext');
      resourceResult.set('stopTime', new Date().getTime());
      this.get('quizzesResourceService').sendFinishResource(
        this.get('resource.id'),
        resourceResult,
        eventContext
      );
      this.sendAction('onNext');
    }
  },

  // -------------------------------------------------------------------------
  // Events

  init: function() {
    this._super(...arguments);
    const resource = this.get('resource');
    if (resource) {
      const resourceResult = ResourceResult.create(
        Ember.getOwner(this).ownerInjection(),
        {
          resourceId: resource.resourceId,
          reaction: 0,
          startTime: new Date().getTime()
        }
      );
      this.set('resourceResult', resourceResult);
    }
  },

  /**
   * DidInsertElement ember event
   */
  didInsertElement: function() {
    this.setNarrationEffect();
    this.calculateResourceContentHeight();
  },

  didReceiveAttrs() {
    const component = this;
    /**
     * method used to listen the events from iframe.
     **/
    function receiveMessage(event) {
      let eventContent = Ember.A([]);
      if (event.data.message === 'xAPI_event') {
        let eventData = event.data.eventData;
        eventData.id = generateUUID();
        eventData.resourceId = component.get('resource.id');
        eventData.timestamp = new Date();
        (eventData.userId = component.get('session.userId')),
        (eventData.source = component.get('source'));
        eventData.collectionId = component.get('collection.id');
        eventData.tenantId = component.get('session.tenantId');
        eventData.classId = component.get('classId');
        eventData.collectionType = component.get('collection.isCollection')
          ? CONTENT_TYPES.COLLECTION
          : CONTENT_TYPES.ASSESSMENT;
        eventData.sessionId = component.get('sessionId');
        if (component.get('isStudyPlayer')) {
          eventData.courseId = component.get('courseId');
          eventData.unitId = component.get('unit.id');
          eventData.lessonId = component.get('lesson.id');
        } else {
          eventData.dcaId = component.get('dcaId');
        }
        eventContent.push(eventData);
        component.loopFun(eventContent);
        component.get('quizzesResourceService').createxAPIEvent(eventContent);
      }
    }

    if (component.get('isStudent') && component.get('isStudyPlayer')) {
      window.addEventListener('message', receiveMessage, false);
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {EventContext} eventContext
   */
  eventContext: null,

  /**
   * Disable next button
   * @property {Boolean} sendEvents
   */
  isNextDisabled: false,

  /**
   * Indicates if the current resource type is a link out
   * @property {boolean}
   */
  isNotIframeUrl: Ember.computed('resource', function() {
    const resource = this.get('resource');
    return resource && resource.displayGuide;
  }),

  /**
   * The resource playing
   * @property {Resource} resource
   */
  resource: null,

  /**
   * The resource component selected
   * @property {string}
   */
  resourceComponentSelected: Ember.computed('resource.id', function() {
    const resourceType = this.get('resource.isImageResource')
      ? 'image'
      : this.get('resource.resourceType');
    var component = RESOURCE_COMPONENT_MAP[resourceType];

    if (!component) {
      Ember.Logger.error(
        `Resources of type ${resourceType} are currently not supported`
      );
    } else {
      Ember.Logger.debug('Resources component selected: ', component);
      return component;
    }
  }),

  /**
   * @property {ResourceResult} resourceResult
   */
  resourceResult: null,

  /**
   * Show the next button and send events
   * @property {Boolean} sendEvents
   */
  sendEvents: false,

  /**
   * Show the narration section
   * @property {Boolean} showNarration
   */
  showNarration: true,

  isH5PContent: Ember.computed('resource', function() {
    return (
      this.get('resource.format') === 'h5p_interactive_video' ||
      this.get('resource.format') === 'h5p_interactive_slide' ||
      this.get('resource.format') === 'h5p_interactive_personality_quiz' ||
      this.get('resource.format') === 'h5p_drag_and_drop_resource'
    );
  }),

  /**
   * @property {String}
   */
  accessToken: Ember.computed.alias('session.token-api3'),

  contentURL: Ember.computed('isH5PContent', function() {
    if (this.get('isH5PContent')) {
      let accessToken = this.get('accessToken');
      let resourceId = this.get('resource.id');
      let resourceType = this.get('resource.format');
      let resourceScore = this.get('resource.showScore');
      let format = 'resource';
      let contentURL = `${window.location.protocol}//${window.location.host}/tools/h5p/play/${resourceId}?accessToken=${accessToken}&contentType=${resourceType}&format=${format}&showScore=${resourceScore}`;
      return contentURL;
    }
  }),

  // -------------------------------------------------------------------------
  // Observers

  /**
   * Observes for the resource change
   */
  resourceObserver: function() {
    this.calculateResourceContentHeight();
  }.observes('resource.id'),

  // -------------------------------------------------------------------------
  // Methods

  loopFun: function(arryList) {
    const loopFun = arryList => {
      arryList.forEach(item => {
        if (item instanceof Object) {
          Object.keys(item).map(key => {
            let value = item[key];
            if (key.indexOf('.') !== -1) {
              let keyValue = key.replace(/\./g, '~dot~');
              item[keyValue] = value;
              delete item[key];
            }
          });
          loopFun(Object.values(item));
        }
      });
    };
    loopFun(arryList);
  },

  /**
   * Calculates the height of the content area (it will change depending on height
   * of the narration -if there is one)
   */
  calculateResourceContentHeight: function() {
    if (
      this.get('resource.isUrlResource') ||
      this.get('resource.isPDFResource') ||
      (this.get('resource.isImageResource') &&
        this.get('isNotIframeUrl') === false)
    ) {
      var narrationHeight = 0;
      if (this.get('showNarration') === true) {
        narrationHeight = this.$('.narration').innerHeight();
      }

      var contentHeight = $('.qz-content').height();

      // The 4 pixels subtracted are to make sure no scroll bar will appear for the content
      // (Users should rely on the iframe scroll bar instead)
      this.set(
        'calculatedResourceContentHeight',
        contentHeight - narrationHeight - 4
      );
    }
  },
  /**
   * Set jquery effect to narration
   * */
  setNarrationEffect: function() {
    $('.narration').effect('highlight', { color: '#84B7DD' }, 2000);
  },

  /**
   * The protocol the user is using to access the page (http or https)
   * @property {String}
   */
  currentProtocol: window.location.protocol,

  /**
   * The protocol for the resource url
   * @property {String}
   */
  resourceProtocol: Ember.computed('resource.url', function() {
    const httpsPattern = /^(https:\/\/)/;
    const cdnPattern = /^(\/\/cdn.gooru.org\/)/;
    let httpsResult = httpsPattern.test(this.get('resource.body'));
    let cdnResult = cdnPattern.test(this.get('resource.body'));
    let resultProtocol =
      httpsResult === true || cdnResult === true ? 'https:' : 'http:';
    return resultProtocol;
  }),

  /**
   * Check it can be render inside player or not
   * @property {boolean}
   */

  isLinkOut: Ember.computed('resource', function() {
    let currentProtocol = this.get('currentProtocol');
    let resourceProtocol = this.get('resourceProtocol');
    if (
      currentProtocol === 'https:' &&
      resourceProtocol === 'http:' &&
      this.get('resource').type !== 'html_resource'
    ) {
      return true;
    }
    return false;
  }),

  /**
   * @property {boolean} isNextEnabled make ture by default for resource types
   */
  isNextEnabled: true
});
