import Ember from 'ember';
import { UPLOADABLE_TYPES } from 'quizzes-addon/config/quizzes-config';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['editor', 'assessment', 'qz-rubric-creation'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /***
     * Select tab option
     */
    selectOption: function(type) {
      this.set('showFromWeb', type === 'fromWeb');
      this.set('showFromComputer', type === 'fromComputer');
    },
    /***
     * Select file
     */
    selectFile: function(file) {
      //TODO
      this.set('rubric.file', file);
    },
    /***
     * Add URL
     */
    addURL: function(url) {
      if (this.get('showFromWeb')) {
        const resource = this.get('resource');
        resource.set('url', url);
      }
    }
  },

  // -------------------------------------------------------------------------
  // Properties
  /*** Indicates when then show from web option is visible
   * * @property {boolean}
   * */
  resource: Ember.Object.create({}),
  /**
   * Indicates when then show from web option is visible
   * @property {boolean}
   */
  showFromWeb: true,

  /**
   * Indicates when show from computer is visible
   * @property {boolean}
   */
  showFromComputer: false,

  /**
   * @type {String} list of all valid extension per quizzes/config/config#UPLOAD_TYPES
   */
  validExtensions: Ember.computed(function() {
    var extensions = UPLOADABLE_TYPES.map(
      typeObject => typeObject.validExtensions
    );
    return extensions.join(' ');
  })
});
