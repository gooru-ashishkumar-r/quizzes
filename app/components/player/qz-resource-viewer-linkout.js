import Ember from 'ember';
import Viewer from 'quizzes-addon/components/player/qz-resource-viewer';
import { toAbsolutePath } from 'quizzes-addon/utils/utils';

export default Viewer.extend({
  startTimer: null,

  /**
   * @property {Service} Configuration service
   */
  quizzesConfigurationService: Ember.inject.service('quizzes/configuration'),

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
  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Action triggered to play timer
     */
    playTimer: function() {
      this.set('startTimer', true);
    }
  }
});
