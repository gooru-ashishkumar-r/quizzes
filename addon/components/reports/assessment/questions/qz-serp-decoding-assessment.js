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

  classNames: [
    'reports',
    'assessment',
    'questions',
    'qz-serp-decoding-assessment'
  ],

  // -------------------------------------------------------------------------
  // Properties

  showCorrect: false,

  answers: Ember.computed.alias('question.answer'),

  baseAnswers: Ember.computed.alias('question.resource.baseAnswers'),

  exemplars: Ember.computed('question.resource.hint', function() {
    return this.get('question.resource.hint')
      ? this.get('question.resource.hint.exemplar_docs')
      : Ember.A([]);
  }),
  /**
   * @property {Boolean} isPause
   */
  isPause: false,
  /*
   * Hold the audio details
   */
  audioRecorder: null,
  actions: {
    onPlayAudio(container, url, index) {
      const component = this;
      let _audio = component.get('audioRecorder');
      if (!_audio || component.get('answerIndex') !== index) {
        _audio = new Audio(url);
        component.set('answerIndex', index);
      }
      component.set('audioRecorder', _audio);
      _audio.play();
      component.set('isPause', true);
      _audio.ontimeupdate = function() {
        component
          .$(
            `.answer-container .${container} .audio-progress .progress-filling`
          )
          .css('width', `${(_audio.currentTime / _audio.duration) * 100}%`);
      };
      _audio.addEventListener('ended', () => {
        component.set('isPause', false);
      });
    },
    //Action triggered when pause audio
    onPauseAudio() {
      const component = this;
      const audio = component.get('audioRecorder');
      audio.pause();
      component.set('isPause', false);
    }
  }
});
