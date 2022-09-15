import Ember from 'ember';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';
import {
  RESOURCE_TYPES,
  QUIZZES_RESOURCE_TYPES
} from 'quizzes-addon/config/quizzes-config';

/**
 * Resource Model
 *
 * @typedef {Object} Resource
 */
export default Ember.Object.extend({
  /**
   * List of possible answers/choices
   * @property {Answer[]} answers
   */
  answers: Ember.A(),

  /**
   * @property {string} body
   */
  body: null,

  /**
   * list of correct answers
   * @property {Answer[]}
   */
  correctAnswer: Ember.A(),

  /**
   * list of correct answers
   * @property {Answer[]}
   */
  baseAnswers: Ember.A(),

  /**
   * @property {String} description
   */
  description: null,

  /**
   * resource id
   * @property {string} id
   */
  id: null,

  /**
   * indicates if the object is a question
   * @property {boolean} isQuestion
   */
  isQuestion: Ember.computed.not('isResource'),

  /**
   * indicates if the object is a resource
   * @property {boolean} isResource
   */
  isResource: null,

  /**
   * Number of choices that can be selected
   * @property {boolean} shuffle
   */
  maxChoices: 0,

  /**
   * @property {string}
   */
  narration: null,

  /**
   * @property {string} ownerId
   */
  ownerId: null,

  /**
   * @property {Profile} owner
   */
  owner: null,

  /**
   * Text to show just before the answers
   * @property {boolean} shuffle
   */
  prompt: null,

  /**
   * @property {number} sequence
   */
  sequence: null,

  /**
   * If the answers should be shuffled
   * @property {boolean} shuffle
   */
  shuffle: false,

  /**
   * @property {string} title
   */
  title: null,

  /**
   * Indicates the resource or question type.
   * @property {string} type
   */
  type: null,

  /**
   * @property {JSONObject}
   */
  displayGuide: null,

  subQuestions: Ember.A([]),

  /**
   * @property {String} questionText used to show text on choose one question right side
   */
  questionText: null,

  softText: null,

  hardText: null,

  metadata: null,

  htmlContent: null,

  showScore: false,

  // -------------------------------------------------------------------------
  // Computed

  /**
   * Indicates the resource format. i.e image, text, video, interaction, webpage, question
   * @property {string} format
   */
  format: Ember.computed('isResource', 'type', function() {
    return this.get('isResource') ? this.get('type') : 'question';
  }),

  /**
   * Indicates if the question has answers
   * @property {boolean}
   */
  hasAnswers: Ember.computed.bool('answers.length'),

  /**
   * Indicates if the question has answers
   * @property {boolean}
   */
  hasCorrectResponse: Ember.computed.bool('correctResponse.length'),

  /**
   * Indicates if the resource has a narration
   * @property {boolean}
   */
  hasNarration: Ember.computed.bool('narration'),

  /**
   * Indicates if the question has owner
   * @property {boolean}
   */
  hasOwner: Ember.computed.bool('owner'),

  /**
   * @property {boolean} indicates if the question is fill in the blank type
   * @see components/player/qz-fib.js
   */
  isFIB: Ember.computed.equal('type', QUESTION_TYPES.fib),
  /**
   * @property {boolean} indicates if the question is scientific fill in the blank type
   * @see components/player/qz-scientific-fill-in-the-blank.js
   */
  isScientificFIB: Ember.computed.equal('type', QUESTION_TYPES.scientificfib),

  /**
   * @property {boolean} indicates if the question is hot spot image type
   * @see components/player/gru-hot-spot-image.js
   */
  isHotSpotImage: Ember.computed.equal('type', QUESTION_TYPES.hotSpotImage),

  /**
   * @property {boolean} indicates if the question is hot spot text type
   * @see components/player/gru-hot-spot-text.js
   */
  isHotSpotText: Ember.computed.equal('type', QUESTION_TYPES.hotSpotText),

  /**
   * @property {boolean} indicates if the question is hot spot text
   * @see components/player/qz-hot-text-highlight.js
   */
  isHotTextHighlight: Ember.computed.or(
    'isHotTextHighlightWord',
    'isHotTextHighlightSentence'
  ),

  /**
   * @property {boolean} indicates if the question is hot text word type
   */
  isHotTextHighlightWord: Ember.computed.equal(
    'type',
    QUESTION_TYPES.hotTextHighlightWord
  ),

  /**
   * @property {boolean} indicates if the question is hot text sentence type
   */
  isHotTextHighlightSentence: Ember.computed.equal(
    'type',
    QUESTION_TYPES.hotTextHighlightSentence
  ),

  /**
   * @property {boolean} indicates if the question is reorder
   * @see components/player/qz-reorder.js
   */
  isHotTextReorder: Ember.computed.equal('type', QUESTION_TYPES.hotTextReorder),

  /**
   * Indicates if it is an image resource
   * @property {boolean}
   */
  isImageResource: Ember.computed('resourceType', function() {
    var type = this.get('resourceType');
    return type && type.indexOf('image') >= 0;
  }),

  /**
   * @property {boolean} indicates if the question is single choice type
   * @see components/player/qz-single-choice.js
   */
  isSingleChoice: Ember.computed.equal('type', QUESTION_TYPES.singleChoice),

  /**
   * @property {boolean} indicates if the question is multiple answer type
   * @see components/player/qz-multiple-answer.js
   */
  isMultipleAnswer: Ember.computed.equal('type', QUESTION_TYPES.multipleAnswer),

  /**
   * @property {boolean} indicates if the question is open ended type
   * @see components/player/qz-open-ended.js
   */
  isOpenEnded: Ember.computed.equal('type', QUESTION_TYPES.openEnded),

  /**
   * @property {boolean} indicates if the question is likert type
   * @see components/player/qz-likert-scale.js
   */
  isLikertScale: Ember.computed.equal('type', QUESTION_TYPES.likertScale),

  /**
   * @property {boolean} indicates if the question is comprehension type
   * @see components/player/qz-comprehension.js
   */
  isComprehension: Ember.computed.equal(
    'type',
    QUESTION_TYPES.serpComprehension
  ),

  /**
   * Indicates if it is an pdf resource
   * @property {boolean}
   */
  isPDFResource: Ember.computed.equal(
    'resourceType',
    QUIZZES_RESOURCE_TYPES.pdf
  ),

  /**
   * Indicates if it is an pdf resource
   * @property {boolean}
   */
  isHtmlResource: Ember.computed.equal(
    'resourceType',
    QUIZZES_RESOURCE_TYPES.html
  ),

  /**
   * @property {boolean} indicates if the question is true false type
   * @see components/player/qz-true-false.js
   */
  isTrueFalse: Ember.computed.equal('type', QUESTION_TYPES.trueFalse),
  /**
   * @property {boolean} indicates if the question is scientific free response type
   * @see components/player/qz-scientific-free-response.js
   */
  isScientificFreeResponse: Ember.computed.equal(
    'type',
    QUESTION_TYPES.scientificFreeResponse
  ),
  /**
   * Indicates if it is an url resource
   * @property {boolean}
   */
  isUrlResource: Ember.computed.equal(
    'resourceType',
    QUIZZES_RESOURCE_TYPES.url
  ),

  /**
   * Indicates if it is an vimeo resource
   * @property {boolean}
   */
  isVimeoResource: Ember.computed.equal(
    'resourceType',
    QUIZZES_RESOURCE_TYPES.vimeo
  ),

  /**
   * Indicates if it is an youtube resource
   * @property {boolean}
   */
  isYoutubeResource: Ember.computed.equal(
    'resourceType',
    QUIZZES_RESOURCE_TYPES.youtube
  ),

  /**
   * @property {String} Indicates the resource type. i.e video/youtube, assessment-question, image/png
   */
  resourceType: Ember.computed('type', function() {
    const format = this.get('type');
    const resourceUrl = this.get('body');
    const youtubePattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    const vimeoPattern = /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|)(\d+)(?:|\/\?)/;
    const pdfPattern = /.*\.pdf/;
    let resourceType = QUIZZES_RESOURCE_TYPES.url; // Default type
    if (resourceUrl) {
      switch (format) {
      case RESOURCE_TYPES.audio:
      case RESOURCE_TYPES.interactive:
      case RESOURCE_TYPES.webpage:
        resourceType = QUIZZES_RESOURCE_TYPES.url; // Default type
        break;
      case RESOURCE_TYPES.image:
        resourceType = pdfPattern.test(resourceUrl)
          ? QUIZZES_RESOURCE_TYPES.pdf
          : QUIZZES_RESOURCE_TYPES.image;
        break;
      case RESOURCE_TYPES.text:
        resourceType = QUIZZES_RESOURCE_TYPES.pdf;
        break;
      case RESOURCE_TYPES.video:
        if (youtubePattern.test(resourceUrl)) {
          resourceType = QUIZZES_RESOURCE_TYPES.youtube;
        } else if (vimeoPattern.test(resourceUrl)) {
          resourceType = QUIZZES_RESOURCE_TYPES.vimeo;
        } else {
          resourceType = QUIZZES_RESOURCE_TYPES.url;
        }
        break;
      case RESOURCE_TYPES.html:
        resourceType = QUIZZES_RESOURCE_TYPES.html;
        break;
      default:
        resourceType = QUIZZES_RESOURCE_TYPES.url; // Default type
      }
    }
    if (format === RESOURCE_TYPES.html) {
      resourceType = QUIZZES_RESOURCE_TYPES.html;
    }
    return resourceType;
  }),

  /**
   * @property {String}
   */
  mediaUrl: null,

  /**
   * @type {Boolean}
   */
  hasMedia: Ember.computed.bool('mediaUrl')
});
