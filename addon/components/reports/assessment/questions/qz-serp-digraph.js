import Ember from 'ember';
import QuestionMixin from 'quizzes-addon/mixins/reports/assessment/questions/question';

/**
 * SERP Underline
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

  classNames: ['reports', 'assessment', 'questions', 'qz-serp-digraph'],

  audioRecorder: null,
  /**
   * @property {Boolean} isPause
   */
  isPause: false,
  answerIndex: null,
  playerIndex: null,
  // -------------------------------------------------------------------------
  // Properties
  actions: {
    onPlayAudio(container, file, index, exemplarIndex) {
      const component = this;
      if (file) {
        let _audio = component.get('audioRecorder');
        if (
          !_audio ||
          component.get('answerIndex') !== index ||
          component.get('playerIndex') !== exemplarIndex
        ) {
          _audio = new Audio(file);
          component.set('answerIndex', index);
          component.set('playerIndex', exemplarIndex);
        }
        component.set('audioRecorder', _audio);
        _audio.play();
        component.set('isPause', true);
        _audio.ontimeupdate = function() {
          component
            .$(`.${container} .audio-progress .progress-filling`)
            .css('width', `${(_audio.currentTime / _audio.duration) * 100}%`);
        };
        _audio.addEventListener('ended', () => {
          component.set('isPause', false);
        });
      }
    },

    onPauseAudio() {
      const component = this;
      const audio = component.get('audioRecorder');
      audio.pause();
      component.set('isPause', false);
    }
  },

  answers: Ember.computed('showCorrect', function() {
    const component = this;
    const questionAnswers = JSON.parse(
      JSON.stringify(
        component.get('showCorrect')
          ? component.get('baseAnswers')
          : component.get('question.answer')
      )
    );
    return questionAnswers.map((answer, index) => {
      const answerInputs = component.get('showCorrect')
        ? answer.correct_answer
        : answer.value.split(',');
      const baseAnswer = component
        .get('baseAnswers')
        .findBy('sequence', index + 1);
      let answerText = baseAnswer.answer_text;
      let value = component.get('question.resource.hint.exemplar_docs');
      answer.exemplarAnswer = value[index].correct_answer;
      answerInputs.map(answerInput => {
        answer.isCorrect =
          baseAnswer && baseAnswer.correct_answer.includes(answerInput);
        answerText = answerText.replace(
          answerInput,
          component.getHighlightedText(answer.isCorrect, answerInput)
        );
        answer.text = answerText;
      });
      return answer;
    });
  }),

  baseAnswers: Ember.computed.alias('question.resource.baseAnswers'),

  showCorrect: false,

  highlightAnswers() {
    const component = this;
    const answers = Ember.A([]);
    const questionAnswers = component.get('showCorrect')
      ? component.get('baseAnswers')
      : component.get('question.answer');
    questionAnswers.map((answer, index) => {
      const answerInputs = component.get('showCorrect')
        ? answer.correct_answer
        : answer.value.split(',');
      const baseAnswer = component
        .get('baseAnswers')
        .findBy('sequence', index + 1);
      let answerText = baseAnswer.answer_text;
      answerInputs.map(answerInput => {
        answer.isCorrect =
          baseAnswer && baseAnswer.correct_answer.includes(answerInput);
        answerText = answerText.replace(
          answer.value,
          component.getHighlightedText(answer)
        );
        answer.text = answerText;
      });
      answers.pushObject(answer);
    });
    return answers;
  },

  getHighlightedText(isCorrect, text) {
    return `<span class="${isCorrect ? 'correct' : 'wrong'}">${text}</span>`;
  }
});
