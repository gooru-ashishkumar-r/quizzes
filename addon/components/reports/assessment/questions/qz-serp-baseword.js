import Ember from 'ember';
import QuestionMixin from 'quizzes-addon/mixins/reports/assessment/questions/question';

/**
 * SERP Underline
 *
 * Component responsible for show the reorder, what option are selected
 * and the correct option.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend(QuestionMixin, {
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'questions', 'qz-serp-baseword'],

  // -------------------------------------------------------------------------
  // Properties
  didInsertElement() {
    if (this.get('baseAnswers').length) {
      this.get('baseAnswers').forEach((element, answerIndex) => {
        let userAnswer = this.get('userAnswer')
          ? this.get('userAnswer')[answerIndex]
          : null;
        for (let index = 0; index < element.correct_answer.length; index++) {
          const elements = JSON.parse(element.correct_answer[index]);
          let userEle = userAnswer ? JSON.parse(userAnswer.value)[index] : null;
          this.hightLightDefaultWord(elements, answerIndex, userEle);
        }
      });
    }
  },

  baseAnswers: Ember.computed.alias('question.resource.baseAnswers'),

  showCorrect: false,

  userAnswer: Ember.computed('question', function() {
    return this.get('question.answer');
  }),

  // ---------------------------------------------------------------
  // Methods

  hightLightDefaultWord(text, answerIndex, userEle) {
    var component = this;
    let innerHTML = '';
    let html = '';
    var start = text.start;
    var end = text.end;
    var fulltext = text.word_text;
    let isCorrect = true;

    if (!component.get('showCorrect')) {
      if (userEle) {
        isCorrect =
          userEle.word_text === fulltext &&
          userEle.word_text_type === text.word_text_type;
        start = userEle.start;
        end = userEle.end;
        fulltext = userEle.word_text;
      }
    }

    html = `<span class="serp-hl-text basword-select ${
      isCorrect ? 'correct' : 'wrong'
    } disable-select">${fulltext}</span>`;
    String.prototype.replaceBetween = function(start, end, what) {
      return this.substring(0, start) + what + this.substring(end);
    };
    component
      .$(`.base-word-edit-${answerIndex}`)[0]
      .childNodes.forEach(childNode => {
        if (
          childNode.data &&
          childNode.data.substring(start, end) === fulltext
        ) {
          innerHTML =
            innerHTML + childNode.data.replaceBetween(start, end, $.trim(html));
        } else if (childNode.data) {
          innerHTML = innerHTML + childNode.data;
        } else {
          innerHTML = innerHTML + childNode.outerHTML;
        }
      });
    component.$(`.base-word-edit-${answerIndex}`).html(innerHTML);
  }
});
