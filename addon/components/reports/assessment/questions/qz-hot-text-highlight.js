import Ember from 'ember';
import QuestionMixin from 'quizzes-addon/mixins/reports/assessment/questions/question';
import QuestionUtil from 'quizzes-addon/utils/question/hot-text-highlight';

/**
 * Hot Text Highlight
 *
 * Component responsible for controlling the logic and appearance of an Hot Text Highlight
 * question inside of the assessment report.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend(QuestionMixin, {
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'questions', 'qz-hot-text-highlight'],

  // -------------------------------------------------------------------------
  // Properties
  items: Ember.computed('question', function() {
    const component = this;
    const question = component.get('question');
    const showCorrect = component.get('showCorrect');
    const correctAnswers = question.get('question.correctAnswer');
    const userAnswers = showCorrect
      ? correctAnswers
      : component.get('userAnswer');
    const items = QuestionUtil.getItems(question.get('question'));
    items.forEach(item => {
      let removeCommaFromText = item
        .get('text')
        .trim()
        .replace(/\n/g, '');
      const value = `${removeCommaFromText},${item.get('index')}`;
      const selected = !!userAnswers.findBy('value', value);
      item.set('selected', selected);
      item.set('correct', !selected || !!correctAnswers.findBy('value', value));
    });
    return items;
  })

  // -------------------------------------------------------------------------
  // Methods
});
