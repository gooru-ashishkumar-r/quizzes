import QuestionComponent from 'quizzes-addon/components/player/questions/qz-question';
import Ember from 'ember';

/**
 * SERP decoding question
 * Component responsible for controlling the logic and appearance of a true
 * or false question inside of the {@link player/qz-question-viewer.js}
 * @module
 * @see controllers/player.js
 * @see components/player/qz-question-viewer.js
 * @augments ember/Component
 */
export default QuestionComponent.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  session: Ember.inject.service('session'),

  /**
   * @type {MediaService} mediaService
   * @property {Ember.Service} Service to work with media
   */
  mediaService: Ember.inject.service('quizzes/api-sdk/media'),

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['serp-pick-n-choose'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  didInsertElement() {
    this._super(...arguments);
    const question = this.get('question');
    let baseAnswers = [];
    let userAnswer = [];
    let ansersList = this.get('question.answers');
    let userAnswerList = this.get('userAnswer');
    question.baseAnswers.forEach((answer, index) => {
      baseAnswers.push({
        answer_text: answer.answer_text,
        isCorrect: answer.is_correct === '1',
        id:
          ansersList[index] && ansersList[index].value
            ? ansersList[index].value
            : null
      });
    });
    if (userAnswerList && userAnswerList.length) {
      userAnswerList.forEach(item => {
        let answerData = baseAnswers.findBy('id', item.value);
        userAnswer.push(answerData);
      });
    }

    this.injectDecoding(baseAnswers, userAnswer);
  },

  init: function() {
    this._super(...arguments);
  },

  // -------------------------------------------------------------------------
  // Properties

  userId: Ember.computed.alias('session.userId'),

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods

  injectDecoding(baseAnswers, userAnswer) {
    const component = this;
    var user = {
      userId: this.get('userId')
    };
    var content = {
      contentId: this.get('question.id'),
      contentTitle: this.get('question.title'),
      answer_type: 'pick-n-choose',
      answers: baseAnswers,
      userAnswer: userAnswer
    };
    window.serp
      .languageDecode()
      .select('#serp-pick-n-choose-tool')
      .dataIn(user, null, content)
      .pickNChoose()
      .render()
      .listener(function(eventData) {
        let userAnswers = eventData.userAnswers;
        let results = userAnswers.filter(item => item.isCorrect);
        results = results.map(item => {
          return {
            value: item.id
          };
        });
        if (userAnswers.length) {
          component.notifyAnswerCompleted(results);
        }
      });
  }
});
