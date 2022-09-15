import Ember from 'ember';
import { LIKERT_UI_TEMPLATES } from 'gooru-web/config/config';

export default Ember.Component.extend({
  classNames: ['qz-likert-scale'],

  answer: Ember.computed('answers', function() {
    const answers = this.get('answers');
    return answers && answers.length ? answers[0] : null;
  }),

  userAnswer: Ember.computed('question', function() {
    return this.get('question.answer');
  }),

  answers: Ember.computed('question', function() {
    return this.get('question.resource.answerDetails');
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
  })
});
