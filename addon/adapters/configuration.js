import Ember from 'ember';

/**
 * Adapter to support the Lookup API 3.0 integration
 *
 * @typedef {Object} LookupAdapter
 */
export default Ember.Object.extend({
  namespace: 'config',
  /**
   * Gets custom configuration
   * @returns {Promise.<[]>}
   */
  loadConfiguration: function(key) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${key}.json`;
    const options = {
      type: 'GET',
      cache: false
    };
    return Ember.RSVP
      .hashSettled({
        configuration: Ember.$.ajax(url, options)
      })
      .then(function(hash) {
        return hash.configuration.value;
      });
  }
});
