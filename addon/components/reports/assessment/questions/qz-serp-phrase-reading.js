import Ember from 'ember';
import QuestionMixin from 'quizzes-addon/mixins/reports/assessment/questions/question';
import { sec2time } from 'quizzes-addon/utils/utils';

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

  classNames: ['reports', 'assessment', 'questions', 'qz-serp-phrase-reading'],

  // -------------------------------------------------------------------------
  // Properties

  showCorrect: false,

  answers: Ember.computed.alias('question.answer'),

  baseAnswers: Ember.computed.alias('question.resource.baseAnswers'),

  exemplars: Ember.computed('question.resource.data', function() {
    return this.get('question.resource.data')
      ? this.get('question.resource.data.exemplarDocs')
      : Ember.A([]);
  }),

  audioList: Ember.Object.create({}),

  activeIndex: null,

  isPlaying: false,

  didInsertElement() {
    const component = this;
    this.get('answers').forEach((answer, i) => {
      let _audio = new Audio(answer.value);
      _audio.onloadedmetadata = function() {
        if (this.duration === Infinity) {
          this.duration = 100000 * Math.random();
          let timerEl = component.$('.wpm-timer-section .timer-count');
          timerEl.find('.duration').html(sec2time(this.duration || 0));
        }
      };
      this.get('audioList').set(`player-${i}`, _audio);
    });
  },

  actions: {
    onPlayAudio(container) {
      const component = this;
      let _audio = this.get('audioList').get(container);
      this.set('activeIndex', container);
      this.set('isPlaying', true);
      _audio.play();
      _audio.onended = function() {
        component.set('isPlaying', false);
      };
      _audio.ontimeupdate = function() {
        component
          .$(
            `.answer-container .${container} .audio-progress .progress-filling`
          )
          .css('width', `${(_audio.currentTime / _audio.duration) * 100}%`);

        let timerEl = component.$(
          `.${container} .wpm-timer-section .timer-count`
        );
        timerEl.find('.current-count').html(sec2time(_audio.currentTime || 0));
        timerEl.find('.duration').html(sec2time(_audio.duration || 0));
      };
    },
    onPauseAudio(container) {
      this.set('isPlaying', false);
      let activeAudio = this.get(`audioList.${container}`);
      activeAudio.pause();
    }
  }
});
