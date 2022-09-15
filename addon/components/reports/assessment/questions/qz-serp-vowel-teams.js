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

  classNames: ['reports', 'assessment', 'questions', 'qz-vowel-teams'],

  // -------------------------------------------------------------------------
  // Properties

  showCorrect: false,

  answers: Ember.computed.alias('question.answer'),

  baseAnswers: Ember.computed.alias('question.resource.baseAnswers'),

  // -----------------------------------------------------------------------
  // Events

  didInsertElement() {
    let baseAnswers = this.get('showCorrect')
      ? this.get('baseAnswers')
      : this.get('answers');
    baseAnswers.forEach((item, answerIndex) => {
      item = this.get('showCorrect')
        ? item.correct_answer
        : JSON.parse(item.value);
      if (item.length) {
        item.forEach(cItem => {
          cItem = !this.get('showCorrect') ? cItem : JSON.parse(cItem);
          this.hightLightDefaultWord(cItem, answerIndex, false, cItem.position);
        });
      }
    });
  },

  // ---------------------------------------------------------------------
  // Methods

  hightLightDefaultWord(text, answerIndex, editMode) {
    var component = this;
    let innerHTML = '';
    let html = '';
    var start = text.start;
    var end = text.end;
    var fulltext = text.text;
    let findPosition = (index, itemName) => {
      let findItem = text[itemName] ? text[itemName] : [];
      return findItem.indexOf(index) !== -1;
    };
    let sptText = fulltext
      .split('')
      .map(
        (item, index) =>
          `<b class='${
            findPosition(index, 'macronPositions') ? 'macron ' : ''
          } ${
            findPosition(index, 'crossPositions') ? 'cross ' : ''
          }'>${item}</b>`
      )
      .join('');

    if (editMode) {
      html = `<span class="serp-hl-text-span">${fulltext}<i class="material-icons">clear</i></span>`;
    } else {
      html = `<span class="serp-hl-text-span">${sptText}</span>`;
    }
    String.prototype.replaceBetween = function(start, end, what) {
      return this.substring(0, start) + what + this.substring(end);
    };
    component
      .$(`.vowel-team-edit-${answerIndex}`)[0]
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
    component.$(`.vowel-team-edit-${answerIndex}`).html(innerHTML);
  }
});
