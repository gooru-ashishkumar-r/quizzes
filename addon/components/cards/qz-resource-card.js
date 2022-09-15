import Ember from 'ember';
import ModalMixin from 'quizzes-addon/mixins/modal';
import TaxonomyTag from 'quizzes-addon/models/taxonomy/taxonomy-tag';
import TaxonomyTagData from 'quizzes-addon/models/taxonomy/taxonomy-tag-data';
import { toAbsolutePath } from 'quizzes-addon/utils/utils';

/**
 * Resource and Question card
 *
 * Component responsible of showing the resource or question information in cards, so that most useful information is summarized there.
 * @module
 */
export default Ember.Component.extend(ModalMixin, {
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['cards', 'qz-resource-card'],

  startTimer: null,

  timer: null,

  timerValue: 0,

  timerChanged: Ember.computed('startTimer', function() {
    if (this.startTimer === true) {
      this.timer = setInterval(() => {
        this.timerValue += 1;
      }, 1000);
    }
  }),
  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Action triggered to edit the resource/question
     */
    editResource: function() {
      this.sendAction('onEditResource', this.get('resource'));
    },
    /**
     * Action triggered to play the resource/question
     */
    playResource: function() {
      this.sendAction('onPlayResource', this.get('resource'));
    }
  },

  // -------------------------------------------------------------------------
  // Events

  didRender() {
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {Resource|Question} resource
   */
  resource: null,

  /**
   * Indicates if this resource is a question
   * @property {boolean}
   */
  isQuestion: Ember.computed.equal('resource.format', 'question'),

  /**
   * Indicates if the edit functionality is enabled
   * @property {boolean}
   */
  editEnabled: false,

  /**
   * Indicates if the remix functionality is enabled
   * @property {boolean}
   */
  remixEnabled: Ember.computed.not('editEnabled'),

  /**
   * @property {string} edit action
   */
  onEditResource: null,

  /**
   * @property {string} remix action
   */
  onRemixQuestion: null,

  /**
   * @property {Service} Configuration service
   */
  quizzesConfigurationService: Ember.inject.service('quizzes/configuration'),

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed('resource.standards.[]', function() {
    var standards = this.get('resource.standards');
    if (standards) {
      standards = standards.filter(function(standard) {
        // Filter out learning targets (they're too long for the card)
        return !TaxonomyTagData.isMicroStandardId(standard.get('id'));
      });
    }
    return TaxonomyTag.getTaxonomyTags(standards);
  }),
  /**
   * Show the publisher if the resource has publisher and is publish
   * @property {boolean}
   */
  showPublisher: Ember.computed('resource', function() {
    return this.get('resource').isPublished && this.get('resource').publisher;
  }),

  /**
   * @property {string} Resource URL
   */
  url: Ember.computed('resource.body', function() {
    const component = this;
    const resourceUrl = component.get('resource.body');
    const cdnUrl = component.get(
      'quizzesConfigurationService.configuration.properties.cdnURL'
    );
    return toAbsolutePath(resourceUrl, cdnUrl);
  }),
  destroy() {
    this._super(...arguments);
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
});
