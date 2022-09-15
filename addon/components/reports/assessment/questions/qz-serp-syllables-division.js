import Ember from 'ember';
import QuestionMixin from 'quizzes-addon/mixins/reports/assessment/questions/question';

/**
 * SERP Encoding Assessment
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

  classNames: ['reports', 'assessment', 'questions', 'qz-syllables-division'],

  // -------------------------------------------------------------------------
  // Properties

  showCorrect: false,

  answers: Ember.computed.alias('question.answer'),

  baseAnswers: Ember.computed.alias('question.resource.baseAnswers'),

  // -----------------------------------------------------------------------
  // Events

  didInsertElement() {
    let component = this;
    let baseAnswers = this.get('baseAnswers');
    baseAnswers.forEach((item, answerIndex) => {
      component
        .$(`.syllables-division-edit-${answerIndex}`)
        .html(component.wrapLetters(item.answer_text));
      let userAnswer =
        this.get('answers') && this.get('answers').get(answerIndex)
          ? this.get('answers').get(answerIndex)
          : null;
      let answerItem = this.get('showCorrect')
        ? item.correct_answer
        : userAnswer
          ? JSON.parse(userAnswer.value)
          : [];
      if (answerItem.length) {
        answerItem.forEach(cItem => {
          cItem = !this.get('showCorrect') ? cItem : JSON.parse(cItem);
          component.hightLightDefaultWord(cItem, answerIndex);
        });
      }
    });
  },

  // ---------------------------------------------------------------------
  // Methods
  hightLightDefaultWord(text, answerIndex) {
    var component = this;
    var start = text.start;
    var end = text.end;
    let parentEl = component.$(`.syllables-division-edit-${answerIndex}`);
    parentEl
      .find(`b[data-index=${start}], b[data-index =${end}]`)
      .wrapAll('<span class="serp-hl-text-span"></span>');
    if (text.selectedIndex.length) {
      text.selectedIndex.forEach(sIndex => {
        parentEl.find(`b[data-index=${sIndex}]`).addClass('selected');
      });
    }
    component.arrowLine(parentEl);
  },

  wrapLetters(value) {
    let text = '';
    if (value && value.length) {
      for (let i = 0; i < value.length; i++) {
        text += `<b data-index=${i}>${value[i]}</b>`;
      }
    }
    return text;
  },
  arrowLine(_this) {
    $(_this)
      .find('span')
      .removeClass('left-line');
    $(_this)
      .find('span')
      .each((index, el) => {
        if ($(el).children('b').length <= 1) {
          if ($(el).prev('span')[0]) {
            $(el).addClass('left-line');
          }
        }
      });
  }
});
