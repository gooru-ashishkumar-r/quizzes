import Ember from 'ember';

/**
 * Return a string if two values are the same
 *
 * @param {String[]} value
 * value[0] - string to return if two values are the same
 * value[1] - first value to compare
 * value[2] - second value to compare
 *
 * @return {String}
 */
export function textHighlight(value) {
  let description = value[0] ? value[0] : null;
  let answerText = value[1] ? JSON.parse(value[1].value) : null;
  let selectedText = answerText.selectedText;
  String.prototype.replaceBetween = function(start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
  };
  let div = document.createElement('div');
  div.innerHTML = description;
  let childnodes = div.childNodes;
  let isBreakLoop = false;
  let looperItem = childElement => {
    for (var i = 0; i < childElement.length; i++) {
      if (childElement[i].childNodes && !isBreakLoop) {
        looperItem(childElement[i].childNodes);
      }
      if (childElement[i].nodeName === '#text' && !isBreakLoop) {
        let nodeTxt = childElement[i].textContent.substring(
          0,
          selectedText.textEnd
        );
        if (nodeTxt === selectedText.text) {
          let hightlightText = childElement[i].textContent.replaceBetween(
            0,
            selectedText.textEnd,
            `<span style="background-color: green; color: white;">${nodeTxt}</span>`
          );
          $(childElement[i]).replaceWith(hightlightText);
          isBreakLoop = true;
          break;
        } else {
          $(childElement[i]).replaceWith(
            `<span style="background-color: green; color: white;">${childElement[i].textContent}</span>`
          );
        }
      }
    }
  };
  looperItem(childnodes);
  return div;
}

export default Ember.Helper.helper(textHighlight);
