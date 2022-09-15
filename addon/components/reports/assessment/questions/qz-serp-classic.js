import Ember from 'ember';
import QuestionMixin from 'quizzes-addon/mixins/reports/assessment/questions/question';

/**
 * SERP Classic
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

  classNames: ['reports', 'assessment', 'questions', 'qz-serp-classic'],

  // -------------------------------------------------------------------------
  // Properties

  showCorrect: false,

  userAnswers: Ember.computed('question.answer', function() {
    return this.get('question.answer').map(item => {
      return { correct_answer: item.value ? [item.value.slice(1, -1)] : [] };
    });
  }),

  baseAnswers: Ember.computed.alias('question.resource.baseAnswers'),

  // ----------------------------------------------------------------------
  // Events

  didInsertElement() {
    this.defaultHightlight();
  },

  // ------------------------------------------------------------------
  // Methods

  /**
   * Help to highlight existing answer
   */

  defaultHightlight() {
    let component = this;
    let answers = component.get('baseAnswers');
    let userAnswers = component.get('userAnswers');
    let looperObj = component.get('showCorrect') ? answers : userAnswers;
    looperObj.forEach((item, index) => {
      let answerEl = component.$(`.answer-edit-${index} .answer-item-text`);
      let answerText = item.correct_answer.length
        ? item.correct_answer[0]
        : item.text;
      let replacedText = answerText.replace(/(\[.?\])/gi, match => {
        return `<span class="${match.length > 2 ? 'active' : ''}">${
          match.length > 2 ? match[1] : '_'
        }</span>`;
      });
      answerEl.html(component.wrapLetters(replacedText));
    });
  },

  /**
   * Help to wrap span tag for each letters
   */
  wrapLetters(text) {
    let letterGroups = '';
    let childEl = $(`<p>${text}</p>`)[0].childNodes;
    childEl.forEach(item => {
      if (item.nodeName === '#text') {
        for (let i = 0; i < item.data.length; i++) {
          letterGroups += `<span>${item.data[i]}</span>`;
        }
        return;
      }
      letterGroups += item.outerHTML;
    });
    return letterGroups;
  }
});
