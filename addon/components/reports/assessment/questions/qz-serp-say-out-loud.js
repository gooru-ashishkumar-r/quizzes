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

  classNames: ['reports', 'assessment', 'questions', 'qz-serp-say-out-loud'],

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

  audioDuration: 0,
  isDisableAddExemplar: Ember.computed.gte(
    'exemplars.length',
    'answers.length'
  ),
  /**
   * @property {Boolean} isPause
   */
  isPause: false,
  /*
   * Hold the audio details
   */
  audioRecorder: null,

  timeout: null,
  textposition: 0,
  textindex: 0,

  actions: {
    onPlayAudio(container, url, answerIndex, Highlightallow) {
      const component = this;
      let _audio = component.get('audioRecorder');
      if (!_audio || component.get('playerIndex') !== answerIndex) {
        _audio = new Audio(url);
        component.set('playerIndex', answerIndex);
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
        component.set('audioDuration', _audio.duration * 1000);
      };
      _audio.addEventListener('ended', () => {
        component.set('isPause', false);
      });
      if (Highlightallow) {
        var answerObject = component.get('baseAnswers').get(answerIndex);
        if (answerObject) {
          component.highlightSelectedWord(answerIndex, answerObject);
        }
      }
    },
    //Action triggered when pause audio
    onPauseAudio() {
      const component = this;
      const audio = component.get('audioRecorder');
      audio.pause();
      component.set('isPause', false);
      clearTimeout(component.timeout);
    }
  },

  highlightSelectedWord(index, answerObject) {
    const component = this;
    if (answerObject.correct_answer && answerObject.correct_answer.length) {
      const textToHighlight = answerObject.correct_answer.concat(
        answerObject.answer_text
      );
      let valIndex = 0;
      if (component.get('textposition')) {
        if (component.get('textindex') === index) {
          valIndex = component.get('textposition');
        }
      }
      valIndex = valIndex === textToHighlight.length ? 0 : valIndex;
      component.set('textindex', index);
      component.startLoop(valIndex, textToHighlight, index, answerObject);
    } else {
      component
        .$(`.answer-text-${index}`)
        .find('span')
        .contents()
        .unwrap();
      component
        .$(`.answer-text-${index}`)
        .html(
          `<span class="highlight-answertext">${answerObject.answer_text}</span>`
        );
    }
  },

  startLoop(valIndex, textToHighlight, index, answer) {
    var component = this;
    const _ans_container = component.$(`.answer-text-${index}`)[0];
    component.timeout = setTimeout(() => {
      if (answer.correct_answer.length >= valIndex) {
        const answerVal = textToHighlight[valIndex];
        if (valIndex === 0) {
          component
            .$(`.answer-text-${index}`)
            .find('span')
            .contents()
            .unwrap();
        }
        component
          .$(`.answer-text-${index}`)
          .find('.highlight-answertext')
          .removeClass('highlight-answertext');

        var start = answerVal.split(':')[1];
        var end = answerVal.split(':')[2];
        var fulltext = answerVal.split(':')[0]
          ? answerVal.split(':')[0]
          : answerVal;
        let innerHTML = '';
        String.prototype.replaceBetween = function(start, end, what) {
          return this.substring(0, start) + what + this.substring(end);
        };
        _ans_container.childNodes.forEach(childNode => {
          if (
            childNode.data &&
            childNode.data.substring(start, end) === fulltext
          ) {
            innerHTML =
              innerHTML +
              childNode.data.replaceBetween(
                start,
                end,
                $.trim(`<span class="highlight-answertext">${fulltext}</span>`)
              );
          } else if (childNode.data) {
            if (fulltext === answer.answer_text) {
              component
                .$(`.answer-text-${index}`)
                .find('span')
                .contents()
                .unwrap();
              innerHTML = `<span class="highlight-answertext">${fulltext}</span>`;
            } else {
              innerHTML = innerHTML + childNode.data;
            }
          } else {
            if (fulltext === answer.answer_text) {
              component
                .$(`.answer-text-${index}`)
                .find('span')
                .contents()
                .unwrap();
              innerHTML = `<span class="highlight-answertext">${fulltext}</span>`;
            } else {
              innerHTML = innerHTML + childNode.outerHTML;
            }
          }
        });
        component.$(`.answer-text-${index}`).html(innerHTML);
        valIndex = valIndex + 1;
        component.set('textposition', valIndex);
        component.startLoop(valIndex, textToHighlight, index, answer);
      }
    }, 1000);
  }
});
