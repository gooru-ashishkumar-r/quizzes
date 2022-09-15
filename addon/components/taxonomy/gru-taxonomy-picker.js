import Ember from 'ember';
import BrowseItem from 'quizzes-addon/models/taxonomy/browse-item';
import TaxonomyTag from 'quizzes-addon/models/taxonomy/taxonomy-tag';
import TaxonomyTagData from 'quizzes-addon/models/taxonomy/taxonomy-tag-data';

/**
 * Taxonomy Picker
 *
 * Component responsible for keeping track of the selection of taxonomy items (@see gru-browse-selector)
 * and helping in the selection process of these items by providing shortcuts.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['taxonomy', 'gru-taxonomy-picker'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Add a new tag to the selected tag list
     * @function actions:addSelectedTag
     * @param {BrowseItem} browseItem
     */
    addSelectedTag: function(browseItem) {
      var tagData = TaxonomyTagData.createFromTaxonomyItem(
        browseItem,
        this.get('subject')
      );

      var newSelectedTag = TaxonomyTag.create({
        isActive: true,
        isReadonly: true,
        isRemovable: true,
        data: tagData
      });
      this.get('selectedTags').pushObject(newSelectedTag);
    },

    /**
     * Set a taxonomy tag as active and change the path the browse selector is open to.
     * @function actions:openShortcut
     * @param {TaxonomyTag} taxonomyTag
     */
    openShortcut: function(taxonomyTag) {
      if (!taxonomyTag.get('isActive')) {
        const itemId = taxonomyTag.get('data.id');
        const browseItems = this.get('browseItems');

        this.resetShortcuts();
        taxonomyTag.set('isActive', true);
        this.findBrowseItem(itemId, browseItems).then(
          function(browseItem) {
            this.updateSelectedPath(browseItem);
          }.bind(this)
        );
      }
    },

    /**
     * Remove a tag from the selected tag list
     * @function actions:removeSelectedTag
     */
    removeSelectedTag: function(browseItem) {
      var selectedTags = this.get('selectedTags');
      var idToRemove = browseItem.get('id');

      for (let i = selectedTags.length - 1; i >= 0; --i) {
        if (selectedTags[i].get('data.id') === idToRemove) {
          selectedTags.removeAt(i);
          break;
        }
      }
    },

    saveSelectedTags: function(selectedTags) {
      this.get('onSave')(selectedTags);
    },

    /**
     * Remove a tag from the selected tag list and un-check it in
     * the browse selector.
     * @function actions:uncheckItem
     * @param {TaxonomyTag} taxonomyTag
     */
    uncheckItem: function(taxonomyTag) {
      var id = taxonomyTag.get('data.id');
      var browseItems = this.get('browseItems');
      var browseItem;

      for (let i = browseItems.length - 1; i >= 0; --i) {
        browseItem = browseItems[i].findItem(id);
        if (browseItem) {
          break;
        }
      }

      this.get('selectedTags').removeObject(taxonomyTag);
      browseItem.set('isSelected', false);
    },

    /**
     * Clear any active shortcut tags, then change the path the browse selector is open to.
     * @function actions:updatePath
     * @param {BrowseItem} item
     * @return {Promise}
     */
    updatePath: function(item) {
      this.resetShortcuts();
      return this.updateSelectedPath(item);
    }
  },

  // -------------------------------------------------------------------------
  // Events
  init() {
    this._super(...arguments);

    Ember.Logger.assert(
      this.get('subject.courses'),
      'Courses not found for subject'
    );

    var selected = this.get('selected');
    var shortcuts = this.get('shortcuts');
    var taxonomyItems = this.get('taxonomyItems');
    var maxLevels = this.get('maxLevels');
    var browseItems = this.getBrowseItems(taxonomyItems, maxLevels);
    this.set('browseItems', browseItems);

    var selectedTags = this.getTaxonomyTags(selected, {
      isActive: true,
      isReadonly: true,
      isRemovable: true
    });

    var shortcutTags = this.getTaxonomyTags(shortcuts);

    this.set('selectedTags', selectedTags);
    this.set('shortcutTags', shortcutTags);

    if (selected && selected.length) {
      const component = this;
      const selectedIds = selected.map(function(tagData) {
        return tagData.get('id');
      });

      this.findBrowseItems(selectedIds, browseItems).then(function(
        browseItems
      ) {
        Ember.run.scheduleOnce('afterRender', component, function() {
          Ember.beginPropertyChanges();
          browseItems.forEach(function(browseItem, index) {
            Ember.Logger.assert(
              browseItem,
              'Unable to find browse item to mark as selected'
            );

            if (index === 0) {
              // Set an initial default path to refresh the browse selector.
              // The initial default path will be that of the first selected tag.
              let path = browseItem.getPath();
              path = path.length > 2 ? path.splice(0, 2) : path.splice(0, 1);
              component.set('selectedPath', path);
            }

            // Mark the browse item as selected
            browseItem.set('isSelected', true);
          });
          Ember.endPropertyChanges();
        });
      });
    }
  },

  willDestroyElement: function() {
    this.get('browseItems').forEach(function(browseItem) {
      browseItem.destroyItem();
    });
    this.set('browseItems', null);
    this.set('shortcutTags', null);
    this.set('selectedTags', null);
    this.set('selectedPath', null);
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {BrowseItem[]} browseItems - List of browse items used by the browse selector.
   * These browse items are created from @see taxonomyItems when the component is initialized.
   */
  browseItems: [],

  /**
   * @property {String} browseSelectorText - Intro text for browse selector.
   */
  browseSelectorText: '',

  /**
   * @property {Number} maxLevels - Max level of descendants (starting from the root at level 1)
   * that will be copied from the taxonomy items onto the browse items
   * @see gru-browse-item#createFromTaxonomyItem
   */
  maxLevels: 0,

  /**
   * @property {String[]} panelHeaders - List of headers, one for each panel in the browse selector.
   * @see gru-browse-selector
   */
  panelHeaders: [],

  /**
   * @property {TaxonomyTagData[]} selected - List of references to a set of taxonomy tag data.
   */
  selected: [],

  /**
   * @property {String[]} selectedPath - Path to open the browse selector to. If shortcut items
   * (@see shortcuts) are provided then selectedPath will be set to the path of the first
   * shortcut item by default.
   * @see gru-browse-selector
   */
  selectedPath: [],

  /**
   * @property {String} selectedTextKey - i18n text key for selected tags text.
   */
  selectedTextKey: '',

  /**
   * @property {TaxonomyTagData[]} shortcuts - List of references to a set of taxonomy tag data.
   */
  shortcuts: [],

  /**
   * @property {String} shortcutText - Intro text for shortcuts.
   */
  shortcutText: '',

  /**
   * @property {TaxonomyRoot} subject - Currently selected subject.
   */
  subject: {},

  /**
   * @property {TaxonomyItem[]} taxonomyItems - List of taxonomy items. They are the initial
   * references to all the taxonomy data.
   */
  taxonomyItems: Ember.computed.alias('subject.courses'),

  /**
   * @property {Boolean} fromSearch - show if the modal call was from search or not.
   */
  fromSearch: false,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Find the browse item with a specific ID from a list of browse items.
   * If the browse item is not found in the list, then the search continues
   * with the children of the browse item(s) that has/have a similar ID
   * and so on.
   *
   * @param {String} itemId
   * @param {BrowseItems} browseItems
   * @return {Ember.RSVP.Promise}
   */
  findBrowseItem: function(itemId, browseItems) {
    return new Ember.RSVP.Promise(
      function(resolve) {
        if (!browseItems.length) {
          resolve(null);
        }

        const filteredList = browseItems.filter(function(browseItem) {
          return browseItem.isSimilar(itemId);
        });

        const item = filteredList.find(function(browseItem) {
          return browseItem.get('id') === itemId;
        });

        if (!item && filteredList.length) {
          const promises = filteredList.map(
            function(browseItem) {
              // Make sure to load the children before continuing
              return this.get('onSearchPath')(browseItem.getPath()).then(
                function(childrenTaxonomyItems) {
                  var children = this.getBrowseItems(childrenTaxonomyItems);
                  browseItem.addChildren(children);
                  if (browseItem.get('level') < 2) {
                    // Only look within the first two levels (loaded async).
                    // The rest of the levels will be need to be searched for synchronously.
                    return this.findBrowseItem(
                      itemId,
                      browseItem.get('children')
                    );
                  } else {
                    return null;
                  }
                }.bind(this)
              );
            }.bind(this)
          );

          Ember.RSVP.all(promises).then(function(values) {
            // One of the resolved values should have a match
            var result = values.find(function(value) {
              return !!value;
            });
            resolve(result);
          });
        } else {
          resolve(item);
        }
      }.bind(this)
    );
  },

  /**
   * Find all the browse items in a list of browse item IDs.
   *
   * @param {String[]} idList - List of browse item IDs to search for
   * @param {BrowseItem[]} browseItems
   * @return {Promise.<BrowseItem[]>}
   */
  findBrowseItems: function(idList, browseItems) {
    var component = this;

    var promises = idList.map(function(id) {
      return new Ember.RSVP.Promise(function(localResolve) {
        component.findBrowseItem(id, browseItems).then(function(browseItem) {
          if (!browseItem) {
            // If it was not found after loading all the necessary data,
            // then it must the ID of a sub-standard or a micro-standard
            for (let i = browseItems.length - 1; i >= 0; --i) {
              browseItem = browseItems[i].findItem(id);
              if (browseItem) {
                break;
              }
            }
            localResolve(browseItem);
          } else {
            localResolve(browseItem);
          }
        });
      });
    });
    return Ember.RSVP.all(promises);
  },

  /**
   * Get an array of browse items from a list of taxonomy items
   *
   * @param TaxonomyItems[]
   * @param maxLevels
   * @returns {BrowseItems[]}
   */
  getBrowseItems: function(taxonomyItems, maxLevels) {
    return taxonomyItems.map(function(taxonomyItem) {
      return BrowseItem.createFromTaxonomyItem(taxonomyItem, maxLevels);
    });
  },

  /**
   * Get a list of taxonomy tags from a list of taxonomy tag data and a configuration object
   *
   * @param {TaxonomyTagData[]} tagDataList
   * @param {Object} config
   * @returns {TaxonomyTag[]}
   */
  getTaxonomyTags: function(tagDataList, config = {}) {
    var tags = [];

    if (tagDataList && tagDataList.length) {
      tags = tagDataList.map(function(data) {
        const props = {};
        $.extend(props, config, { data: data });

        return TaxonomyTag.create(props);
      });
    }
    return Ember.A(tags);
  },

  /**
   * Make all shorcut tags show as unselected
   */
  resetShortcuts: function() {
    this.get('shortcutTags').forEach(function(taxonomyTag) {
      taxonomyTag.set('isActive', false);
    });
  },

  /**
   * Run external action to ensure data has been loaded then update the selected path
   *
   * @function updateSelectedPath
   * @param {BrowseItem} item
   * @return { Promise.<undefined> }
   */
  updateSelectedPath: function(item) {
    var path = item.getPath();

    return this.get('onSearchPath')(path).then(
      function(taxonomyItems) {
        var children = this.getBrowseItems(taxonomyItems);
        item.addChildren(children);
        this.set('selectedPath', path);
      }.bind(this)
    );
  }
});
