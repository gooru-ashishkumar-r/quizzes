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

  classNames: [
    'reports',
    'assessment',
    'questions',
    'qz-serp-words-per-minute'
  ],

  // -------------------------------------------------------------------------
  // Properties

  showCorrect: false,

  answers: Ember.computed.alias('question.answer'),

  baseAnswers: Ember.computed.alias('question.resource.baseAnswers'),

  answer: Ember.computed('answers', function() {
    return this.get('answers.firstObject');
  }),

  exemplars: Ember.computed('question.resource.data', function() {
    return this.get('question.resource.data')
      ? this.get('question.resource.data.exemplarDocs')
      : Ember.A([]);
  }),

  isPlaying: false,

  audio: null,

  wordsPerMinute: null,

  selectedText: null,

  wordsPerMinuteCount: null,

  // -------------------------------------------------------------------------
  // Event
  didInsertElement() {
    const component = this;
    let answer = this.get('answer');
    let audioObj = answer.value ? JSON.parse(answer.value) : null;
    this.set('selectedText', audioObj.selectedText);

    if (audioObj) {
      let speechText = audioObj.speechText.fullAudioText.split(' ').length;
      let selectedText = audioObj.selectedText;
      let wpm = selectedText.wpmCount || 0;
      let wpmcount = audioObj.speechText.avgWordCount
        ? audioObj.speechText.avgWordCount
        : 0;
      wpmcount = wpmcount < speechText ? wpmcount : speechText;
      this.setProperties({
        wordsPerMinute: wpm
      });
      component.set(
        'audioDuration',
        sec2time(component.get('selectedText').audioLength / 1000 || 0)
      );
      this.set('wordsPerMinuteCount', wpmcount);
      let audioUrl = audioObj.value;
      this.set('audio', new Audio(audioUrl));
    }
  },

  actions: {
    onPlayAudio() {
      const component = this;
      this.set('isPlaying', true);
      let _audio = component.get('audio');
      _audio.play();
      _audio.onended = function() {
        component.set('isPlaying', false);
      };
      _audio.ontimeupdate = function() {
        component
          .$('.answer-container .audio-progress .progress-filling')
          .css('width', `${(_audio.currentTime / _audio.duration) * 100}%`);

        let timerEl = component.$('.wpm-timer-section .timer-count');
        timerEl.find('.current-count').html(sec2time(_audio.currentTime || 0));
        timerEl
          .find('.duration')
          .html(
            sec2time(component.get('selectedText').audioLength / 1000 || 0)
          );
      };
    },
    onPauseAudio() {
      this.set('isPlaying', false);
      let activeAudio = this.get('audio');
      activeAudio.pause();
    }
  }
});
