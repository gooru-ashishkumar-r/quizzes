/**
 * Resource card
 *
 * Component responsible for show the  resource information in cards, so that most useful information is summarized there.
 * @module
 *
 */

import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['cards', 'gru-resource-result-card'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {ResourceResult | QuestionResult} item information to be used in the card
   */
  item: null
});
