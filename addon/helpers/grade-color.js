import Ember from 'ember';
import { getGradeColor } from 'quizzes-addon/utils/utils';

/**
 * Get the color for the grade bracket that a score falls under per the app's grading scale (@see /app/config/config.js#GRADING_SCALE)
 *
 * @example
 *
 * Based on a score value, the DIV element may be styled differently
 * <div class="grade" style="background-color: {{gradeColor score}}">
 *  ...
 * </div>
 * @see /app/templates/components/reports/assessment/qz-summary.hbs#L1
 *
 * @param value - score within the grading scale
 * @returns {String} - hex color string
 */
export function gradeColor(value) {
  if (value[1]) {
    const color = value[0] || 'NA';
    return Ember.String.htmlSafe(`${value[1]}: ${getGradeColor(color)}`);
  } else {
    return Ember.String.htmlSafe(getGradeColor(value[0]));
  }
}

export default Ember.Helper.helper(gradeColor);
