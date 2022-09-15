/*jshint multistr: true */
import Ember from 'ember';

/**
 * CSS loading spinner by Tobias Ahlin
 * http://tobiasahlin.com/spinkit/
 */
export function threeBounceSpinner() {
  const html =
    '<div class="three-bounce-spinner"> \
                  <div class="bounce1"></div> \
                  <div class="bounce2"></div> \
                  <div class="bounce3"></div> \
                </div>';
  return Ember.String.htmlSafe(html);
}

export default Ember.Helper.helper(threeBounceSpinner);
