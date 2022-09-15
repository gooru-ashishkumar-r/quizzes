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
  classNames: ['gru-match-the-following'],

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
  /**
   * Convenient structure to render the question answer choices
   * @property {*}
   */
  answers: Ember.computed('question.answerDetails.[]', function() {
    let answers = this.get('question.answerDetails').sortBy('order');
    return answers;
  }),

  leftArray: Ember.computed('answers', function() {
    let left = Ember.A();
    this.get('answers').map(answer => {
      let answerObject = Ember.Object.create({
        sequence: answer.sequence,
        leftValue: answer.left_value,
        leftValueFormat: answer.left_value_format
      });
      left.pushObject(answerObject);
    });
    return left;
  }),

  rightArray: Ember.computed('answers', function() {
    let right = Ember.A();
    this.get('answers').map(answer => {
      let answerObject = Ember.Object.create({
        sequence: answer.sequence,
        rightValue: answer.right_value,
        rightValueFormat: answer.right_value_format
      });
      right.pushObject(answerObject);
    });
    return right;
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

    $items.map((idx, item) => {
      const questionAns = component.get('answers');
      const activeItem = questionAns.findBy(
        'sequence',
        parseInt($(item).data('id'), 0)
      );
      if (activeItem) {
        const answerObj = {
          value: `${activeItem.sequence},${activeItem.left_value},${activeItem.right_value},${activeItem.right_val_shuffle_order}`
        };
        answers.pushObject(answerObj);
      }
    });

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
        $(this).html(component.disorder(items));
      }
    });
  }
});
