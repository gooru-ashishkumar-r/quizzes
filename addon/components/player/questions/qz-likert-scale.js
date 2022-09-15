import Ember from 'ember';
import { LIKERT_UI_TEMPLATES } from 'gooru-web/config/config';
import QuestionComponent from 'quizzes-addon/components/player/questions/qz-question';

export default QuestionComponent.extend({
  classNames: ['qz-likert-scale'],

  answer: Ember.computed('question', function() {
    const answers = this.get('question.baseAnswers');
    return (answers && answers.length && answers[0]) || {};
  }),

  likertItems: Ember.computed('answer', function() {
    const answer = this.get('answer');
    return answer.items.map(item => {
      return {
        label: item,
        name: item
      };
    });
  }),

  oneItemAtTime: Ember.computed('answer', function() {
    const uiDisplay = this.get('answer.ui_display_guide') || {};
    const oneItemAtTime = uiDisplay.ui_presentation === 'one_item';
    return oneItemAtTime;
  }),

  likertPoints: Ember.computed('answer', function() {
    const answer = this.get('answer');
    return answer.scale_point_labels
      .map(item => {
        return Ember.Object.create({
          levelName: item.level_name,
          levelPoint: item.level_point
        });
      })
      .sortBy('levelPoint');
  }),

  activeComponent: Ember.computed('answer', function() {
    const answer = this.get('answer');
    const activeType = LIKERT_UI_TEMPLATES.find(
      item => item.ratingType === answer.ui_display_guide.rating_type
    );
    return `content/likert-scale/${activeType.component}`;
  }),

  userAnswer: Ember.computed('question', function() {
    return this.get('question.answer');
  }),

  actions: {
    onChangeOption(answers) {
      this.notifyAnswerCompleted(answers);
    }
  }
});
