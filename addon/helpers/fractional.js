import Ember from 'ember';
/**
 * Show fractions values like "3/4" more friendly.
 *
 * @example
 *
 * <span class="fractional fraction">{{{fractional numerator=1 denominator=2}}}</span>
 * or
 * <span class="fractional fraction">{{{fractional expression="1/3"}}}</span>
 * @see /app/templates/components
 *
 * @param numerator {Number}
 * @param denominator {Number}
 * @param expression {String} example: "1/3" Have priority to get the numerator and denominator.
 * @returns {String} - fractional value is presented friendly
 */
export function fractional(params, { numerator, denominator, expression }) {
  var num = numerator;
  var den = denominator;

  if (expression !== undefined) {
    var split = expression.split('/');
    if (split.length === 2) {
      num = split[0];
      den = split[1];
    }
  }
  return Ember.String.htmlSafe(
    `<span class="top">${num}</span><span class="bottom">${den}</span>`
  );
}

export default Ember.Helper.helper(fractional);
