import Ember from 'ember';

/**
 * Utility methods to parse gooru legacy urls
 * @typedef {object} GooruLegacyUrl
 */
export default Ember.Object.extend({
  /**
   * @property {string}
   */
  url: null,

  /**
   * Indicates if it is a gooru legacy url
   */
  isLegacyUrl: Ember.computed('ur', function() {
    const url = this.get('url');
    return /#([^&|^?]+)/gm.exec(url);
  }),

  /**
   * Indicates if it is a collection play url
   */
  isCollectionPlayer: Ember.computed.equal('module', 'collection-play'),

  /**
   * Indicates if it is a assessment play url
   */
  isAssessmentPlayer: Ember.computed.equal('module', 'assessment-play'),

  /**
   * Indicates if it is a resource play url
   */
  isResourcePlayer: Ember.computed.equal('module', 'resource-play'),

  /**
   * It contains the module name from the url
   * i.e #collection-play?id=1 would be collection-play
   * @property {string} application module
   */
  module: Ember.computed('url', function() {
    const url = this.get('url');
    const match = /#([^&|^?]+)/gm.exec(url);
    return match ? match[1].trim() : false;
  }),

  /**
   * It contains the id parameter
   * @property {string} id
   */
  id: Ember.computed('url', function() {
    const url = this.get('url');
    const match = /id=([^&]+)/gm.exec(url);
    return match ? match[1].trim() : false;
  }),

  /**
   * It contains the content id parameter
   * @property {string} id
   */
  contentId: Ember.computed('url', function() {
    const url = this.get('url');
    const match = /cid=([^&]+)/gm.exec(url);
    return match ? match[1].trim() : false;
  }),

  /**
   * Gets the route information
   * @property
   */
  routeParams: Ember.computed('url', function() {
    const legacyUrl = this;
    const id = legacyUrl.get('id');
    let params = null;
    if (this.get('isCollectionPlayer') || this.get('isAssessmentPlayer')) {
      const contentId = legacyUrl.get('contentId');
      const validContentId = contentId && contentId.indexOf('{') < 0; // sometimes it contains cid={1}
      const type = this.get('isCollectionPlayer') ? 'collection' : 'assessment';
      params =
        contentId && validContentId
          ? [
            'player',
            id,
            { queryParams: { resourceId: contentId, type: type } }
          ]
          : ['player', id, { queryParams: { type: type } }];
    } else if (this.get('isResourcePlayer')) {
      params = ['content.resources.play', legacyUrl.get('id')];
    } else {
      /*
        if there is non of the above, we assume it is a profile url
        i.e /#perezedify
       */
      params = ['profile', legacyUrl.get('module')];
    }

    return params;
  })
});
