import Ember from 'ember';
import { isNumeric } from 'quizzes-addon/utils/math';
import {
  DEFAULT_IMAGES,
  EMOTION_VALUES,
  GRADING_SCALE
} from 'quizzes-addon/config/quizzes-config';
/**
 * Function for sorting strings alphabetically in ascending order
 * @param {string} a
 * @param {string} b
 * @returns {number} - -1 if 'a' should go before 'b'; 1 if 'b' should go before 'a'; or else, 0.
 */
export function alphabeticalStringSort(a, b) {
  const lowerCaseA = a ? a.toLowerCase() : a;
  const lowerCaseB = b ? b.toLowerCase() : b;
  return lowerCaseA < lowerCaseB ? -1 : lowerCaseA > lowerCaseB ? 1 : 0;
}

/**
 * Check the standards that are checkable against the codes (provided by user)
 * and disable those who are not in codes arrays.
 * @param standards
 * @param checkableStandards
 * @param codes
 */
export function checkStandards(standards, checkableStandards, codes) {
  standards.forEach(function(standard) {
    if (checkableStandards.includes(standard.get('id'))) {
      standard.set('disabled', !codes.includes(standard.get('id')));
    }
  });
}

/**
 * Formats the Unit, Lesson, Assessment and Collection label
 * @param {number} index
 * @param {string} type
 * @param {service} i18n
 */
export function courseSectionsPrefix(index, type, i18n, longName) {
  index += 1;
  var prefixIndex = index;
  var letter;
  var sectionPrefix;
  if (longName) {
    const i18nKey = `common.${type}`;
    letter = i18n.t(i18nKey);
    sectionPrefix = `${letter} ${prefixIndex}`;
  } else {
    const i18nKey = `common.${type}Initial`;
    letter = i18n.t(i18nKey);
    sectionPrefix = `${letter}${prefixIndex}`;
  }

  return sectionPrefix;
}

/**
 * Formats a date into a string
 * @param {Date} date
 * @param {string} format
 */
export function formatDate(date, format) {
  format = format || 'dddd, MMMM Do, YYYY h:mm A';
  return moment(date).format(format);
}

/**
 * Format a certain number of milliseconds to a string of the form
 * '<hours>h <min>m or <min>m <sec>s'. If the value is falsey, a string
 * with the value '--' is returned
 * @param timeInMillis - time value in milliseconds
 * @returns {String}
 */
export function formatTime(timeInMillis) {
  var result = '';
  var secs;

  if (timeInMillis) {
    secs = timeInMillis / 1000;
    const hours = secs / 3600;
    secs = secs % 3600;
    const mins = secs / 60;
    secs = secs % 60;

    if (hours >= 1) {
      result = `${Math.floor(hours)}h `;
      if (mins >= 1) {
        result += `${Math.floor(mins)}m`;
      }
    } else {
      if (mins >= 1) {
        result = `${Math.floor(mins)}m `;
      }
      if (secs >= 1) {
        result += `${Math.floor(secs)}s`;
      }
    }
  } else {
    result = '';
  }

  return result;
}

/**
 * Format a certain number of milliseconds to a string of the rounded form
 * '<hours>h or <min>m or <sec>s'. If the value is falsey, a string
 * with the value '--' is returned
 * @param timeInMillis - time value in milliseconds
 * @returns {String}
 */
export function roundTimeToGreatestValue(timeInMillis) {
  var result = '';
  var secs;

  if (timeInMillis) {
    secs = timeInMillis / 1000;
    const hours = secs / 3600;
    secs = secs % 3600;
    const mins = secs / 60;
    secs = secs % 60;

    if (hours >= 1) {
      result = `${Math.round(hours)}h `;
    } else {
      if (mins >= 1) {
        result = `${Math.round(mins)}m `;
      } else {
        if (secs >= 1) {
          result += `${Math.round(secs)}s`;
        }
      }
    }
  } else {
    result = '';
  }

  return result;
}

/**
 * Format a certain number of seconds to a string of the form
 * '<hours>h <min>m or <min>m <sec>s'. If the value is falsey, a string
 * with the value '--' is returned
 * @param timeInSeconds - time value in seconds
 * @returns {String}
 */
export function formatTimeInSeconds(timeInSeconds) {
  return formatTime(timeInSeconds * 1000);
}

/**
 * Get an icon depending on whether an answer was correct or not.
 * @param {String} status - It has the status of answer
 * @returns {String} - html string
 */
export function getAnswerResultIcon(status) {
  var html;
  if (status === 'correct') {
    html =
      '<span class="score answer-correct"><i class="gru-icon material-icons">ic_done_all</i></span>';
  } else if (status === 'incorrect') {
    html =
      '<span class="score answer-incorrect"><i class="gru-icon material-icons">clear</i></span>';
  } else if (status === 'skipped') {
    html = '<span class="score answer-skipped"></span>';
  } else if (status === 'extended_text') {
    html = '<span class="score answer-extended_text"></span>';
  } else {
    html = '<span class="score answer-not-started"></span>';
  }
  return html;
}

/**
 * Get an icon depending on whether an answer was correct or not.
 * @param {String} status - It has the status of answer
 * @returns {String} - html string
 */
export function getAnswerResultIconWithValue(status, value) {
  value = value ? value : '';
  var html;
  if (status === 'correct') {
    html = `<span class="score answer-correct">${value}</span>`;
  } else if (status === 'incorrect') {
    html = `<span class="score answer-incorrect">${value}</span>`;
  } else if (status === 'skipped') {
    html = `<span class="score answer-skipped">${value}</span>`;
  } else if (status === 'extended_text') {
    html = `<span class="score answer-extended_text">${value}</span>`;
  } else {
    html = `<span class="score answer-not-started">${value}</span>`;
  }
  return html;
}

/**
 * Get an icon depending on a reaction value. If the reaction value is null,
 * a dash is returned. For any other falsy value, an empty string is returned.
 * @param {Number} reactionValue
 * @returns {String} - html string
 */
export function getReactionIcon(reactionValue) {
  var html;

  if (reactionValue) {
    var reaction = EMOTION_VALUES.filter(function(emotion) {
      return emotion.value === reactionValue;
    })[0];
    if (reaction && reaction.value && reaction.unicode) {
      html = `<div class="emotion emotion-${reaction.value}">`;
      html += '  <svg class="svg-sprite">';
      html += `    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/quizzes-addon/emoji-one/emoji.svg#${reaction.unicode}"></use>`;
      html += ' </svg>';
      html += '</div>';
    } else {
      html = '&mdash;';
    }
  } else if (reactionValue === null) {
    html = '&mdash;';
  } else {
    html = '';
  }
  return html;
}

/**
 * Find the color corresponding to the grade bracket that a specific grade belongs to
 * @see quizzes/config/quizzes-config#GRADING_SCALE
 * @param grade
 * @returns {String} - Hex color value
 */
export function getGradeColor(grade) {
  var bracket = GRADING_SCALE.length - 1;
  var color = '#E3E5EA'; // Default color

  if (isNumeric(grade)) {
    for (; bracket >= 0; bracket--) {
      if (grade >= GRADING_SCALE[bracket].LOWER_LIMIT) {
        color = GRADING_SCALE[bracket].COLOR;
        break;
      }
    }
  }
  return color;
}

/**
 * Get a html of the score string.
 * @param {number} value - %value
 * @returns {String} - html string
 */
export function getScoreString(value) {
  if (typeof value === 'number') {
    const gradeColor = getGradeColor(value);
    return `<span class="score" style="background-color: ${gradeColor}">${value} %</span>`;
  }
  return '<span class="score answer-undefined"></span>';
}

/**
 * Convert a number into Upper Letter
 * @param number
 * @returns {string}
 */
export function getLetter(number) {
  return String.fromCharCode(65 + number);
}

/**
 * Function for sorting numbers in ascending order
 * @param {number} a
 * @param {number} b
 * @returns {number} - -1 if 'a' should go before 'b'; 1 if 'b' should go before 'a'; or else, 0.
 */
export function numberSort(a, b) {
  a = a ? a : !!a;
  b = b ? b : !!b;
  return a - b;
}

/**
 * Generates Uuid's
 */
export function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
    c
  ) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

/**
 * Truncates a text
 * @param {string} text
 * @param {number} maxLength max allowed length for text, optional
 * @param {string} type indicates the truncate type, optional
 * @param {boolean} suffix indicates if it adds or not a suffix, default is true
 * @returns {*}
 */
export function truncate(text, maxLength, type, suffix) {
  const config = {
    //TODO product owner will provide max lengths, this will be moved to the configuration
    name: 15,
    short: 10,
    'player-nav-sm': 30,
    medium: 35,
    'collection-card-courses': 45,
    'medium-large': 100,
    large: 200
  };
  const defaultType = 'short';

  if (!text) {
    return null;
  }

  if (!maxLength && !type) {
    //default behavior
    type = defaultType;
  }

  if (type) {
    maxLength = config[type] || config[defaultType];
  }

  const addSuffix = suffix !== false;

  let truncated = text;
  if (text.length > maxLength) {
    truncated = text.substring(0, maxLength);
    if (addSuffix) {
      truncated = `${truncated}...`;
    }
  }

  return truncated;
}

/**
 * Remove HTML tags
 * @param {string} text
 * @returns {*}
 */
export function noTags(text) {
  const element = document.createElement('p');
  element.innerHTML = text;
  return $(element).text();
}

/**
 * Returns a date in utc
 * @param {Date} date
 * @returs {Moment} utc moment
 */
export function toUtc(date) {
  return date ? moment(date).utc() : date;
}

/**
 * Returns a date in timestamp
 * @param {Date} date
 * @returs {number} timestamp
 */
export function toTimestamp(date) {
  return date ? date.getTime() : date;
}

/**
 * Returns a date in local time
 * @param {number} timestamp
 */
export function toLocal(timestamp) {
  return moment.utc(timestamp).toDate();
}
/**
 * Replace / to _
 *
 */
export function normalizeQuestionTypes(questionType) {
  return questionType.replace('/', '_');
}

/**
 * Returns filename from url
 * @param {String} file complete url
 */
export function cleanFilename(url, cdnUrls) {
  if (url) {
    var defaultImages = Ember.$.map(DEFAULT_IMAGES, value => value);
    if (cdnUrls) {
      url = url.replace(cdnUrls.content, '');
      url = url.replace(cdnUrls.user, '');
    }
  }
  return url && defaultImages.indexOf(url) < 0
    ? /([^/]*\/\/[^/]+\/)?(.+)/.exec(url)[2]
    : '';
}

/**
 * Returns filename with extension from a invalid url
 * @param {String} file complete url
 */
export function getFileNameFromInvalidUrl(url) {
  const regex = /\w+(?:\.\w+)*$/;
  const validURL = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  var match;
  if (validURL.exec(url)) {
    match = url;
  } else {
    match = regex.exec(url);
  }

  return match;
}
/**
 * Replace math expression before save
 */
export function replaceMathExpression(text) {
  var questionText = $.parseHTML(text);
  var newQuestionText = '';
  $.each(questionText, function(i, el) {
    const latex = $(el)
      .find('.source')
      .text();
    if (latex.length > 0) {
      const mathToSave = `<span class='gru-math-expression'><span class='source' hidden>${latex}</span>$$${latex}$$</span>`;
      $(el)
        .empty()
        .append(mathToSave);
    }
    if (el.outerHTML) {
      newQuestionText = newQuestionText.concat(el.outerHTML);
    } else {
      newQuestionText = newQuestionText.concat(el.textContent);
    }
  });

  return newQuestionText;
}

/**
 * Remove html tags to validate blanks
 */
export function removeHtmlTags(text) {
  var newText;

  if (text) {
    newText = text.replace(/(<([^>]+)>)/gi, '');
  }

  return newText;
}

/**
 * Split an array into chunks
 */
export function arrayIntoChunks(arr, chunkSize) {
  var chunks = [],
    i;
  for (i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Builds an absolute path for the cases where resource url is not absolute
 */
export function toAbsolutePath(resourceUrl, cdnUrl) {
  if (resourceUrl) {
    const protocolPattern = /^((http|https|ftp):\/\/)/;
    if (!protocolPattern.test(resourceUrl)) {
      //if no protocol add it
      const containsCdnUrl = resourceUrl.indexOf(cdnUrl) !== -1;
      if (!containsCdnUrl) {
        const cdnPattern = cdnUrl.match(/http|https/g);
        if (!cdnPattern) {
          resourceUrl = `https:${cdnUrl}${resourceUrl}`;
        } else {
          resourceUrl = `${cdnUrl}${resourceUrl}`;
        }
      }
    }
  }
  return resourceUrl;
}

/**
 *
 * @param {string} file token to load example 'en','gu'.. etc
 * @param {bool} isQuizzes, if to load a quzzies translation file
 */
export function loadScript(script) {
  var defineHeaders = function() {
    return {
      Authorization: 'Token '
    };
  };
  const localAssetMap = {
    ar: 'assets/locales/ar/translations.js',
    as: 'assets/locales/as/translations.js',
    bn: 'assets/locales/bn/translations.js',
    en: 'assets/locales/en/translations.js',
    gu: 'assets/locales/gu/translations.js',
    hi: 'assets/locales/hi/translations.js',
    kn: 'assets/locales/kn/translations.js',
    ml: 'assets/locales/ml/translations.js',
    mr: 'assets/locales/mr/translations.js',
    or: 'assets/locales/or/translations.js',
    pa: 'assets/locales/pa/translations.js',
    sp: 'assets/locales/sp/translations.js',
    ta: 'assets/locales/ta/translations.js',
    te: 'assets/locales/te/translations.js',
    ch: 'assets/locales/ch/translations.js'
  };

  let url = localAssetMap[script];
  let originLocation = `${window.location.origin}/`;
  url = originLocation + url;

  const options = {
    cache: true,
    type: 'GET',
    headers: defineHeaders(),
    url: url,
    dataType: 'script'
  };
  return Ember.$.ajax(url, options);
}

//TODO Need to improve this method to perform multiple levels of cloning
/**
 * @function getObjectCopy
 * @param {Object} originalObject
 * @return {Ember.Object} clonedObject
 * Method to perform object copy
 */
export function getObjectCopy(originalObject) {
  let clonedObject = Ember.Object.create();
  let objectKeys = Object.keys(originalObject);
  objectKeys.map(key => {
    clonedObject.set(`${key}`, originalObject[key]);
  });
  return clonedObject;
}

/**
 * @function getObjectsDeepCopy
 * @param {Array} objectElements
 * @return {Ember.Array} clonedObjectElements
 * Method to perform deep copy of list of objects
 */
export function getObjectsDeepCopy(objectElements) {
  let clonedObjectElements = Ember.A([]);
  if (Ember.isArray(objectElements)) {
    objectElements.map(originalObject => {
      clonedObjectElements.pushObject(getObjectCopy(originalObject));
    });
  }
  return clonedObjectElements;
}

/**
 * @function sec2time
 * @param {number} seconds
 * @return {Time} time
 * Method help to convert seconds to time format
 */
export function sec2time(timeInSeconds) {
  var pad = function(num, size) {
      return `000${num}`.slice(size * -1);
    },
    time = parseFloat(timeInSeconds).toFixed(3),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60);

  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}`;
}
