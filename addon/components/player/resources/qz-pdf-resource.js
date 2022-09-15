import Ember from 'ember';
import ResourceComponent from 'quizzes-addon/components/player/resources/qz-resource';

/**
 * PDF resource component
 *
 * Component responsible for controlling the logic and appearance of the pdf resource type
 *
 * @module
 * @see controllers/player.js
 * @see components/player/qz-viewer.js
 * @augments Ember/Component
 **/
export default ResourceComponent.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-pdf-resource'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  pdfURL: Ember.computed('resource.assetUrl', function() {
    return this.get('resource.assetUrl');
  })

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
});
