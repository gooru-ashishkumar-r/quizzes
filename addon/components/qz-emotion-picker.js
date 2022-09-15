import Ember from 'ember';
import { EMOTION_VALUES } from 'quizzes-addon/config/quizzes-config';

/**
 * Emotion picker
 *
 * Component responsible for letting the user select and update an emotion
 * from a predefined list of emotions
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['qz-emotion-picker'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Set a new emotion as selected and update the component appearance accordingly
     *
     * @function actions:setEmotion
     * @param {string} newEmotionValue - newly selected emotion
     * @returns {undefined}
     */
    setEmotion: function(newEmotion) {
      const component = this;
      let newEmotionValue = newEmotion.value;
      if (!component.get('readOnly')) {
        if (
          !component.get('selectedEmotion') ||
          component.get('selectedEmotion') !== newEmotionValue
        ) {
          component.selectEmotion(newEmotionValue);
          component.sendAction(
            'onChangeEmotion',
            component.get('selectedEmotion')
          );
        }
      }

      if (component.$('.close-nav').length > 0) {
        component.send('onCloseNavigator');
      }
    },

    onOpenNavigator() {
      let component = this;
      component.set('isNavigatorOpen', true);
      $('.emotions-list').slideDown();
    },

    onCloseNavigator() {
      let component = this;
      component.set('isNavigatorOpen', false);
      $('.emotions-list').slideUp();
    }
  },

  // -------------------------------------------------------------------------
  // Events

  /**
   * Overwrites didInsertElement hook.
   */
  didInsertElement: function() {
    this._super(...arguments);
    const component = this;
    const startEmotion = this.get('startEmotion');

    // Adds tooltip to UI elements (elements with attribute 'data-toggle')
    component.$('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    });
    // Sets the emotion icon if there is a score for this resource
    if (startEmotion) {
      Ember.run.scheduleOnce('afterRender', this, function() {
        component.selectEmotion(startEmotion);
      });
    }
  },

  didUpdate: function() {
    this._super(...arguments);
    const startEmotion = this.get('startEmotion');
    this.selectEmotion(startEmotion);
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * List of emotions to be displayed by the component
   *
   * @constant {Array}
   */
  emotionValues: EMOTION_VALUES,

  /**
   * @property {String|Function} onChangeEmotion - event handler for when the selected emotion is changed
   */
  onChangeEmotion: null,

  /**
   * @property {?string} selectedEmotion - selected emotion
   */
  selectedEmotion: 0,

  /**
   * @property {number} Initial emotion value
   */
  startEmotion: 0,

  /**
   * Indicates if changes can be made
   * @property {boolean}
   */
  readOnly: false,

  /**
   * Shows default emoji for mobile view
   * @property {String}
   */
  defaultEmoji: '1f625-inactive',

  isNavigatorOpen: false,
  // -------------------------------------------------------------------------
  // Methods

  selectEmotion: function(emotionValue) {
    let selectedAttr = this.$('.emotions-list li')
      .find('.active svg use')
      .attr('xlink:href');
    this.$('.emotions-list li')
      .find('.active svg use')
      .attr('xlink:href', `${selectedAttr}-inactive`);
    this.$('.emotions-list li')
      .find('.active')
      .removeClass('active');
    this.set('selectedEmotion', 0);
    if (emotionValue) {
      this.set('selectedEmotion', emotionValue);
      this.$(`.emotion-${emotionValue}`).toggleClass('active');
      let emotion = this.get('emotionValues').findBy('value', emotionValue);
      this.set('defaultEmoji', emotion.unicode);
      this.$('.emotions-list li')
        .find('.active svg use')
        .attr(
          'xlink:href',
          `/assets/quizzes-addon/emoji-one/emoji.svg#${emotion.unicode}`
        );
    }
  }
});
