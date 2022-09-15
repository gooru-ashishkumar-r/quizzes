import Ember from 'ember';
import QuestionComponent from 'quizzes-addon/components/player/questions/qz-question';

export default QuestionComponent.extend({
  // -------------------------------------------------------------------
  // Attributes

  classNames: ['qz-comprehension'],

  /**
   * @requires service:quizzes/configuration
   */
  configurationService: Ember.inject.service('quizzes/configuration'),

  /**
   * @type {ContextService} contextService
   * @property {Ember.Service} Service to send context related events
   */
  contextService: Ember.inject.service('quizzes/context'),

  // -------------------------------------------------------------------
  // Properties

  questionList: Ember.computed('question', function() {
    return this.get('question.subQuestions') || Ember.A([]);
  }),

  instructionsActionTextKey: null,

  questionResult: null,

  cdnURL: Ember.computed(function() {
    return this.get('configurationService.configuration.properties.cdnURL');
  }),

  contextResult: null,

  isFinished: Ember.computed('questionList.@each.isCompleted', function() {
    let questions = this.get('questionList');
    return questions.filterBy('isCompleted', true).length === questions.length;
  }),

  baseContext: Ember.computed(function() {
    return window.lastPlayedResource;
  }),

  resourceContext: Ember.computed('baseContext', function() {
    let context = this.get('baseContext');
    return context.resourceResult.copy();
  }),

  baseResource: null,

  subQuestionResults: Ember.computed('baseResource', function() {
    return this.get('baseResource.subQuestions');
  }),

  subStartTime: Ember.computed('resourceContext', function() {
    return this.get('resourceContext.startTime');
  }),

  watchQuestions: Ember.observer('questionList.@each.isCompleted', function() {
    let questions = this.get('questionList');

    let pendingQuestion = Ember.A([]);
    const pendingItem =
      questions.length - questions.filterBy('isCompleted', true).length;
    questions.map(question => {
      if (!(question.get('isCompleted') === true)) {
        pendingQuestion.push(question);
      }
    });

    if (
      (pendingItem === 1 &&
        (pendingQuestion[0].get('type') === 'text_entry' ||
          pendingQuestion[0].get('type') === 'extended_text')) ||
      (pendingItem === 0 && questions[0].get('type') === 'single_choice')
    ) {
      this.notifyAnswerCompleted([]);
    }
  }),

  // -------------------------------------------------------------------
  // Hooks

  // -----------------------------------------------------------------
  // Actions

  actions: {
    completeAnswer(question, answer, isVisible = false) {
      let component = this;
      let isFinished = component.get('isFinished');
      let questions = component.get('questionList');
      if (!isVisible && !isFinished) {
        component.startEvent(question, answer);
      }

      if (questions.length === 1 || questions.length === 0 || isFinished) {
        component.notifyAnswerCompleted([]);
      }
    }
  },

  // ------------------------------------------------------------------
  // Methods

  startEvent(question, answer) {
    let component = this;
    let context = component.get('baseContext');
    let contextId = context.contextId;
    let resourceId = question.id;
    let eventContext = context.eventContext;
    let baseResource = {
      id: context.resourceId
    };
    component
      .get('contextService')
      .startPlayResource(resourceId, contextId, eventContext, baseResource)
      .then(() => {
        component.stopEvent(question, answer);
      });
  },

  stopEvent(question, answer) {
    let component = this;
    let context = component.get('baseContext');
    let contextId = context.contextId;
    let resourceId = question.id;
    let eventContext = context.eventContext;
    let resourceResult = component.get('resourceContext');
    let subStartTime = component.get('subStartTime');
    context.resourceResult.set('isQuestion', false);
    resourceResult.setProperties({
      baseResourceId: context.resourceId,
      stopTime: new Date().getTime(),
      subStartTime: subStartTime,
      answer: answer,
      isQuestion: true,
      resourceId: question.id
    });

    component
      .get('contextService')
      .stopPlayResource(resourceId, contextId, resourceResult, eventContext)
      .then(() => {
        question.set('isCompleted', true);
        Ember.run.later(function() {
          let questions = component.get('questionList');
          let isFinished = component.get('isFinished')
            ? component.get('isFinished')
            : questions.filterBy('isCompleted', true).length ===
              questions.length;
          component.sendAction('onTriggerSubEvent', isFinished);
        }, 500);
      });
    component.set('subStartTime', new Date().getTime());
  }
});
