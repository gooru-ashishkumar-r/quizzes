import Ember from 'ember';

/**
 * Browse selector
 *
 * Component responsible for displaying a tree of browse items as a hierarchical
 * list of panels where each panel displays a level of data from a branch in the
 * tree. Items in the last levels of the tree can be selected/deselected.
 *
 * If there are more levels in the tree than there are levels of panels, then the
 * exceeding tree levels will be displayed as accordions in the last browse panel.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['taxonomy', 'gru-browse-selector'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Select an item that is not in the last panel
     *
     * @function actions:selectInsideItem
     */
    selectInsideItem: function(item) {
      this.get('onSelectItem')(item);
    },

    /**
     * Select an item in the last panel
     *
     * @function actions:selectCheckableItem
     */
    selectCheckableItem: function(item) {
      var isSelected = !item.get('isSelected');

      item.set('isSelected', isSelected);
      if (isSelected) {
        this.get('onCheckItem')(item);
      } else {
        this.get('onUncheckItem')(item);
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events
  didRender() {
    this._super(...arguments);
    this.$('button[data-toggle="collapse"]').on('click', function(e) {
      e.preventDefault();
    });
  },

  willRender() {
    this._super(...arguments);
    var $component = this.$();

    if ($component) {
      this.$('button[data-toggle="collapse"]').off('click');
    }
  },

  willDestroyElement: function() {
    this.$('button[data-toggle="collapse"]').off('click');
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * List of root nodes for the tree data structure for the browse panels
   * @prop {BrowseItem[][]...}
   */
  data: [],

  /**
   * List of headers, one for each browse panel
   * @prop {String[]}
   */
  headers: [],

  /**
   * List of objects, where each object serves as the model for a browse panel.
   * Each object is made up of two properties:
   * - title : panel header name (String) -@see headers
   * - data  : pointer to a list of browse items (BrowseItem[]).
   *
   * @prop {Object[]}
   */
  headerItems: Ember.computed('selectedPath', function() {
    var headers = this.get('headers');
    var previousPath = this.get('previousSelectedPath');
    var currentPath = this.get('selectedPath');
    var currentList, browseItem;

    // Clear and then update cached path
    this.clearActivePath(previousPath);
    this.set('previousSelectedPath', currentPath);

    return headers.map(
      function(headerTitle, index) {
        var itemId = currentPath[index];

        currentList =
          index === 0
            ? this.get('data')
            : browseItem ? browseItem.get('children') : [];
        browseItem = currentList.length
          ? currentList.findBy('id', itemId)
          : null;

        if (browseItem) {
          browseItem.set('isActive', true);
        }

        return Ember.Object.create({
          title: headerTitle,
          data: currentList ? currentList : []
        });
      }.bind(this)
    );
  }),

  /**
   * List of ids of selected panel items where each array index corresponds to a panel level.
   * @prop {String[]}
   */
  selectedPath: [],

  /**
   * Previous value of @see selectedPath.
   * @prop {String[]}
   */
  previousSelectedPath: [],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @function clearActivePath
   * Set the property 'isActive' to false to every browse item found in 'path'.
   * @param {String[]} path - List of browse item ids
   */
  clearActivePath: function(path) {
    var browseItem = [];

    path.forEach(
      function(browseItemId, index) {
        if (index === 0) {
          browseItem = this.get('data').findBy('id', browseItemId);
        } else {
          browseItem = browseItem.get('children').findBy('id', browseItemId);
        }
        browseItem.set('isActive', false);
      }.bind(this)
    );
  }
});
