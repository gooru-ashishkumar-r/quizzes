import QuestionComponent from 'quizzes-addon/components/player/questions/qz-question';
import Ember from 'ember';

/**
 * SERP sorting
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
  classNames: ['serp-sorting'],

  // -------------------------------------------------------------------------
  // Properties

  answers: Ember.computed('question.baseAnswers', function() {
    let answers = this.get('question.baseAnswers');
    return answers.map(item => {
      return {
        answer_text: item.answer_text,
        answer_type: null,
        is_correct: true
      };
    });
  }),

  // -------------------------------------------------------------------------
  // Events

  didInsertElement() {
    this._super(...arguments);
    this.initialize();
  },

  // -------------------------------------------------------------------------
  // Methods

  initialize() {
    let component = this;
    let userAnswered;
    let answers = component.get('answers');
    let userAnswerList = component.get('userAnswer');
    if (userAnswerList && userAnswerList.length) {
      userAnswered = userAnswerList.map(item => JSON.parse(item.value));
    }
    if (userAnswered && userAnswered.length) {
      userAnswered.forEach((items, index) => {
        items.forEach(item => {
          let answer = answers.get(index);
          Ember.set(answer, 'answer_type', item.answer_type);
          let tag = `<li data-answer-index=${index}> ${item.answer_text}</li>`;
          if (item.answer_type === 'soft') {
            component.$('.qz-column-soft-blk').append(tag);
          } else if (item.answer_type === 'hard') {
            component.$('.qz-column-hard-blk').append(tag);
          }
        });
      });
    }

    component.$(function() {
      component.$('.qz-sorting-blk li, .qz-sorting-list-item li').draggable({
        helper: 'clone',
        revert: 'invalid'
      });
      component.$('.qz-sorting-blk').droppable({
        tolerance: 'intersect',
        drop: function(event, ui) {
          $(this).append($(ui.draggable));
          let answerIndex = ui.helper[0].dataset.answerIndex;
          let type = event.target.classList.contains('qz-column-soft-blk')
            ? 'soft'
            : 'hard';
          let answer = answers.get(answerIndex);
          Ember.set(answer, 'answer_type', type);
          component.getSequenceItem(
            component.$('.qz-column-soft-blk'),
            component
          );
          component.getSequenceItem(
            component.$('.qz-column-hard-blk'),
            component
          );
          component.parseUserAnswer(component);
        }
      });
    });
  },

  /**
   * @function parseUserAnswer Help to order user answers list
   */
  parseUserAnswer(component) {
    let answers = component.get('answers');
    let userAnswers = [];
    answers = answers.sortBy('sequence');
    answers.forEach(item => {
      item.sequence = 0;
      userAnswers.push({
        value: `[${JSON.stringify(item)}]`
      });
    });
    let allAnswered = answers.findBy('answer_type', null);
    if (!allAnswered) {
      component.notifyAnswerCompleted(userAnswers);
    }
  },

  getSequenceItem(_this, component) {
    let answers = component.get('answers');
    let elementList = _this.children();
    elementList.each(function(index, el) {
      let answerIndex = el.dataset.answerIndex;
      let answer = answers.get(answerIndex);
      Ember.set(answer, 'sequence', index);
    });
  }
});
