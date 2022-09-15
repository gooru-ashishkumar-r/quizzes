import QuestionComponent from 'quizzes-addon/components/player/questions/qz-question';
import Ember from 'ember';
/**
 * SERP baseword question
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

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['serp-base-word'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  didInsertElement() {
    this._super(...arguments);
    let question = this.get('question');
    let baseAnswers = question.get('baseAnswers')
      ? question.get('baseAnswers')
      : [];
    const decodingExcercies = baseAnswers.map(baseAnswer => {
      let normalizeAns = baseAnswer.correct_answer.map(item => {
        return Ember.typeOf(item) === 'string' ? JSON.parse(item) : item;
      });
      return {
        answer_text: baseAnswer.answer_text,
        answer_type: baseAnswer.answer_type,
        base_words: normalizeAns
      };
    });
    // let baseAnswers = userAnswer.baseAnswers;
    this.injectSerpBaseWord(decodingExcercies);
  },

  init: function() {
    this._super(...arguments);
  },

  // -------------------------------------------------------------------------
  // Properties

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods

  injectSerpBaseWord(baseAnswers) {
    let component = this,
      userAnswered;
    var user = {
      userId: 'userId'
    };

    let userAnswerList = component.get('userAnswer');
    if (userAnswerList && userAnswerList.length) {
      userAnswered = userAnswerList.map(item => JSON.parse(item.value));
    }
    baseAnswers.forEach(baseAnswer => {
      baseAnswer.correct_answer = baseAnswer.base_words;
    });

    var content = {
      contentId: 'contentId',
      contentTitle: 'contentTitle',
      answers: baseAnswers,
      userAnswer: userAnswered
    };
    window.serp
      .languageDecode()
      .select('#serp-baseword-answer-container')
      .dataIn(user, null, content)
      .baseWord()
      .render()
      .listener(function(eventData) {
        eventData.selectedBaseWord.map((item, index) => {
          if (item && item.length === 0) {
            eventData.selectedBaseWord.removeObject(
              eventData.selectedBaseWord[index]
            );
          }
        });
        if (baseAnswers.length === eventData.selectedBaseWord.length) {
          const answer = eventData.selectedBaseWord.map(item => {
            return {
              value: JSON.stringify(item)
            };
          });

          component.notifyAnswerCompleted(answer);
        }
      });
  }
});
