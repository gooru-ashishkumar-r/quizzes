/* eslint require-jsdoc: 0 */
import Ember from 'ember';

export default function destroyApp(application) {
  Ember.run(application, 'destroy');
}
