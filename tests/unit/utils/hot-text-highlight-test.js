import Ember from 'ember';
import {
  getWordItems,
  getSentenceItems,
  getItems,
  transformText,
  splitWithIndex
} from 'quizzes-addon/utils/question/hot-text-highlight';

import { module, test } from 'qunit';

module('Unit | Utility | hot text highlight');

test('Hot Text Highlight - getWordItems', function(assert) {
  assert.expect(5);
  const mapItems = ({ index, text }) => ({ index, text });

  //with no words
  let wordItems = getWordItems('');
  assert.equal(wordItems.length, 0, 'Wrong number of items');

  //with one word
  wordItems = getWordItems('text');
  assert.equal(wordItems.length, 1, 'Wrong number of items');
  assert.equal(wordItems[0].get('index'), 0, 'Wrong index for first object');
  assert.equal(wordItems[0].get('text'), 'text', 'Wrong text for first object');

  //with many words
  wordItems = getWordItems('  A  phrase with  many words and extra spaces   ');
  const expectedItems = [
    { index: 2, text: 'A' },
    { index: 5, text: 'phrase' },
    { index: 12, text: 'with' },
    { index: 18, text: 'many' },
    { index: 23, text: 'words' },
    { index: 29, text: 'and' },
    { index: 33, text: 'extra' },
    { index: 39, text: 'spaces' }
  ];
  assert.deepEqual(
    wordItems.map(mapItems),
    expectedItems,
    'Wrong values for items'
  );
});

test('Hot Text Highlight - getSentenceItems', function(assert) {
  assert.expect(12);
  const mapItems = ({ index, text }) => ({ index, text });

  //with no text
  let sentenceItems = getSentenceItems('');
  let expectedItems = [];
  assert.equal(sentenceItems.length, 0, 'Wrong number of items');

  //with no correct
  sentenceItems = getSentenceItems('Sentence 1');
  assert.equal(sentenceItems.length, 1, 'Wrong number of items');
  assert.equal(sentenceItems[0].get('index'), 0, 'Wrong id for first object');
  assert.equal(
    sentenceItems[0].get('text'),
    'Sentence 1',
    'Wrong text for first object'
  );

  //with many sentences, 1 correct
  expectedItems = [
    { index: 0, text: 'Sentence 1.' },
    { index: 12, text: 'Sentence 2.' },
    { index: 24, text: 'Sentence 3' }
  ];
  sentenceItems = getSentenceItems('Sentence 1. Sentence 2. Sentence 3');
  assert.equal(sentenceItems.length, 3, 'Wrong number of items');
  assert.deepEqual(
    sentenceItems.map(mapItems),
    expectedItems,
    'Wrong values for sentence items'
  );

  //with many sentences, many correct
  expectedItems = [
    { index: 0, text: 'Sentence 1.' },
    { index: 13, text: 'Sentence 2.' },
    { index: 25, text: 'Sentence 3.' },
    { index: 37, text: 'Sentence 4.' },
    { index: 50, text: 'Sentence 5' }
  ];
  sentenceItems = getSentenceItems(
    'Sentence 1.  Sentence 2. Sentence 3. Sentence 4.  Sentence 5'
  );
  assert.equal(sentenceItems.length, 5, 'Wrong number of items');
  assert.deepEqual(
    sentenceItems.map(mapItems),
    expectedItems,
    'Wrong values for sentence items'
  );

  //with many sentences between correct answer
  expectedItems = [
    { index: 1, text: 'Sentence 1.' },
    { index: 13, text: 'Sentence 2.' },
    { index: 25, text: 'Sentence 3.' },
    { index: 38, text: 'Sentence 4.' },
    { index: 50, text: 'Sentence 5 .' },
    { index: 63, text: 'Sentence 6.' },
    { index: 75, text: 'Sentence 7' }
  ];
  sentenceItems = getSentenceItems(
    ' Sentence 1. Sentence 2. Sentence 3.  Sentence 4. Sentence 5 . Sentence 6. Sentence 7'
  );
  assert.equal(sentenceItems.length, 7, 'Wrong number of items');
  assert.deepEqual(
    sentenceItems.map(mapItems),
    expectedItems,
    'Wrong values for sentence items'
  );

  //with many sentences between correct answer having phrases using dot (.)
  expectedItems = [
    { index: 0, text: 'Sentence 1.' },
    { index: 12, text: 'Sentence 2.' },
    { index: 24, text: 'Sentence 3.' },
    { index: 36, text: '1.6 millions.' },
    { index: 50, text: 'Sentence 5.' },
    { index: 62, text: 'Sentence 6.' },
    { index: 74, text: 'Sentence 7' }
  ];
  sentenceItems = getSentenceItems(
    'Sentence 1. Sentence 2. Sentence 3. 1.6 millions. Sentence 5. Sentence 6. Sentence 7'
  );
  assert.equal(sentenceItems.length, 7, 'Wrong number of items');
  assert.deepEqual(
    sentenceItems.map(mapItems),
    expectedItems,
    'Wrong values for sentence items'
  );
});

test('Hot Text Highlight - getItems isHotTextHighlightWord', function(assert) {
  assert.expect(2);
  const mapItems = ({ index, text }) => ({ index, text });
  const question = Ember.Object.create({
    body: 'Many correct items  in this &sentence 23',
    isHotTextHighlightWord: true
  });
  const items = getItems(question);
  const expectedItems = [
    { index: 0, text: 'Many' },
    { index: 5, text: 'correct' },
    { index: 13, text: 'items' },
    { index: 20, text: 'in' },
    { index: 23, text: 'this' },
    { index: 28, text: '&sentence' },
    { index: 38, text: '23' }
  ];

  assert.equal(items.length, 7, 'Missing items');
  assert.deepEqual(
    items.map(mapItems),
    expectedItems,
    'Wrong values for items'
  );
});

test('Hot Text Highlight - getItems isHotTextHighlightSentence', function(
  assert
) {
  assert.expect(2);
  const mapItems = ({ index, text }) => ({ index, text });
  const question = Ember.Object.create({
    body: 'Sentence 1. Sentence 2. Sentence 3. Sentence 4. Sentence 5',
    isHotTextHighlightWord: false
  });

  const items = getItems(question);
  const expectedItems = [
    { index: 0, text: 'Sentence 1.' },
    { index: 12, text: 'Sentence 2.' },
    { index: 24, text: 'Sentence 3.' },
    { index: 36, text: 'Sentence 4.' },
    { index: 48, text: 'Sentence 5' }
  ];

  assert.equal(items.length, 5, 'Missing items');
  assert.deepEqual(
    items.map(mapItems),
    expectedItems,
    'Wrong values for items'
  );
});

test('Hot Text Highlight - transformText', function(assert) {
  assert.expect(4);

  //removing wrapping <p> tag for a normal text
  var text = transformText('<p> This is a test [for] the transform text </p>');
  assert.equal(text, 'This is a test [for] the transform text', 'Wrong text');

  //removing wrapping <p> tag for a text having more html tag inside
  text = transformText(
    '<p> This is a test [<p>for</p>] <b>the</b> transform text </p>'
  );
  assert.equal(text, 'This is a test [<p>for</p>] <b>the</b> transform text');

  //ignoring a text not having a wrapping <p> tag, but <p> tags inside
  text = transformText('This is a test [<p>for</p>] <b>the</b> transform text');
  assert.equal(text, 'This is a test [<p>for</p>] <b>the</b> transform text');

  //ignoring a text a starting <p> tag which, but not wrapping the whole text
  text = transformText(
    '<p>This is a test</p> [<p>for</p>] <b>the</b> transform text'
  );
  assert.equal(
    text,
    '<p>This is a test</p> [<p>for</p>] <b>the</b> transform text'
  );
});

test('Hot Text Highlight - splitWithIndex', function(assert) {
  assert.expect(2);

  const expectedResult = [
    { index: 0, text: 'This' },
    { index: 5, text: 'is' },
    { index: 8, text: 'a' },
    { index: 10, text: 'test' },
    { index: 15, text: 'for' },
    { index: 19, text: 'split' },
    { index: 25, text: 'with' },
    { index: 30, text: 'index' }
  ];
  let result = splitWithIndex('This@is@a@test@for@split@with@index', /@/);
  assert.deepEqual(result, expectedResult, 'Wrong values for items');

  result = splitWithIndex('This is a test for split with index', ' ');
  assert.deepEqual(result, expectedResult, 'Wrong values for items');
});
