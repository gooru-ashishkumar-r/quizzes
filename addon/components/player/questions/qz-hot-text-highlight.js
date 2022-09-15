import Ember from 'ember';
import QuestionComponent from 'quizzes-addon/components/player/questions/qz-question';
import QuestionUtil from 'quizzes-addon/utils/question/hot-text-highlight';

/**
 * Hot Text Highlight
 *
 * Component responsible for controlling the logic and appearance of a hot
 * text question inside of the {@link player/qz-question-viewer.js}
 *
 * @module
 * @see controllers/player.js
 * @see components/player/qz-question-viewer.js
 * @augments Ember/Component
 */
export default QuestionComponent.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-hot-text-highlight'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Select or unselect an item
     * @param {{index: number, text: string, selected: boolean}} item
     */
    markItem: function(item) {
      const component = this;
      if (!component.get('readOnly')) {
        item.set('selected', !item.get('selected'));
        component.notifyEvents(component.getSelectedItems(), false);
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events
  /**
   * Generate items from question answer choices
   */
  initItems: function() {
    const component = this;
    if (component.get('hasUserAnswer')) {
      component.notifyEvents(component.getSelectedItems(), true);
    }
  }.on('didInsertElement'),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property items possible answers, it handles word and sentence variants
   */
  items: Ember.computed('question.body', function() {
    const component = this;
    const items = QuestionUtil.getItems(this.get('question'));
    if (component.get('hasUserAnswer')) {
      const userAnswer = component.get('userAnswer');
      items.forEach(item =>
        item.set(
          'selected',
          !!userAnswer.findBy(
            'value',
            `${item.get('text')},${item.get('index')}`
          )
        )
      );
    }
    return items;
  }),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Returns those items selected by the user
   * @returns {{index: number, text: string, selected: boolean}[]} selected items
   */
  getSelectedItems: function() {
    return this.get('items').filterBy('selected', true);
  },

  /**
   * Notifies events based on selected items
   * @param {{index: number, text: string, selected: boolean}} selectedItems
   * @param {boolean} onLoad if this was called when loading the component
   */
  notifyEvents: function(selectedItems, onLoad) {
    const component = this;
    selectedItems.forEach(item => {
      item.set('text', item.get('text'));
    });
    const userAnswer = selectedItems.map(item => ({
      value: `${item.get('text').trim()},${item.get('index')}`
    }));
    component.notifyAnswerChanged(userAnswer);
    if (selectedItems.get('length')) {
      if (onLoad) {
        component.notifyAnswerLoaded(userAnswer);
      } else {
        component.notifyAnswerCompleted(userAnswer);
      }
    } else {
      component.notifyAnswerCleared(userAnswer);
    }
  }
});
