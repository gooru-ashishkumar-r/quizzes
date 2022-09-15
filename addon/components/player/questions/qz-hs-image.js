import Ember from 'ember';
import HSTextComponent from './qz-hs-text';
import ModalMixin from 'quizzes-addon/mixins/modal';

/**
 * Hot Spot Image
 *
 * Component responsible for controlling the logic and appearance of a hot spot
 * image question inside of the {@link player/qz-question-viewer.js}
 *
 * @module
 * @see controllers/player.js
 * @see components/player/qz-question-viewer.js
 * @augments components/player/questions/qz-hs-text.js
 */
export default HSTextComponent.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies
  i18n: Ember.inject.service(),

  /**
   * @property {Service} Configuration service
   */
  configurationService: Ember.inject.service('quizzes/configuration'),

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-hs-image'],

  // -------------------------------------------------------------------------
  // Properties

  isMobile: function() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      return true;
    } else {
      return false;
    }
  }.property(),

  longPressed: function(imgEl) {
    let parentEl = $(imgEl.target).parent(),
      parentEl$ = $(parentEl[0]),
      hoverCtx = parentEl$.find('.img-hover');

    hoverCtx.toggleClass('img-hover-none');
    hoverCtx.toggleClass('img-hover-flexed');
  },

  mouseDown: function(el) {
    var runOnce = Ember.run.later(this, this.get('longPressed'), el, 1000);
    this.set('pressed', runOnce);
  },

  mouseUp: function() {
    Ember.run.cancel(this.get('pressed'));
  },

  contextMenu: function(evt) {
    let parentEl = $(evt.target).parent(),
      parentEl$ = $(parentEl[0]),
      hoverCtx = parentEl$.find('.img-hover');
    hoverCtx.toggleClass('img-hover-none');
    hoverCtx.toggleClass('img-hover-flexed');
    evt.preventDefault();
    evt.stopPropagation();
    return false;
  },
  /**
   * @typedef answers
   * @property {String} value - answer value
   * @property {String} text - url string for an image
   */
  answers: Ember.computed.map('question.answers', function(answer) {
    const cdnURL = this.get(
      'configurationService.configuration.properties.cdnURL'
    );
    return {
      value: answer.get('value'),
      text: cdnURL + answer.get('text')
    };
  }),

  /**
   * @property {String} instructions - Question instructions
   */
  instructions: Ember.computed(function() {
    var action = this.get('i18n').t(this.get('instructionsActionTextKey'))
      .string;
    return this.get('i18n').t('qz-hs-image.instructions', { action });
  }),
  // -------------------------------------------------------------------------
  // Actions
  actions: {
    showImageModal: function(thumbnail) {
      this.actions.showModal.call(
        this,
        'player.qz-image-modal',
        {
          thumbnail: thumbnail,
          width: '90vw',
          height: '90vh',
          overflow: 'auto'
        },
        null,
        null,
        true
      );
    },
    selectAnswerImage: function() {
      console.log('li.selectAnswerImage', 'click'); //eslint-disable-line
    }
  },
  // -------------------------------------------------------------------------
  // Actions
  /**
   * Set answers and set click events on every answer to selected and unselected answers
   */
  setupSubscriptions: Ember.on('didInsertElement', function() {
    const component = this;
    const readOnly = component.get('readOnly');

    component.setUserAnswer();

    if (!readOnly) {
      if (component.get('userAnswer')) {
        component.notify(true);
      }
      this.$('li.answer').on('click', function(el) {
        const $this = $(this);
        const answerId = $this.data('id');
        if (
          el.target.className === 'bookmark' ||
          el.target.className === 'img-thumbnail' ||
          el.target.className ===
            'gru-icon check_circle material-icons ember-view'
        ) {
          var selected = component.get('selectedAnswers');
          const answer = selected.findBy('value', answerId);

          $this.toggleClass('selected');

          if (!answer) {
            selected.push({ value: answerId });
          } else {
            var idx = selected.indexOf(answer);
            selected.splice(idx, 1);
          }

          component.notify(false);
        }
      });
    }
  })
});
