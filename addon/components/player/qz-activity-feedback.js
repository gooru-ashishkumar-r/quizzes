import Ember from 'ember';
import {
  EMOTION_VALUES,
  EMOTION_IMAGE,
  NO_REACTION
} from 'quizzes-addon/config/quizzes-config';
import { PARSE_EVENTS } from 'quizzes-addon/config/parse-event';
import TenantSettingsMixin from 'gooru-web/mixins/tenant-settings-mixin';

export default Ember.Component.extend(TenantSettingsMixin, {
  // -------------------------------------------------------------------------
  // Service

  /**
   * @requires service:session
   */
  session: Ember.inject.service('session'),

  /**
   * @property {Service} parseEvent service
   */
  parseEventService: Ember.inject.service('quizzes/api-sdk/parse-event'),

  // -------------------------------------------------------------------------
  // Observe

  /**
   * Observe the user feedback category
   */
  feedbackObserver: Ember.observer('isShowFeedback', function() {
    if (this.get('isShowFeedback')) {
      this.$('.feedback-content-body').slideDown();
      this.set('isShowBackdrop', true);
    }
  }),

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-activity-feedback resource-child'],

  // -------------------------------------------------------------------------
  // Events
  didInsertElement() {
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    });
    if (
      component.get('attemptData') &&
      component.get('attemptData.resourceResults') &&
      component.get('feedbackContent')
    ) {
      let currentResourceId = component.get('feedbackContent.id');
      let resourceResults = component.get('attemptData.resourceResults');
      let currentResource = resourceResults.findBy(
        'resourceId',
        currentResourceId
      );
      if (currentResource) {
        component.set('ratingScore', currentResource.get('reaction'));
      }
    }
  },

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Action triggered when the user change the emotion
     * @see qz-emotion-picker
     */
    changeEmotion: function(emotionScore) {
      let component = this;
      let unicode = component.selectedEmotionUnicode(emotionScore);
      component
        .$(`#emotion-${emotionScore}`)
        .find('svg use')
        .attr('xlink:href', `${EMOTION_IMAGE}#${unicode}`);
      this.sendAction('onChangeEmotion', emotionScore);
    },

    /**
     * Action triggered when the user click on feedback tab and hover the next button
     */
    onToggleFeedbackContent: function() {
      const component = this;
      component.$('.feedback-content-body').slideToggle();
      component.toggleProperty('isShowBackdrop');
      if (component.get('isShowBackdrop')) {
        component
          .get('parseEventService')
          .postParseEvent(PARSE_EVENTS.CLICK_FEEDBACK);
      }
    },

    onCloseFeedback: function() {
      this.sendAction('showFeedbackContainer');
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Indicates when the collection is already submitted
   * @property {boolean}
   */
  submitted: false,

  /**
   * Indicates when the back drop is shown
   * @property {boolean}
   */
  isShowBackdrop: false,

  /**
   * @property {string} on change emotion action
   */
  onChangeEmotion: 'onChangeEmotion',

  /**
   * @property {number} The rating score for the current resource
   */
  ratingScore: 0,

  /**
   * Indicates if changes can be made
   * @property {boolean} readOnly
   */
  readOnly: false,

  isShowReaction: Ember.computed('tenantSettingsObj', function() {
    let tenantSettings = this.get('tenantSettingsObj');
    return tenantSettings &&
      tenantSettings.ui_element_visibility_settings &&
      tenantSettings.ui_element_visibility_settings.show_reaction_only
      ? tenantSettings.ui_element_visibility_settings.show_reaction_only
      : false;
  }),

  // -------------------------------------------------------------------------
  //  Methods

  /**
   * Find selected emotion unicode from rating score
   * @type {{String}}
   */
  selectedEmotionUnicode: function(ratingScore) {
    if (ratingScore) {
      let selectedEmotion = EMOTION_VALUES.findBy('value', ratingScore);
      return selectedEmotion.unicode;
    }
    return NO_REACTION;
  }
});
