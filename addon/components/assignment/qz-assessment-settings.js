import Ember from 'ember';
import {
  ASSESSMENT_SHOW_VALUES,
  MAX_ATTEMPTS
} from 'quizzes-addon/config/quizzes-config';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['qz-assessment-settings'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    onAnswerKeyChange: function(isChecked) {
      Ember.Logger.log('onAnswerKeyChange', isChecked);
    },

    onAttemptsChange: function(newValue) {
      Ember.Logger.log('onAttemptsChange', newValue);
    },
    onClassroomPlayEnabledChange: function() {
      Ember.Logger.log('onClassroomPlayEnabledChange');
    },
    onBackwardsChange: function(isChecked) {
      // TODO
      Ember.Logger.log('onBackwardsChange', isChecked);
    },
    onGenericChange: function() {
      Ember.Logger.log('onGenericChange');
    }
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * Options for attempts
   * @property {Array}
   */
  attemptsOptions: Ember.computed(function() {
    const options = [
      {
        id: -1,
        name: this.get('i18n').t('gru-settings-edit.attempts-unlimited')
      }
    ];
    for (let i = 1; i <= MAX_ATTEMPTS; i += 1) {
      options.push({
        id: i,
        name: i
      });
    }
    return options;
  }),

  /**
   * Options for feedback
   * @property {Map}
   */
  feedbackItems: ASSESSMENT_SHOW_VALUES,

  /**
   * Model to change settings to
   * @property {Object}
   */
  model: null,

  /**
   * Toggle Options
   * @property {Ember.Array}
   */
  switchOptions: Ember.A([
    Ember.Object.create({
      label: 'On',
      value: true
    }),
    Ember.Object.create({
      label: 'Off',
      value: false
    })
  ])
});
