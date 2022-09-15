import Ember from 'ember';
import QuestionComponent from 'quizzes-addon/components/player/questions/qz-question';

/**
 * Reorder Question
 *
 * Component responsible for controlling the logic and appearance of the answers for
 * a reorder question inside of the {@link player/qz-question-viewer.js}
 *
 * @module
 * @see controllers/player.js
 * @see components/player/qz-question-viewer.js
 * @augments player/questions/qz-question.js
 */
export default QuestionComponent.extend({
  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-reorder'],

  // -------------------------------------------------------------------------
  // Events

  initSortableList: Ember.on('didInsertElement', function() {
    const component = this;
    component.setAnswers();
    if (!component.get('hasUserAnswer')) {
      component.shuffle();
    }
    this.set('areAnswersShuffled', true);
  }),

  removeSubscriptions: Ember.on('willDestroyElement', function() {
    this.$('.sortable').off('sortupdate');
  }),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Convenient structure to render the question answer choices
   * @property {*}
   */
  answers: Ember.computed('question.answers.@each.value', function() {
    let answers = this.get('question.answers');
    if (this.get('hasUserAnswer')) {
      const userAnswer = this.get('userAnswer');
      answers = userAnswer.map(answer => answers.findBy('value', answer.value));
    }
    return answers;
  }),

  /**
   * Return true if the answers list are shuffled
   * @property {Boolean}
   */
  areAnswersShuffled: false,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Disorder elements
   */
  disorder: function(list) {
    var j,
      x,
      i = list.length;
    while (i) {
      j = parseInt(Math.random() * i);
      i -= 1;
      x = list[i];
      list[i] = list[j];
      list[j] = x;
    }
    return list;
  },

  /**
   * Notifies answer events
   * @param {boolean} onLoad if this was called when loading the component
   */
  notify: function(onLoad) {
    const component = this;
    const $items = component.$('.sortable').find('li');
    const answers = Ember.A([]);

    $items.map((idx, item) =>
      answers.pushObject({ value: $(item).data('id') })
    );

    component.notifyAnswerChanged(answers);
    if (onLoad) {
      component.notifyAnswerLoaded(answers);
    } else {
      component.notifyAnswerCompleted(answers);
    }
  },

  /**
   * Set answers
   */
  setAnswers: function() {
    const component = this;
    const sortable = this.$('.sortable');
    const readOnly = component.get('readOnly');

    sortable.sortable();
    if (readOnly) {
      sortable.sortable('disable');
    }

    if (component.get('hasUserAnswer')) {
      component.notify(true);
    }
    // Manually add subscriptions to sortable element -makes it easier to test
    sortable.on('sortupdate', function() {
      component.notify(false);
    });
  },

  /**
   * Take the list of items and shuffle all his members
   */
  shuffle: function() {
    const component = this;
    const $items = component.$('.sortable');
    $items.each(function() {
      var items = $items.children().clone(true);
      if (items.length) {
        while (!component.validateShuffle()) {
          $(this).html(component.disorder(items));
        }
      }
    });
  },
  /**
   * Validate shuffle doesn't be equal than the correct order
   */
  validateShuffle: function() {
    const component = this;
    const $items = component.$('.sortable li').toArray();
    const answers = component.get('answers');
    return $items.reduce(
      (isValid, item, idx) =>
        isValid && answers[idx].get('value') !== $(item).data('id'),
      true
    );
  }
});
