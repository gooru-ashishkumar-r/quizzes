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

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['serp-digraph'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  didInsertElement() {
    this._super(...arguments);
    const question = this.get('question');
    var exemplarAnswer = question.get('hint').exemplar_docs;
    for (let index = 0; index < question.baseAnswers.length; index++) {
      const element = question.baseAnswers[index];
      var data = exemplarAnswer.findBy('answer_text', element.answer_text);
      if (data) {
        element.exemplar_answer = data.correct_answer;
      }
    }
    let userAnswer = this.get('userAnswer');
    this.injectDigraph(question.baseAnswers, userAnswer);
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

  /**
   * @function injectDigraph
   * @param {Array} baseAnswers
   */
  injectDigraph(baseAnswers, userAnswer) {
    const component = this;
    var user = {
      userId: this.get('userId')
    };
    var content = {
      contentId: this.get('question.id'),
      contentTitle: this.get('question.title'),
      answers: baseAnswers,
      userAnswer: userAnswer
    };
    window.serp
      .languageDecode()
      .select('#serp-digraph-answer-container')
      .dataIn(user, null, content)
      .underline()
      .render()
      .listener(function(eventData) {
        component.handleDigraphAnswers(eventData.digraph_answers);
      });
  },

  /**
   * @function handleDigraphAnswers
   * @param {Array} digraphAnswers
   */
  handleDigraphAnswers(digraphAnswers) {
    if (
      digraphAnswers &&
      digraphAnswers.length &&
      digraphAnswers.length === this.get('question').baseAnswers.length
    ) {
      const answers = digraphAnswers.map(answer => {
        return {
          value: answer.selected_text.join()
        };
      });
      this.notifyAnswerCompleted(answers);
    }
  }
});
