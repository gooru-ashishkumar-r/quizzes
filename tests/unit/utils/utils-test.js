import Ember from 'ember';

import {
  alphabeticalStringSort,
  checkStandards,
  courseSectionsPrefix,
  formatDate,
  formatTime,
  formatTimeInSeconds,
  getAnswerResultIcon,
  getScoreString,
  getReactionIcon,
  getGradeColor,
  getLetter,
  numberSort,
  generateUUID,
  cleanFilename,
  getFileNameFromInvalidUrl,
  replaceMathExpression,
  arrayIntoChunks
} from 'quizzes-addon/utils/utils';

import { module, test } from 'qunit';

module('Unit | Utility | utils');

test('alphabeticalStringSort', function(assert) {
  assert.deepEqual(['crayon'].sort(alphabeticalStringSort), ['crayon']);
  assert.deepEqual(['bull', 'brave'].sort(alphabeticalStringSort), [
    'brave',
    'bull'
  ]);
  assert.deepEqual(['wave', 'animal', 'Goose'].sort(alphabeticalStringSort), [
    'animal',
    'Goose',
    'wave'
  ]);
  assert.deepEqual(['Ankle', 'pArrot', 'orange'].sort(alphabeticalStringSort), [
    'Ankle',
    'orange',
    'pArrot'
  ]);
  assert.deepEqual(
    ['Colbert, John', 'Carson, Michael', 'Caesar, Jules'].sort(
      alphabeticalStringSort
    ),
    ['Caesar, Jules', 'Carson, Michael', 'Colbert, John']
  );
});

test('checkStandards', function(assert) {
  var standards = Ember.A();
  standards.addObject(Ember.Object.create({ id: '1', disabled: false }));
  standards.addObject(Ember.Object.create({ id: '2', disabled: false }));
  var checkableStandards = ['1', '2'];
  var codes = ['1', '3'];

  checkStandards(standards, checkableStandards, codes);

  assert.equal(standards[0].get('disabled'), false);
  assert.equal(standards[1].get('disabled'), true);
});

test('courseSectionsPrefix', function(assert) {
  var i18n = Ember.Object.create({
    t: function(key) {
      let letter;
      if (key === 'common.unitInitial') {
        letter = 'U';
      } else if (key === 'common.lessonInitial') {
        letter = 'L';
      } else if (key === 'common.collectionInitial') {
        letter = 'C';
      } else if (key === 'common.assessmentInitial') {
        letter = 'A';
      } else if (key === 'common.unit') {
        letter = 'Unit';
      } else if (key === 'common.lesson') {
        letter = 'Lesson';
      } else if (key === 'common.collection') {
        letter = 'Collection';
      } else if (key === 'common.assessment') {
        letter = 'Assessment';
      }
      return letter;
    }
  });

  assert.equal(
    courseSectionsPrefix(1, 'unit', i18n),
    'U2',
    'The prefix should be U2'
  );
  assert.equal(
    courseSectionsPrefix(1, 'lesson', i18n),
    'L2',
    'The prefix should be L2'
  );
  assert.equal(
    courseSectionsPrefix(1, 'collection', i18n),
    'C2',
    'The prefix should be C2'
  );
  assert.equal(
    courseSectionsPrefix(1, 'assessment', i18n),
    'A2',
    'The prefix should be A2'
  );
  assert.equal(
    courseSectionsPrefix(1, 'unit', i18n, true),
    'Unit 2',
    'The prefix should be Unit 2'
  );
  assert.equal(
    courseSectionsPrefix(1, 'lesson', i18n, true),
    'Lesson 2',
    'The prefix should be Lesson 2'
  );
  assert.equal(
    courseSectionsPrefix(1, 'collection', i18n, true),
    'Collection 2',
    'The prefix should be Collection 2'
  );
  assert.equal(
    courseSectionsPrefix(1, 'assessment', i18n, true),
    'Assessment 2',
    'The prefix should be Assessemnt 2'
  );
});

test('formatDate', function(assert) {
  const date = new Date(2010, 1, 20);
  date.setSeconds(10);
  date.setMinutes(15);
  date.setHours(11);
  //trying default format
  assert.equal(
    formatDate(date),
    'Saturday, February 20th, 2010 11:15 AM',
    'Wrong date format'
  );

  //trying custom format
  assert.equal('Feb 20th 10', formatDate(date, 'MMM Do YY'));
});

test('formatTime', function(assert) {
  const oneHour = 3600 * 1000;
  assert.equal('1h ', formatTime(oneHour));
  const oneMin = 60 * 1000;
  assert.equal('1m ', formatTime(oneMin));
  const oneSec = 1000;

  assert.equal('1s', formatTime(oneSec));
  assert.equal('1h 1m', formatTime(oneHour + oneMin));
  assert.equal('1m 1s', formatTime(oneMin + oneSec));
  assert.equal('', formatTime(null));
});

test('formatTimeInSeconds', function(assert) {
  assert.equal(formatTimeInSeconds(1), '1s');
  assert.equal(formatTimeInSeconds(3600 + 60), '1h 1m');
  assert.equal(formatTimeInSeconds(60 + 1), '1m 1s');
  assert.equal(formatTimeInSeconds(87), '1m 27s');
  assert.equal(formatTimeInSeconds(119), '1m 59s');
  assert.equal(formatTimeInSeconds(1433), '23m 53s');
  assert.equal(formatTimeInSeconds(null), '');
});

test('getAnswerResultIcon', function(assert) {
  assert.equal(
    getAnswerResultIcon('correct'),
    '<span class="score answer-correct"><i class="gru-icon material-icons">ic_done_all</i></span>'
  );
  assert.equal(
    getAnswerResultIcon('incorrect'),
    '<span class="score answer-incorrect"><i class="gru-icon material-icons">clear</i></span>'
  );
  assert.equal(
    getAnswerResultIcon('skipped'),
    '<span class="score answer-skipped"></span>'
  );
  assert.equal(
    getAnswerResultIcon('extended_text'),
    '<span class="score answer-extended_text"></span>'
  );
  assert.equal(
    getAnswerResultIcon(''),
    '<span class="score answer-not-started"></span>'
  );
});

test('getScoreString', function(assert) {
  assert.equal(
    getScoreString(64),
    '<span class="score" style="background-color: #ED8E36">64 %</span>'
  );
  assert.equal(
    getScoreString(null),
    '<span class="score answer-undefined"></span>'
  );
  assert.equal(
    getAnswerResultIcon(undefined),
    '<span class="score answer-not-started"></span>'
  );
  assert.equal(
    getAnswerResultIcon(''),
    '<span class="score answer-not-started"></span>'
  );
});

test('getReactionIcon', function(assert) {
  var startsWith = function(value, fragment) {
    return getReactionIcon(value).indexOf(fragment) >= 0;
  };
  assert.equal(startsWith(5, '<div class="emotion emotion-5'), true);
  assert.equal(startsWith(4, '<div class="emotion emotion-4'), true);
  assert.equal(startsWith(3, '<div class="emotion emotion-3'), true);
  assert.equal(startsWith(2, '<div class="emotion emotion-2'), true);
  assert.equal(startsWith(1, '<div class="emotion emotion-1'), true);
  assert.equal(getReactionIcon(null), '&mdash;');
  assert.equal(getReactionIcon(undefined), '');
  assert.equal(getReactionIcon(false), '');
  assert.equal(getReactionIcon(''), '');
});

test('getGradeColor', function(assert) {
  assert.equal(
    getGradeColor(0),
    '#F46360',
    'First bracket color -lowest value'
  );
  assert.equal(
    getGradeColor(30),
    '#F46360',
    'First bracket color -value in the middle'
  );
  assert.equal(
    getGradeColor(59),
    '#F46360',
    'First bracket color -highest value'
  );

  assert.equal(
    getGradeColor(60),
    '#ED8E36',
    'Second bracket color -lowest value'
  );
  assert.equal(
    getGradeColor(65),
    '#ED8E36',
    'Second bracket color -value in the middle'
  );
  assert.equal(
    getGradeColor(69),
    '#ED8E36',
    'Second bracket color -highest value'
  );

  assert.equal(
    getGradeColor(70),
    '#F8BA41',
    'Third bracket color -lowest value'
  );
  assert.equal(
    getGradeColor(75),
    '#F8BA41',
    'Third bracket color -value in the middle'
  );
  assert.equal(
    getGradeColor(79),
    '#F8BA41',
    'Third bracket color -highest value'
  );

  assert.equal(
    getGradeColor(80),
    '#A3CA9F',
    'Fourth bracket color -lowest value'
  );
  assert.equal(
    getGradeColor(85),
    '#A3CA9F',
    'Fourth bracket color -value in the middle'
  );
  assert.equal(
    getGradeColor(89),
    '#A3CA9F',
    'Fourth bracket color -highest value'
  );

  assert.equal(
    getGradeColor(90),
    '#4B9741',
    'Fifth bracket color -lowest value'
  );
  assert.equal(
    getGradeColor(95),
    '#4B9741',
    'Fifth bracket color -value in the middle'
  );
  assert.equal(
    getGradeColor(100),
    '#4B9741',
    'Fifth bracket color -highest value'
  );
});

test('getLetter', function(assert) {
  assert.equal(getLetter(3), 'D', 'The letter should be D');
});

test('numberSort', function(assert) {
  // Per http://stackoverflow.com/questions/4783242/javascript-array-sort-with-undefined-values,
  // undefined values will always be moved to the end of the array
  assert.deepEqual([2].sort(numberSort), [2]);
  assert.deepEqual([2, 0].sort(numberSort), [0, 2]);
  assert.deepEqual([2, undefined].sort(numberSort), [2, undefined]);
  assert.deepEqual([null, 3].sort(numberSort), [null, 3]);
  assert.deepEqual([7, false, undefined, 3].sort(numberSort), [
    false,
    3,
    7,
    undefined
  ]);
  assert.deepEqual([2, 5, 3].sort(numberSort), [2, 3, 5]);
});

test('Check Uuid format', function(assert) {
  var uuid = generateUUID();
  assert.ok(
    uuid.match(/([a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}?)/i),
    'The uuid is not correct'
  );
});

test('Clean filename', function(assert) {
  var id = `${generateUUID()}.png`;
  var url = `//test-bucket01.s3.amazonaws.com/test/${id}`;
  assert.equal(
    cleanFilename(url),
    `test/${id}`,
    'Wrong filename with complete url.'
  );
  assert.equal(
    cleanFilename(`http:${url}`),
    `test/${id}`,
    'Wrong filename with complete url.'
  );
  assert.equal(cleanFilename(id), id, 'Wrong filename without complete url.');
  assert.equal(cleanFilename(null), '', 'Wrong filename without complete url.');
  assert.equal(
    cleanFilename(url, { content: '//test-bucket01.s3.amazonaws.com/test/' }),
    id,
    'Wrong filename with cdn urls.'
  );
});

test('Get File Name from Invalid URL', function(assert) {
  var url = '//content.gooru.org/content/f000/2441/3377/FromAtoZinc.pdf';
  assert.equal(
    getFileNameFromInvalidUrl(url),
    'FromAtoZinc.pdf',
    'Wrong filename.'
  );
});

test('Replace Math Expression', function(assert) {
  var mathExpression =
    '<span class=\'gru-math-expression\'><span class=\'source\' hidden=\'\'>\frac{1}{2}</span><span class=\'katex\'>here goes the katex expression</span></span><br>';

  var expected =
    '<span class="gru-math-expression"><span class="gru-math-expression"><span class="source" hidden="">\frac{1}{2}</span>$$\frac{1}{2}$$</span></span><br>';

  assert.equal(
    replaceMathExpression(mathExpression),
    expected,
    'Wrong expression'
  );
});

test('Array into chunks', function(assert) {
  const array = [...Array(10).keys()];
  let expected = [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]];
  assert.deepEqual(
    arrayIntoChunks(array, 2),
    expected,
    'Wrong split into chunks of size 2'
  );
  expected = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9]];
  assert.deepEqual(
    arrayIntoChunks(array, 5),
    expected,
    'Wrong split into chunks of size 5'
  );
});

// test('loadScriptFile', async function(assert) {
//   await loadScript('en', true).then(s => assert.ok(s));
// });
