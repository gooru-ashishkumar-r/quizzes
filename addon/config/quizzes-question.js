import Ember from 'ember';
import OpenEndedUtil from 'quizzes-addon/utils/question/open-ended';

//Question Types
export const QUESTION_TYPES = {
  singleChoice: 'single_choice',
  likertScale: 'likert_scale_question',
  matchTheFollowing: 'match_the_following_question',
  multipleAnswer: 'multiple_choice',
  trueFalse: 'true_false',
  openEnded: 'extended_text',
  fib: 'text_entry',
  hotSpotText: 'multiple_choice_text',
  hotSpotImage: 'multiple_choice_image',
  hotTextReorder: 'drag_and_drop',
  hotTextHighlightWord: 'hot_text_word',
  hotTextHighlightSentence: 'hot_text_sentence',
  scientificFreeResponse: 'scientific_free_response',
  scientificfib: 'scientific_fill_in_the_blank',
  serpEncoding: 'serp_encoding',
  serpDecoding: 'serp_decoding',
  serpSayOutLoud: 'serp_say_out_loud',
  serpDigraph: 'serp_lang_identify_digraph',
  serpWordsPerMinute: 'serp_words_per_minute',
  serpSilentReading: 'serp_silent_reading',
  srepPhrase: 'serp_phrase_cued_reading',
  serpVowelTeams: 'serp_lang_vowel_teams',
  serpComprehension: 'serp_lang_activities_for_comprehension',
  serpBaseword: 'serp_lang_identify_base_word',
  serpCountingSyllables: 'serp_lang_counting_syllables_question',
  serpSyllablesDivision: 'serp_lang_syllable_division_question',
  serpClassic: 'serp_classic_question',
  serpChooseOne: 'serp_choose_one',
  serpPickNChoose: 'serp_pick_n_choose_question',
  serpSorting: 'serp_sorting',
  serpMultiChoice: 'serp_multi_choice',
  serpIdentifyVowel: 'serp_identify_vowel_sound_activity_question',
  serp_encoding_assessment: 'serp_encoding_assessment',
  serp_lang_counting_syllables: 'serp_lang_counting_syllables',
  serp_classic: 'serp_classic',
  serp_lang_syllable_division: 'serp_lang_syllable_division',
  serpPickNChooseQuestion: 'serp_pick_n_choose'
};

//Question type configuration
export const QUESTION_CONFIG = {
  single_choice: Ember.Object.create({
    apiType: 'single_choice_question',
    component: {
      player: 'player.questions.qz-single-choice',
      answer: 'reports.assessment.questions.qz-single-choice'
    }
  }),
  likert_scale_question: Ember.Object.create({
    apiType: 'likert_scale_question',
    component: {
      player: 'player.questions.qz-likert-scale',
      answer: 'reports.assessment.questions.qz-likert-scale'
    }
  }),
  multiple_choice: Ember.Object.create({
    apiType: 'multiple_choice_question',
    component: {
      player: 'player.questions.qz-multiple-answer',
      answer: 'reports.assessment.questions.qz-multiple-answer'
    }
  }),
  drag_and_drop: Ember.Object.create({
    apiType: 'drag_and_drop',
    component: {
      player: 'player.questions.qz-reorder',
      answer: 'reports.assessment.questions.qz-reorder'
    }
  }),
  hot_text_word: Ember.Object.create({
    apiType: 'hot_text_highlight_question',
    component: {
      player: 'player.questions.qz-hot-text-highlight',
      answer: 'reports.assessment.questions.qz-hot-text-highlight'
    }
  }),
  hot_text_sentence: Ember.Object.create({
    apiType: 'hot_text_highlight_question',
    component: {
      player: 'player.questions.qz-hot-text-highlight',
      answer: 'reports.assessment.questions.qz-hot-text-highlight'
    }
  }),
  true_false: Ember.Object.create({
    apiType: 'true_false_question',
    component: {
      player: 'player.questions.qz-true-false',
      answer: 'reports.assessment.questions.qz-true-false'
    }
  }),
  text_entry: Ember.Object.create({
    apiType: 'text_entry_question',
    component: {
      player: 'player.questions.qz-fib',
      answer: 'reports.assessment.questions.qz-fib'
    }
  }),
  multiple_choice_image: Ember.Object.create({
    apiType: 'hot_spot_image_question',
    component: {
      player: 'player.questions.qz-hs-image',
      answer: 'reports.assessment.questions.qz-hs-image'
    }
  }),
  multiple_choice_text: Ember.Object.create({
    apiType: 'multiple_choice_text_question',
    component: {
      player: 'player.questions.qz-hs-text',
      answer: 'reports.assessment.questions.qz-hs-text'
    }
  }),
  extended_text: Ember.Object.create({
    apiType: 'open_ended_question',
    util: OpenEndedUtil,
    component: {
      player: 'player.questions.qz-open-ended',
      answer: 'reports.assessment.questions.qz-open-ended'
    }
  }),
  scientific_free_response: Ember.Object.create({
    apiType: 'scientific_free_response_question',
    component: {
      player: 'player.questions.qz-scientific-free-response',
      answer: 'reports.assessment.questions.qz-scientific-free-response'
    }
  }),
  scientific_fill_in_the_blank: Ember.Object.create({
    apiType: 'scientific_fill_in_the_blank',
    component: {
      player: 'player.questions.qz-scientific-fill-in-the-blank',
      answer: 'reports.assessment.questions.qz-scientific-fill-in-the-blank'
    }
  }),
  serp_encoding_assessment: Ember.Object.create({
    apiType: 'serp_encoding_assessment_question',
    component: {
      player: 'player.questions.qz-serp-encoding',
      answer: 'reports.assessment.questions.qz-serp-encoding-assessment'
    }
  }),
  serp_decoding_assessment: Ember.Object.create({
    apiType: 'serp_decoding_assessment_question',
    component: {
      player: 'player.questions.qz-serp-decoding',
      answer: 'reports.assessment.questions.qz-serp-decoding-assessment'
    }
  }),
  serp_lang_say_out_loud: Ember.Object.create({
    apiType: 'serp_lang_say_out_loud_question',
    component: {
      player: 'player.questions.qz-serp-say-out-loud',
      answer: 'reports.assessment.questions.qz-serp-say-out-loud'
    }
  }),
  serp_lang_identify_digraph: Ember.Object.create({
    apiType: 'serp_lang_identify_digraph',
    component: {
      player: 'player.questions.qz-serp-digraph',
      answer: 'reports.assessment.questions.qz-serp-digraph'
    }
  }),
  serp_words_per_minute: Ember.Object.create({
    apiType: 'serp_words_per_minute',
    component: {
      player: 'player.questions.qz-serp-words-per-minute',
      answer: 'reports.assessment.questions.qz-serp-words-per-minute'
    }
  }),
  serp_silent_reading: Ember.Object.create({
    apiType: 'serp_silent_reading',
    component: {
      player: 'player.questions.qz-serp-silent-reading',
      answer: 'reports.assessment.questions.qz-serp-silent-reading'
    }
  }),
  serp_phrase_cued_reading: Ember.Object.create({
    apiType: 'serp_phrase_cued_reading',
    component: {
      player: 'player.questions.qz-serp-phrase-reading',
      answer: 'reports.assessment.questions.qz-serp-phrase-reading'
    }
  }),
  serp_lang_activities_for_comprehension: Ember.Object.create({
    apiType: 'serp_lang_activities_for_comprehension',
    component: {
      player: 'player.questions.qz-comprehension',
      answer: 'reports.assessment.questions.qz-comprehension'
    }
  }),
  serp_lang_identify_base_word: Ember.Object.create({
    apiType: 'serp_lang_identify_base_word_question',
    component: {
      player: 'player.questions.qz-serp-baseword',
      answer: 'reports.assessment.questions.qz-serp-baseword'
    }
  }),
  serp_lang_vowel_teams: Ember.Object.create({
    apiType: 'serp_lang_vowel_teams_question',
    component: {
      player: 'player.questions.qz-serp-vowel-teams',
      answer: 'reports.assessment.questions.qz-serp-vowel-teams'
    }
  }),
  serp_lang_counting_syllables: Ember.Object.create({
    apiType: 'serp_lang_counting_syllables_question',
    component: {
      player: 'player.questions.qz-serp-counting-syllables',
      answer: 'reports.assessment.questions.qz-serp-counting-syllables'
    }
  }),
  serp_lang_syllable_division: Ember.Object.create({
    apiType: 'serp_lang_syllable_division_question',
    component: {
      player: 'player.questions.qz-serp-syllables-division',
      answer: 'reports.assessment.questions.qz-serp-syllables-division'
    }
  }),
  serp_classic: Ember.Object.create({
    apiType: 'serp_classic',
    component: {
      player: 'player.questions.qz-serp-classic',
      answer: 'reports.assessment.questions.qz-serp-classic'
    }
  }),
  serp_choose_one: Ember.Object.create({
    apiType: 'serp_choose_one',
    component: {
      player: 'player.questions.qz-serp-choose-one',
      answer: 'reports.assessment.questions.qz-serp-choose-one'
    }
  }),
  serp_pick_n_choose: Ember.Object.create({
    apiType: 'serp_pick_n_choose',
    component: {
      player: 'player.questions.qz-serp-pick-n-choose',
      answer: 'reports.assessment.questions.qz-serp-pick-n-choose'
    }
  }),
  serp_sorting: Ember.Object.create({
    apiType: 'serp_sorting',
    component: {
      player: 'player.questions.qz-serp-sorting',
      answer: 'reports.assessment.questions.qz-serp-sorting'
    }
  }),
  serp_multi_choice: Ember.Object.create({
    apiType: 'serp_multi_choice',
    component: {
      player: 'player.questions.qz-serp-multi-choice',
      answer: 'reports.assessment.questions.qz-serp-multi-choice'
    }
  }),
  serp_identify_vowel_sound_activity_question: Ember.Object.create({
    apiType: 'serp_identify_vowel_sound_activity_question',
    component: {
      player: 'player.questions.qz-serp-identify-vowel',
      answer: 'reports.assessment.questions.qz-serp-identify-vowel'
    }
  }),
  match_the_following_question: Ember.Object.create({
    apiType: 'match_the_following_question',
    component: {
      player: 'player.questions.qz-match-the-following',
      answer: 'reports.assessment.questions.qz-match-the-following'
    }
  })
};
export const SERP_QUESTION_TYPES = {
  serp_lang_identify_base_word: Ember.Object.create({
    apiType: 'serp_lang_identify_base_word_question',
    component: {
      player: 'player.questions.qz-serp-baseword'
    }
  }),
  serp_encoding_assessment: Ember.Object.create({
    apiType: 'serp_encoding_assessment_question',
    component: {
      player: 'player.questions.qz-serp-encoding',
      answer: 'reports.assessment.questions.qz-serp-encoding-assessment'
    }
  }),
  serp_decoding_assessment: Ember.Object.create({
    apiType: 'serp_decoding_assessment_question',
    component: {
      player: 'player.questions.qz-serp-decoding',
      answer: 'reports.assessment.questions.qz-serp-decoding-assessment'
    }
  }),
  serp_lang_say_out_loud: Ember.Object.create({
    apiType: 'serp_lang_say_out_loud_question',
    component: {
      player: 'player.questions.qz-serp-say-out-loud',
      answer: 'reports.assessment.questions.qz-serp-say-out-loud'
    }
  }),
  serp_lang_identify_digraph: Ember.Object.create({
    apiType: 'serp_lang_identify_digraph',
    component: {
      player: 'player.questions.qz-serp-digraph',
      answer: 'reports.assessment.questions.qz-serp-digraph'
    }
  }),
  serp_words_per_minute: Ember.Object.create({
    apiType: 'serp_words_per_minute',
    component: {
      player: 'player.questions.qz-serp-words-per-minute',
      answer: 'reports.assessment.questions.qz-serp-words-per-minute'
    }
  }),
  serp_silent_reading: Ember.Object.create({
    apiType: 'serp_silent_reading',
    component: {
      player: 'player.questions.qz-serp-silent-reading',
      answer: 'reports.assessment.questions.qz-serp-silent-reading'
    }
  }),
  serp_phrase_cued_reading: Ember.Object.create({
    apiType: 'serp_phrase_cued_reading',
    component: {
      player: 'player.questions.qz-serp-phrase-reading',
      answer: 'reports.assessment.questions.qz-serp-phrase-reading'
    }
  }),
  serp_lang_vowel_teams: Ember.Object.create({
    apiType: 'serp_lang_vowel_teams_question',
    component: {
      player: 'player.questions.qz-serp-vowel-teams',
      answer: 'reports.assessment.questions.qz-serp-vowel-teams'
    }
  }),
  serp_lang_activities_for_comprehension: Ember.Object.create({
    apiType: 'serp_lang_activities_for_comprehension',
    component: {
      player: 'player.questions.qz-comprehension',
      answer: 'reports.assessment.questions.qz-comprehension'
    }
  }),
  serp_lang_counting_syllables: Ember.Object.create({
    apiType: 'serp_lang_counting_syllables_question',
    component: {
      player: 'player.questions.qz-serp-counting-syllables',
      answer: 'reports.assessment.questions.qz-serp-counting-syllables'
    }
  }),
  serp_lang_syllable_division: Ember.Object.create({
    apiType: 'serp_lang_syllable_division_question',
    component: {
      player: 'player.questions.qz-serp-syllables-division',
      answer: 'reports.assessment.questions.qz-serp-syllables-division'
    }
  }),
  serp_classic: Ember.Object.create({
    apiType: 'serp_classic',
    component: {
      player: 'player.questions.qz-serp-classic',
      answer: 'reports.assessment.questions.qz-serp-classic'
    }
  }),
  serp_choose_one: Ember.Object.create({
    apiType: 'serp_choose_one',
    component: {
      player: 'player.questions.qz-serp-choose-one',
      answer: 'reports.assessment.questions.qz-serp-choose-one'
    }
  }),
  serp_pick_n_choose: Ember.Object.create({
    apiType: 'serp_pick_n_choose',
    component: {
      player: 'player.questions.qz-serp-pick-n-choose',
      answer: 'reports.assessment.questions.qz-serp-pick-n-choose'
    }
  }),
  serp_sorting: Ember.Object.create({
    apiType: 'serp_sorting',
    component: {
      player: 'player.questions.qz-serp-sorting',
      answer: 'reports.assessment.questions.qz-serp-sorting'
    }
  }),
  serp_multi_choice: Ember.Object.create({
    apiType: 'serp_multi_choice',
    component: {
      player: 'player.questions.qz-serp-multi-choice',
      answer: 'reports.assessment.questions.qz-serp-multi-choice'
    }
  }),
  serp_identify_vowel_sound_activity_question: Ember.Object.create({
    apiType: 'serp_identify_vowel_sound_activity_question',
    component: {
      player: 'player.questions.qz-serp-identify-vowel',
      answer: 'reports.assessment.questions.qz-serp-identify-vowel'
    }
  })
};

/**
 * Returns the question config information
 * @param {string} questionType
 * @param {string} propertyPath a valid property path inside the question config object
 */
export function getQuestionConfig(questionType, propertyPath) {
  let config = QUESTION_CONFIG[questionType];

  if (!config) {
    Ember.Logger.error(
      `Questions of type ${questionType} are currently not supported`
    );
  } else if (propertyPath && !config.get(propertyPath)) {
    Ember.Logger.error(
      `Property not found ${propertyPath} for question type ${questionType}`
    );
  } else {
    config = propertyPath ? config.get(propertyPath) : config;
  }

  return config;
}

/**
 * Returns the question type based on apiType
 * @param {string} apiType, a valid question apiType from API 3.0
 */
export function getQuestionTypeByApiType(apiType) {
  let type = null;
  for (var property in QUESTION_CONFIG) {
    if (QUESTION_CONFIG.hasOwnProperty(property)) {
      if (QUESTION_CONFIG[property].apiType === apiType) {
        type = property;
        break;
      }
    }
  }
  return type;
}

/**
 * Gets the question util per question type
 * @param {string} questionType
 * @returns {Object|*}
 */
export function getQuestionUtil(questionType) {
  return getQuestionConfig(questionType, 'util');
}

/**
 * Returns the new question api type for API 3.0
 * @param {string} questionType
 * @returns {string}
 */
export function getQuestionApiType(questionType) {
  return getQuestionConfig(questionType, 'apiType');
}

// LaTeX expressions used in rich text editor
export const LATEX_EXPRESSIONS = {
  fraction: '\\frac{}{}',
  sqrt: '\\sqrt{}',
  sqrtn: '\\sqrt[{}]{}',
  overline: '\\overline{}',
  angles: '\\langle{}',
  sum: '\\sum{}',
  sin: '\\sin\\left({}\\right)',
  cos: '\\cos\\left({}\\right)',
  tan: '\\tan\\left({}\\right)',
  in: '\\in',
  notin: '\\notin',
  exists: '\\exists',
  nexists: '\\nexists',
  ge: '\\ge',
  gt: '\\gt',
  lambda: '\\Lambda',
  omega: '\\Omega',
  infinity: '\\infty',
  subscript: '{}_{}',
  superscript: '{}^{}',
  'over-left-arrow': '\\overleftarrow{}',
  'over-right-arrow': '\\overrightarrow{}',
  div: '\\div',
  plus: '\\+',
  minus: '\\-',
  mult: '\\times',
  cdot: '\\cdot',
  'not-equal': '\\neq',
  lt: '\\lt',
  le: '\\le',
  sim: '\\sim',
  approx: '\\approx',
  alpha: '\\alpha',
  pmatrix: '\\left({}\\right)',
  Bmatrix: '\\left\\{{} \\right\\}',
  vmatrix: '\\left|{} \\right|',
  angle: '\\angle',
  measuredangle: '\\measuredangle',
  bot: '\\bot',
  parallel: '\\parallel',
  sigma: '\\Sigma',
  theta: '\\Theta',
  pi: '\\pi'
};

export const VOWELS_LETTERS = ['a', 'e', 'i', 'o', 'u'];

export const REPORT_SCORE_QUESTION_TYPES = [
  'serp_encoding_assessment',
  'serp_lang_identify_base_word',
  'serp_lang_vowel_teams',
  'serp_lang_counting_syllables',
  'serp_lang_syllable_division',
  'serp_choose_one',
  'serp_pick_n_choose',
  'serp_classic',
  'serp_sorting',
  'serp_multi_choice',
  'serp_identify_vowel_sound_activity_question'
];

export const EXCLUDE_SCORE_QUESTION_TYPES = [
  'likert_scale_question',
  'serp_lang_activities_for_comprehension',
  'scientific_fill_in_the_blank'
];

export const TOUCH_QUESTION_TYPES = [
  'serp_lang_vowel_teams',
  'serp_lang_syllable_division',
  'serp_lang_identify_digraph',
  'serp_lang_identify_base_word'
];

export const ANSWER_SCORE_TYPE_ENUM = {
  correct: 'correct',
  incorrect: 'incorrect',
  partiallyCorrect: 'partially-correct'
};
