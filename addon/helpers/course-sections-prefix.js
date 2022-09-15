import Ember from 'ember';
import { courseSectionsPrefix } from 'quizzes-addon/utils/utils';

/**Show the Unit, Lesson, Assessment and Collection label correctly,
 *  this is showing the letter and number prior the name.
 *
 * @example
 *
 * <span>{{course-sections-prefix title="My Unit" type="unit" index=1 complete=false}}</span>
 * @see /app/templates/components
 *
 * @param title {String}
 * @param index {Number}
 * @param trype {String} "unit","lesson","collection" and "assessment"
 * @returns {String}
 */
export default Ember.Helper.extend({
  i18n: Ember.inject.service('i18n'),

  compute(params, { index, type, longName }) {
    const i18n = this.get('i18n');
    return courseSectionsPrefix(index, type, i18n, longName);
  }
});
