import Ember from 'ember';

/**
 * @typedef {Object} Assert
 */
var Assert = Ember.Object.extend(
  {
    //it only includes static methods
  }
);

Assert.reopenClass({
  /**
   * Asserts that the element exists
   *
   * @example Assert.exists($.find('li'), 'Element not found');
   *
   * @param {assert} assert QUnit assert
   * @param {jQuery} element jQuery element
   * @param {string} message The assert message
   */
  exists: function(assert, element, message) {
    assert.ok(!!element.length, message);
  },
  /**
   * Asserts that the element exists
   *
   * @example Assert.exists($.find('li'), 'Element not found');
   *
   * @param {assert} assert QUnit assert
   * @param {jQuery} element The jQuery element
   * @param {string} message The assert message
   */
  notExists: function(assert, element, message) {
    assert.ok(!element.length, message);
  },

  /**
   * Returns the trimmed text for the element
   * @param {jQuery} element The jQuery element
   * @returns {string} trimmed text
   */
  text: function(element) {
    return element.text().trim();
  },

  /**
   * Returns a mock for the i18n service
   * @returns {{t: Function}}
   */
  i18nServiceMock: {
    t: function(key) {
      return key;
    }
  }
});

export default Assert;
