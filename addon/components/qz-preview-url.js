import Ember from 'ember';
import { toAbsolutePath } from 'quizzes-addon/utils/utils';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-preview-url'],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Number} the calculated resource content height
   */
  calculatedResourceContentHeight: null,

  /**
   * @property {Service} Configuration service
   */
  quizzesConfigurationService: Ember.inject.service('quizzes/configuration'),

  /**
   * @property {string} bind the height css style for the component
   */
  resourceHeight: Ember.computed('calculatedResourceContentHeight', function() {
    var height = this.get('calculatedResourceContentHeight');
    const heightString = height > 0 ? `${height}px` : '100%';
    return Ember.String.htmlSafe(`height: ${heightString}`);
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

  resource: null
});
