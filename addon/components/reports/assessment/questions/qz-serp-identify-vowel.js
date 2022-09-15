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

  classNames: ['reports', 'assessment', 'questions', 'qz-serp-identify-vowel'],

  // -------------------------------------------------------------------------
  // Properties

  showCorrect: false,

  answers: Ember.computed.alias('question.answer'),

  baseAnswers: Ember.computed.alias('question.resource.baseAnswers'),

  // -----------------------------------------------------------------------
  // Events

  didInsertElement() {
    let component = this;

    let baseAnswers = component.get('baseAnswers');
    baseAnswers.forEach((item, answerIndex) => {
      let correctAnswer = item.correct_answer.map(cAns => JSON.parse(cAns));
      let userAnswer = JSON.parse(component.get('answers')[answerIndex].value);
      let contentTag = component.$(`.identify-vowel-edit-${answerIndex}`);
      component.defaultHighlighter(
        contentTag,
        item.answer_text,
        answerIndex,
        correctAnswer,
        userAnswer
      );
    });
  },

  // ---------------------------------------------------------------------
  // Methods

  defaultHighlighter(contentTag, text, answerIndex, correctAnswer, userAnswer) {
    let component = this;
    let showCorrect = component.get('showCorrect');
    let crossedClass = pIndex => {
      let answerText = correctAnswer.find(
        cAns => parseInt(cAns.crossPosition, 0) === pIndex
      );
      if (answerText) {
        let classNames = 'selected';
        if (answerText.isShort) {
          classNames = 'short';
        }
        if (answerText.isCross) {
          classNames = 'crossed';
        }
        return classNames;
      }
    };
    let isVowels = () => {
      return '';
    };
    if (!showCorrect) {
      isVowels = (letter, index) => {
        let activeLetter = userAnswer.find(
          cAns => parseInt(cAns.crossPosition, 0) === index
        );
        return activeLetter
          ? activeLetter.isCorrect
            ? 'selected'
            : 'selected wrong-selected'
          : '';
      };
      crossedClass = pIndex => {
        let crossItem = userAnswer.find(
          cItem => parseInt(cItem.crossPosition, 0) === pIndex && cItem.isCross
        );
        let shortItem = userAnswer.find(
          cItem => parseInt(cItem.crossPosition, 0) === pIndex && cItem.isShort
        );
        let classNames = '';
        if (crossItem) {
          let crtCross = correctAnswer.find(
            bItem => parseInt(bItem.crossPosition, 0) === pIndex
          );
          classNames = crtCross ? 'crossed' : 'wrong crossed';
        }
        if (shortItem) {
          let crtCross = correctAnswer.find(
            bItem => parseInt(bItem.crossPosition, 0) === pIndex
          );
          classNames = crtCross ? 'short' : 'wrong short';
        }
        return classNames;
      };
    }
    let splitText = [...text]
      .map((item, index) => {
        return item !== ' '
          ? `<b class="${isVowels(item, index + 1)} ${crossedClass(
            index + 1
          )}" data-b-index=${index + 1}>${item}</b>`
          : item;
      })
      .join('');
    contentTag.html(splitText);
  }
});
