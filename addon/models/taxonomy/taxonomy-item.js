import Ember from 'ember';

/**
 * Taxonomy Item
 *
 * @typedef {Object} TaxonomyItem
 */
export default Ember.Object.extend({
  /**
   * @property {TaxonomyItem[]} children - List of item's children
   */
  children: [],

  /**
   * @property {string} code - Display code for the item
   */
  code: '',

  /**
   * @property {string} id - Item ID
   */
  id: null,

  /**
   * @property {string} title - Text label for this item
   */
  title: '',

  /**
   * @property {string} description - Text description for this item
   */
  description: '',

  /**
   * @property {Number} level - Depth of the item in the tree. Level values start at 1.
   */
  level: 1,

  /**
   * @property {TaxonomyItem} parent - Parent item or null if this is node is at the root of the tree.
   */
  parent: null,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @function Calculate an array with the path to this item
   * @example
   * ["grandparent-id", "parent-id", "item-id"]
   * @return {String[]}
   */
  getPath: function() {
    var path = new Array(this.get('level'));
    this.constructPath(path);
    return path;
  },

  constructPath: function(resultArray) {
    var level = this.get('level');
    var parent = this.get('parent');

    resultArray[level - 1] = this.get('id');
    if (parent) {
      parent.constructPath(resultArray);
    }
  },

  /**
   * @function Find a taxonomy item by traversing down
   * a taxonomy item tree.
   * @param {String[]} path - A hierarchical list of ids
   * @example
   * ['grandparent-id', 'parent-id', 'node-id']
   * @return {TaxonomyItem | Null}
   */
  find: function(path) {
    var result = null;

    if (path && path.length) {
      const pathId = path[0];

      if (this.get('id') === pathId) {
        if (path.length === 1) {
          // This is it! There are no more elements in the path.
          result = this;
        } else {
          const children = this.get('children');
          for (let i = children.length - 1; i >= 0; --i) {
            result = children[i].find(path.slice(1));
            if (result) {
              break;
            }
          }
        }
      }
    }

    return result;
  },

  /**
   * @function Find a taxonomy item by traversing down
   * a taxonomy item tree.
   * @param {String} itemId
   * @return {TaxonomyItem | Null}
   */
  findItem: function(itemId) {
    var result = null;

    if (this.get('id') === itemId) {
      result = this;
    } else {
      const children = this.get('children');
      if (children.length) {
        for (let i = children.length - 1; i >= 0; --i) {
          const item = children[i].isSimilar(itemId);
          if (item) {
            result = item.findItem(itemId);
            if (result) {
              break;
            }
          }
        }
      }
    }

    return result;
  },

  /**
   * @function Is the item's ID contained within another item ID?
   * @param {String} itemId - Item ID to test for
   */
  isSimilar: function(itemId) {
    var result = null;
    var myId = this.get('id');

    // Be mindful of fake parents (@see services/taxonomy#attachChildren or
    // @see services/taxonomy#attachStandardsWithoutCategory). Allow these
    // to be considered as similar so it's possible to continue searching
    // within these.
    if (itemId.indexOf(myId) > -1 || myId.indexOf('empty-') > -1) {
      result = this;
    }
    return result;
  },

  /**
   * @function Destroy an item and all its descendents.
   * Clear all references between them.
   * @return {undefined}
   */
  destroyItem: function() {
    var children = this.get('children');
    if (children && children.length) {
      children.forEach(function(child) {
        child.destroyItem();
      });
    }
    this.set('children', null);
    this.set('parent', null);
    this.destroy();
  }
});
