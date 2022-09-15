import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {MediaService} mediaService
   * @property {Ember.Service} Service to work with media
   */
  mediaService: Ember.inject.service('quizzes/api-sdk/media'),

  /**
   * @requires service:session
   */
  session: Ember.inject.service('session'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['qz-evidence'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    //GRU-file-picker-events action
    selectFile: function(file) {
      const component = this;
      if (file) {
        component.set('isLoading', true);
        component
          .get('mediaService')
          .uploadContentFile(file)
          .then(function(filename) {
            let originalFileName = Ember.Object.create({
              fileName: filename,
              originalFileName: file.name
            });
            let objList = component.get('uploadedFiles');
            objList.pushObject(originalFileName);
            component.addEvidence();
          });
      }
    },

    removeSelectedFile: function(file) {
      if (file) {
        let objList = this.get('uploadedFiles');
        objList.removeObject(file);
        this.addEvidence();
      }
    },

    onShowPullUp: function(file) {
      this.set('activeFile', file);
      this.set('isShowFilePullUp', true);
    },

    onClosePullup: function() {
      this.set('activeFile', null);
      this.set('isShowFilePullUp', false);
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  isComprehension: false,

  uploadedFiles: Ember.A(),

  filePickerErrors: Ember.A(),

  isShowFilePullUp: false,

  activeFile: Ember.A(),

  isLoading: false,

  didInsertElement: function() {
    this.set('uploadedFiles', Ember.A());
    const $fileInput = this.$('input[type="file"]');
    if ($fileInput) {
      $fileInput.attr('title', 'uploadFile');
    }
    let questionResult = this.get('questionResult');
    if (
      questionResult &&
      questionResult.evidence &&
      questionResult.evidence.length
    ) {
      questionResult.evidence.forEach(item => {
        let originalFileName = Ember.Object.create({
          fileName: item.fileName,
          originalFileName: item.originalFileName
        });
        let objList = this.get('uploadedFiles');
        objList.pushObject(originalFileName);
      });
    }
    this.addEvidence();
  },

  // -------------------------------------------------------------------------
  // Methods

  addEvidence: function() {
    let component = this;
    let objList = this.get('uploadedFiles');
    const questionResult = this.get('questionResult');
    let evidenceList = Ember.A([]);
    if (objList && objList.length) {
      objList.map(evidence => {
        let cdnURL = component.get('session.cdnUrls.content');
        let stringWithURL = evidence.fileName;
        let removeURL = stringWithURL.replace(cdnURL, '');
        if (!stringWithURL.includes(cdnURL)) {
          evidence.fileName = cdnURL + evidence.fileName;
        }
        let originalFileName = {
          fileName: removeURL,
          originalFileName: evidence.originalFileName
        };
        evidenceList.pushObject(originalFileName);
      });
      questionResult.set('evidence', evidenceList);
    }
    component.set('isLoading', false);
  }
});
