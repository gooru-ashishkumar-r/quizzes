import Ember from 'ember';
import TaxonomyTag from 'quizzes-addon/models/taxonomy/taxonomy-tag';
import TaxonomyTagData from 'quizzes-addon/models/taxonomy/taxonomy-tag-data';
import {
  PLAYER_EVENT_MESSAGE,
  CONTENT_TYPES
} from 'quizzes-addon/config/quizzes-config';
import TenantSettingsMixin from 'gooru-web/mixins/tenant-settings-mixin';

export default Ember.Component.extend(TenantSettingsMixin, {
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['qz-player-confirmation'],
  classNameBindings: ['isShowSuggestion:show-suggestion'],

  // -------------------------------------------------------------------------
  // Service

  /**
   * @type {CollectionService} collectionService
   * @property {Ember.Service} Service to retrieve a collection|assessment
   */
  collectionService: Ember.inject.service('quizzes/collection'),

  // /**
  //  * @property {AssessmentService} Service to retrieve an assessment
  //  */
  // assessmentService: Ember.inject.service('api-sdk/assessment'),
  //
  // /**
  //  * @property {CollectionService} Service to retrieve a collection
  //  */
  // collectionService: Ember.inject.service('api-sdk/collection'),

  // collectionObserver: Ember.observer('context', function() {
  //   const component = this;
  //   component.fetchConfirmationInfo();
  // }),

  // -------------------------------------------------------------------------
  // Events
  // didInsertElement() {
  //   const component = this;
  //   // component.fetchConfirmationInfo();
  // },

  didRender() {
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    });
  },

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    // //Action triggered when click on the start
    // start() {
    //   this.sendAction('onStartPlayer');
    // },
    //
    // playNext() {
    //   this.sendAction('onPlayNext');
    // },
    // emptyNextPlay() {
    //   this.sendAction('onEmptyNextPlay');
    // },
    // onExit() {
    //   window.parent.postMessage(PLAYER_EVENT_MESSAGE.GRU_PUllUP_CLOSE, '*');
    // },

    //Action triggered when click on the cancel
    cancel() {
      let component = this;
      let transitionTo = this.get('source');
      let isIframeMode = component.get('isIframeMode');
      if (isIframeMode) {
        window.parent.postMessage(PLAYER_EVENT_MESSAGE.GRU_PUllUP_CLOSE, '*');
      } else {
        component.sendAction('onClosePlayer', transitionTo);
      }
    },

    showTimer() {
      this.sendAction('showTimer');
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {number} currentAttempts
   */
  attempts: null,

  attemptsLeft: Ember.computed('attempts', 'collection.attempts', function() {
    return this.get('collection.attempts') - this.get('attempts');
  }),

  /**
   * @property {Collection} collection
   */
  collection: null,

  /**
   * @property {Context} context
   */
  context: null,

  /**
   * @property {boolean} flag for determining button behaviour
   */
  disableStart: Ember.computed('unlimited', 'noMoreAttempts', function() {
    return !this.get('unlimited') && this.get('noMoreAttempts');
  }),

  /**
   * @property {Boolean} Indicate if the context has more attempts available
   */
  noMoreAttempts: Ember.computed(
    'collection.isAssessment',
    'collection.attempts',
    'attempts',
    function() {
      return (
        this.get('collection.isAssessment') &&
        this.get('collection.attempts') > 0 &&
        this.get('attempts') &&
        this.get('attempts') >= this.get('collection.attempts')
      );
    }
  ),
  contentType: Ember.computed('collection', function() {
    let collection = this.get('collection');
    let contentType = collection.get('isCollection')
      ? CONTENT_TYPES.COLLECTION
      : CONTENT_TYPES.ASSESSMENT;
    return contentType;
  }),
  playAttempts: Ember.computed(
    'collection',
    'lesson',
    'lessonList',
    'unitList',
    function() {
      const component = this;
      const collection = component.get('collection');
      const lesson = component.get('lesson');
      const lessonDetails = component.get('lessonList');
      const unitList = component.get('unitList');
      const lessonLength = lessonDetails.length;
      const activeLesson = lessonDetails.findBy('id', lesson.get('id'));
      const lIndex = lessonDetails.findIndex(
        item => item.id === lesson && lesson.get('id')
      );
      const lessonIndex = lIndex + 1;
      const unitLength = unitList.length;
      const uIndex = unitList.findIndex(
        item => item.id === activeLesson && activeLesson.get('unit_id')
      );
      const unitIndex = uIndex + 1;
      const lessonData = lesson.get('children');
      const collectionLength = lessonData.length;
      const activeCollection = lessonData.findBy('id', collection.get('id'));
      const cIndex = lessonData.findIndex(
        item => item.id === collection && collection.get('id')
      );
      const collectionIndex = cIndex + 1;
      const isMilestoneLesson = lesson && lesson.get('isMilestoneLesson');
      return isMilestoneLesson
        ? true
        : activeCollection &&
            activeCollection.get('resourceCount') === 0 &&
            activeCollection &&
            activeCollection.get('questionCount') === 0 &&
            unitIndex === unitLength &&
            lessonLength === lessonIndex &&
            collectionLength === collectionIndex;
    }
  ),
  /**
   * @property {boolean} flag for determining unlimited behaviour
   */
  unlimited: Ember.computed.equal('collection.attempts', -1),

  isCollectionConfirmation: Ember.computed('collection', function() {
    let component = this;
    return component.get('collection.isCollection');
  }),

  /**
   * @property {Boolean}
   * Is suggested content
   */
  isSuggestedContent: Ember.computed('pathType', function() {
    let component = this;
    let pathType = component.get('pathType');
    return pathType === 'teacher' || pathType === 'system';
  }),

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed('confirmationInfo', function() {
    let standards = this.get('confirmationInfo.taxonomy');
    if (standards) {
      standards = standards.filter(function(standard) {
        // Filter out learning targets (they're too long for the card)
        return !TaxonomyTagData.isMicroStandardId(standard.get('id'));
      });
      return TaxonomyTag.getTaxonomyTags(standards);
    }
  }),

  // /**
  //  * Property used to  identify whether collection object has items to play.
  //  */
  // hasCollectionItems: Ember.computed('confirmationInfo', function() {
  //   let resourceCount = this.get('confirmationInfo.resourceCount');
  //   let questionCount = this.get('confirmationInfo.questionCount');
  //   let hasCollectionItems = false;
  //   let isCollection = this.get('isCollectionConfirmation');
  //   if (isCollection && (resourceCount > 0 || questionCount > 0)) {
  //     hasCollectionItems = true;
  //   } else if (questionCount > 0) {
  //     hasCollectionItems = true;
  //   }
  //   return hasCollectionItems;
  // }),

  /**
   * Maintains the state of data loading
   * @type {Boolean}
   */
  isLoading: false

  // // -------------------------------------------------------------------------
  // // Methods
  //
  // /**
  //  * @function fetchConfirmationInfo
  //  * Method to fetch confirmation info data
  //  */
  // fetchConfirmationInfo() {
  //   let component = this;
  //   let collection = component.get('collection');
  //   let isCollectionConfirmation = component.get('isCollectionConfirmation');
  //   component.set('isLoading', true);
  //   if (isCollectionConfirmation) {
  //     component.getCollection(collection.id).then(function(collectionInfo) {
  //       console.log(collectionInfo,'collectionInfo');
  //       if (!component.get('isDestroyed')) {
  //         let contentCount = component.getResourceQuestionCount(
  //           collection.resources
  //         );
  //         collection.resources.forEach(r => {
  //           let taxonomy = collectionInfo.content.findBy('id', r.id);
  //           if (taxonomy) {
  //             r.standards = component.tempSerializeResourceTaxonomy(
  //               taxonomy.taxonomy
  //             );
  //           }
  //         });
  //         collectionInfo.questionCount = contentCount.questionCount;
  //         collectionInfo.resourceCount = contentCount.resourceCount;
  //         component.set('confirmationInfo', collectionInfo);
  //         component.set('isLoading', false);
  //       }
  //     });
  //   } else {
  //     component.getAssessment(collection.id).then(function(assessmentInfo) {
  //       if (!component.get('isDestroyed')) {
  //         component.set('confirmationInfo', assessmentInfo);
  //         component.set('isLoading', false);
  //       }
  //     });
  //   }
  // },
  //
  // tempSerializeResourceTaxonomy(taxonomy) {
  //   if (taxonomy) {
  //     return Array.from(Object.keys(taxonomy), function(k) {
  //       var taxonomyObject = taxonomy[k];
  //       taxonomyObject.id = k;
  //       taxonomyObject.title = taxonomyObject.code;
  //       taxonomyObject.caption = taxonomyObject.code;
  //       taxonomyObject.data = taxonomyObject;
  //       return Ember.Object.create(taxonomyObject);
  //     });
  //   }
  // },
  //
  // /**
  //  * @function getCollection
  //  * Get a collection by Id
  //  */
  // getCollection(collectionId) {
  //   const component = this;
  //   // component.get('collectionService').readCollection(collectionId)
  //   const collectionPromise = Ember.RSVP.resolve(
  //     component.get('collectionService').getCollection(collectionId)
  //   );
  //   return Ember.RSVP.hash({
  //     collection: collectionPromise
  //   }).then(function(hash) {
  //     return hash.collection;
  //   });
  // },
  //
  // /**
  //  * @function getAssessment
  //  * Get an assessment by Id
  //  */
  // getAssessment(assessmentId) {
  //   const component = this;
  //   // component.get('assessmentService').readAssessment(assessmentId)
  //
  //   const assessmentPromise = Ember.RSVP.resolve(
  //       component.get('collectionService').getAssessment(assessmentId)
  //   );
  //   return Ember.RSVP.hash({
  //     assessment: assessmentPromise
  //   }).then(function(hash) {
  //     return hash.assessment;
  //   });
  // },
  //
  // /**
  //  * @function getResourceQuestionCount
  //  * Method to get resource and question count from the collection
  //  */
  // getResourceQuestionCount(resources) {
  //   let questionCount = 0;
  //   let resourceCount = 0;
  //   if (Ember.isArray(resources)) {
  //     resources.map(resource => {
  //       if (resource.isResource) {
  //         resourceCount++;
  //       } else {
  //         questionCount++;
  //       }
  //     });
  //   }
  //   return {
  //     questionCount,
  //     resourceCount
  //   };
  // }
});
