import Ember from 'ember';
/**
 * It contains convenience methods for grading and retrieving useful information
 * for hot text highlight
 *
 * # Answer object (structure required by the BE)
 *
 *   It is an array containing a json object for each user selection
 *
 *   text the text entered by the user, it also include inputs left blank
 *   status could be correct or incorrect based on the text entered
 *   order represents the text index, starting at 1
 *   answerId it is always 0
 *   skip is always false
 *
 * [{'text':'Tell','status':'incorrect','order':1,'answerId':0,'skip':false},
 * {'text':'nos.','status':'correct','order':14,'answerId':0,'skip':false},
 * {'text':'parens','status':'correct','order':31,'answerId':0,'skip':false}]
 *
 * # User answer (structure used by the FE)
 *
 *   It corresponds to an array representing the texts entered by the user
 *
 *   index represents the index of the text in the question, starting 0
 *   text the entered text
 *
 *   { {index: number, text: string }[] }
 *
 */

/**
 * Splits text and returns the index of each
 * @param {string} text
 * @param {string} regex delimiter
 * @returns {{index: number, text: string, selected: boolean}} items
 */
export function splitWithIndex(text, delim) {
  const regex = new RegExp(delim);
  let remainingText = text;
  const result = [];
  let index = 0;
  let nextSplit = regex.exec(remainingText);
  while (nextSplit) {
    const currentText = remainingText.slice(0, nextSplit.index);
    remainingText = remainingText
      .slice(nextSplit.index)
      .replace(nextSplit[0], '');
    result.push({
      text: currentText,
      index
    });
    index += nextSplit.index;
    nextSplit = regex.exec(remainingText);
  }
  if (index < text.length) {
    result.push({
      text: remainingText,
      lineBreaks: remainingText.match(/\n/) ? remainingText.match(/\n/gm) : 0,
      index
    });
  }

  return result;
}

/**
 * Transforms a list of string into item objects, it trims the texts and removes []
 * @param {string[]} textList
 *
 * @returns {{index: number, text: string, selected: boolean, correct: boolean}} items
 */
export function toItems(textList) {
  return textList
    .filter(item => !!item.text.trim())
    .map(item =>
      Ember.Object.create({
        index: item.index + item.text.search(/\S/),
        text: item.text,
        selected: false
      })
    );
}

/**
 * Gets items based on text format.
 * This methods creates an item for each word in the text, it removes []
 * i.e La casa es de [colo] pero el [teco] es azul
 * @param {string} text
 * @returns {{index: number, text: string, selected: boolean}} items
 */
export function getWordItems(text) {
  return toItems(
    splitWithIndex(
      text
        .replace(/\[/gm, '')
        .replace(/\]/gm, '')
        .replace(/ /gm, ' @'),
      '@'
    )
  );
}

/**
 * Gets items based on text format
 * Each text before, after and in between [] are considered sentences
 * @param {string} text i.e Sentence 1 [Sentence 2] Sentence 3 with any text here [Sentence 4] Sentence 5
 *
 * @returns {{index: number, text: string, selected: boolean}} items
 */
export function getSentenceItems(text) {
  return toItems(
    splitWithIndex(
      text
        .replace(/\./gm, '.@')
        .replace(/\?/gm, '?@')
        .replace(/!/gm, '!@')
        .replace(/"]/gm, '"@')
        .replace(/: /gm, ': @')
        .replace(/\[/gm, '')
        .replace(/\]/gm, ''),
      '@'
    )
  );
}

/**
 * Transforms the text so it is compliant with hot text highlight question.
 * It removes the initial/wrapping <p> tag if available
 * @param {string} text
 * @returns {string}
 */
export function transformText(text) {
  const match = /^<p>(.*)<\/p>$/gm.exec(text);
  return match ? match[1].trim() : text;
}

/**
 * Generate phrase items from the first question answer text
 * It handle word and sentence variants, and it sets the 'items' component property accordingly
 */
export function getItems(question) {
  const answers = question.get('baseAnswers');

  var items = Ember.A();
  if (answers.length > 0) {
    const answer = answers.get(0),
      text = transformText(answer.answer_text);

    if (question.get('isHotTextHighlightWord')) {
      items = getWordItems(text);
    } else {
      items = getSentenceItems(text);
    }
  }
  return items;
}
