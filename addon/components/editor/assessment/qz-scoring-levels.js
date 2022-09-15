import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['editor', 'assessment', 'qz-scoring-levels'],
  //// -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Delete Level
     */
    deleteLevel: function(level) {
      this.get('scoringLevels').removeObject(level);
    }
  },
  //// -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Level[]} ScoringLevels
   */
  scoringLevels: null
});
