// File max size in MB
export const FILE_MAX_SIZE_IN_MB = 12;

export const RESOURCE_COMPONENT_MAP = {
  'video/youtube': 'player.resources.qz-youtube-resource',
  'resource/url': 'qz-preview-url',
  handouts: 'qz-preview-url',
  image: 'qz-preview-url',
  'vimeo/video': 'player.resources.qz-vimeo-resource',
  'resource/html': 'player.resources.qz-html-resource'
};

export const UPLOADABLE_TYPES = [
  {
    value: 'image',
    validExtensions: '.jpg, .jpeg, .gif, .png',
    validType: 'image/*'
  },
  {
    value: 'text',
    validExtensions: '.pdf',
    validType: 'application/pdf'
  }
];

export const RESOURCE_TYPES = {
  webpage: 'webpage_resource',
  video: 'video_resource',
  interactive: 'interactive_resource',
  audio: 'audio_resource',
  image: 'image_resource',
  text: 'text_resource',
  html: 'html_resource'
};

export const QUIZZES_RESOURCE_TYPES = {
  url: 'resource/url',
  youtube: 'video/youtube',
  vimeo: 'vimeo/video',
  pdf: 'handouts',
  image: 'image',
  html: 'resource/html'
};

export const DEFAULT_IMAGES = {
  USER_PROFILE: 'assets/quizzes-addon/quizzes/profile.png',
  COURSE: '/assets/quizzes/course-default.png',
  COLLECTION: '/assets/gooru/collection-default.png',
  ASSESSMENT: '/assets/gooru/assessment-default.png',
  QUESTION_PLACEHOLDER_IMAGE: '/assets/quizzes/question-placeholder-image.png'
};

export const K12_CATEGORY = {
  value: 'k_12',
  apiCode: 'K12',
  label: 'common.categoryOptions.k12'
};

export const TAXONOMY_CATEGORIES = [
  K12_CATEGORY,
  {
    value: 'higher_education',
    apiCode: 'HE',
    label: 'common.categoryOptions.higher-ed'
  },
  {
    value: 'professional_learning',
    apiCode: 'PL',
    label: 'common.categoryOptions.professional-dev'
  }
];

export const CONTENT_TYPES = {
  COLLECTION: 'collection',
  ASSESSMENT: 'assessment',
  EXTERNAL_ASSESSMENT: 'assessment-external',
  COURSE: 'course',
  UNIT: 'unit',
  LESSON: 'lesson',
  RESOURCE: 'resource',
  QUESTION: 'question'
};

export const KEY_CODES = {
  DOWN: 40,
  ENTER: 13,
  ESCAPE: 27,
  LEFT: 37,
  RIGHT: 39,
  SPACE: 32,
  UP: 38
};
export const VIEW_LAYOUT_PICKER_OPTIONS = {
  LIST: 'list',
  THUMBNAILS: 'thumbnails'
};

export const EMOTION_VALUES = [
  { value: 5, unicode: '1f601' },
  { value: 4, unicode: '1f642' },
  { value: 3, unicode: '1f610' },
  { value: 2, unicode: '1f641' },
  { value: 1, unicode: '1f625' }
];

// unicode values for the correct and incorrect svg files
export const FEEDBACK_EMOTION_VALUES = {
  CORRECT: '1f44d',
  INCORRECT: '1f44e'
};

export const SCORES = {
  REGULAR: 60,
  GOOD: 70,
  VERY_GOOD: 80,
  EXCELLENT: 90
};

export const GRADING_SCALE = [
  { LOWER_LIMIT: 0, COLOR: '#F46360' }, //red-400
  { LOWER_LIMIT: 60, COLOR: '#ED8E36' }, //orange-400
  { LOWER_LIMIT: 70, COLOR: '#F8BA41' }, //yellow-400
  { LOWER_LIMIT: 80, COLOR: '#A3CA9F' }, //green-200
  { LOWER_LIMIT: 90, COLOR: '#4B9741' } //green-400
];

export const CONTEXT_EVENT_TYPES = {
  FINISH: 'finishContextEvent',
  ON_RESOURCE: 'onResourceEvent',
  START: 'startContextEvent'
};

export const CORRECT_COLOR = GRADING_SCALE[GRADING_SCALE.length - 1].COLOR; //green-400

export const INCORRECT_COLOR = GRADING_SCALE[0].COLOR; //red-400

export const ANONYMOUS_COLOR = '#0072BC'; //blue-400

export const OPEN_ENDED_COLOR = '#0072BC'; //blue-400

export const NO_ANSWER_COLOR = '#FFFFFF'; //white

// Height of the application header in pixels
export const HEADER_HEIGHT = 50;

export const REAL_TIME_CLIENT = {
  CONNECTION_ATTEMPT_DELAY: 3000,
  OUTGOING_HEARTBEAT: 5000,
  INCOMING_HEARTBEAT: 5000
};

export const ENTITY_TYPE = {
  CONTENT: 'content',
  USER: 'user'
};

export const NETWORK_TYPE = {
  FOLLOWING: 'followings',
  FOLLOWERS: 'followers'
};

export const COUNTRY_CODES = {
  US: 'US'
};

export const DEFAULT_PAGE_SIZE = 50;

export const DEFAULT_SEARCH_PAGE_SIZE = 20;

export const TAXONOMY_LEVELS = {
  COURSE: 'course',
  DOMAIN: 'domain',
  STANDARD: 'standard',
  MICRO: 'micro-standard'
};

export const CODE_TYPES = {
  STANDARD_CATEGORY: 'standard_level_0',
  STANDARD: 'standard_level_1',
  SUB_STANDARD: 'standard_level_2',
  LEARNING_TARGET_L0: 'learning_target_level_0',
  LEARNING_TARGET_L1: 'learning_target_level_1',
  LEARNING_TARGET_L2: 'learning_target_level_2'
};

export const GOORU_DEFAULT_STANDARD = 'GDF';

export const ASSESSMENT_SHOW_VALUES = {
  IMMEDIATE: 'immediate',
  SUMMARY: 'summary',
  NEVER: 'never'
};

export const MAX_ATTEMPTS = 10;

/* token expiration time in milliseconds */
export const TOKEN_EXPIRATION_TIME = 180000;

export const RESERVED_WORDS = [
  'account-settings',
  'analytics',
  'assessments',
  'class',
  'classes',
  'collections',
  'content',
  'context-player',
  'courses',
  'featured',
  'forgot-password',
  'home',
  'index',
  'integration',
  'logout',
  'network',
  'player',
  'profile',
  'questions',
  'reports',
  'reset-password',
  'resources',
  'search',
  'sign-in',
  'sign-up',
  'sign-up-finish'
];

export const DEFAULT_AVAILABLE_TIME = '12:00 am';
export const DEFAULT_DUE_TIME = '11:30 pm';

export const FIB_REGEX = /\[](?!{)/;

export const PLAYER_EVENT_SOURCE = {
  RGO: 'rgo'
};

export const PLAYER_EVENT_MESSAGE = {
  GRU_PUllUP_CLOSE: 'gru_pullup_close',
  GRU_LOADING_COMPLETED: 'gru_loading_completed'
};

export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher'
};

export const FEEDBACK_USER_CATEGORY = {
  teacher: 1,
  student: 2
};

export const FEEDBACK_RATING_TYPE = {
  QUANTITATIVE: 1,
  QUALITATIVE: 2,
  BOTH: 3
};

export const EMOTION_IMAGE = '/assets/quizzes-addon/emoji-one/emoji.svg';

export const NO_REACTION = 'no-reaction';
