import Ember from 'ember';
import { numberSort } from 'quizzes-addon/utils/utils';

/**
 * Two-tier header table
 *
 * Component responsible for displaying and filtering a set of data
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-two-tier-header-table'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * @function actions:selectFirstTierColHeader
     * @param {string} headerId
     */
    selectFirstTierColHeader: function(headerId) {
      this.get('onSelectFirstTierHeader')(headerId);
    },

    /**
     * @function actions:selectRowHeader
     * @param {string} headerId
     */
    selectRowHeader: function(headerId) {
      this.get('onSelectRowHeader')(headerId);
    },

    /**
     * @function actions:updateSortCriteria
     * @param {number} firstTierIndex
     * @param {number} secondTierIndex
     */
    updateSortCriteria: function(firstTierIndex, secondTierIndex) {
      const sortCriteria = this.get('sortCriteria');
      const newSortCriteria = {
        firstTierIndex: firstTierIndex,
        secondTierIndex: secondTierIndex
      };

      if (
        sortCriteria.firstTierIndex === firstTierIndex &&
        sortCriteria.secondTierIndex === secondTierIndex
      ) {
        // Reverse the sort order if the same column has been selected
        newSortCriteria.order = sortCriteria.order * -1;
        this.set('sortCriteria', newSortCriteria);
      } else {
        newSortCriteria.order = this.get('defaultSortOrder');
        this.set('sortCriteria', newSortCriteria);
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events

  didInsertElement() {
    this._super(...arguments);

    Ember.run.scheduleOnce('afterRender', this, function() {
      this.set('sortCriteria', this.initSortCriteria());
    });
  },

  didRender() {
    this._super(...arguments);
    this.updateColumnVisibility();
  },

  // -------------------------------------------------------------------------
  // Properties

  /*
   * @prop { Number } currentVisibleHeadersLen - Stores the current number of second tier headers that are visible
   */
  currentVisibleHeadersLen: 0,

  /**
   * @prop { Object[] } data - Array of objects with the information for all of the table rows
   * Objects are of the form:
   * {
   *    id: <row_id>,
   *    header: <row_label>,
   *    content: String[]
   * }
   * ... where 'content' will consist of values for each one of the
   * second tier headers
   */
  data: null,

  /*
   * @prop { Number } defaultSortOrder - Default sort order for values in columns (1 = ascending; -1 = descending)
   */
  defaultSortOrder: 1,

  /**
   * @prop { Object[] } firstTierHeaders - Array of objects to use as the first tier
   * headers for the table component
   *
   * Each object will consist of:
   * - label: visual representation of the header
   * - value: internal header identifier
   * They will be ordered from left to right in the table header as they appear in the array.
   */
  firstTierHeaders: null,

  /**
   * @prop { Function } onSelectFirstTierHeader - Event handler triggered when clicking on a first tier header
   */
  onSelectFirstTierHeader: null,

  /**
   * @prop { Function } onSelectRowHeader - Event handler triggered when clicking on a row header
   */
  onSelectRowHeader: null,

  /**
   * @prop { Object[] } secondTierHeaders - Second tier headers for the table component.
   * The same second tier headers will appear under each one of the first tier headers
   *
   * Each object will consist of:
   * - label: visual representation of the header
   * - value: internal header identifier
   * - visible: controls the visibility of the header
   */
  secondTierHeaders: null,

  /**
   * @prop { Number } secondTierHeadersVisible - Total number of second tier headers
   * that are visible
   */
  secondTierHeadersVisible: Ember.computed(
    'secondTierHeaders.@each.visible',
    function() {
      return this.get('secondTierHeaders')
        .filterBy('visible', true)
        .get('length');
    }
  ),

  /**
   * @prop { Object } sortCriteria - Object with information on how the data should be sorted
   * - firstTierIndex: {number} - Index of the first tier header
   * - secondTierIndex: {number} - Index of the second tier header
   * - order: {number} - Ascending or descending order
   */
  sortCriteria: null,

  /**
   * @prop { Object[] } sortedData - Ordered representation of 'data'
   */
  sortedData: Ember.computed('data.length', 'sortCriteria', function() {
    const sortCriteria = this.get('sortCriteria');
    const data = this.get('data');
    let sortedData = data;

    if (sortCriteria) {
      const secondTierHeaders = this.get('secondTierHeaders');
      const firstTierIndex = sortCriteria.firstTierIndex;
      const secondTierIndex = sortCriteria.secondTierIndex;
      const sortColumn =
        sortCriteria.firstTierIndex * secondTierHeaders.length +
        secondTierIndex;
      let sortFunction;
      sortedData = Ember.copy(data, true);

      if (firstTierIndex === -1 || secondTierIndex === -1) {
        // Sort alphabetically by row headers
        const rowHeadersHeader = this.get('rowHeadersHeader');
        sortFunction = rowHeadersHeader.sortFunction || numberSort;
        sortedData.sort(
          (a, b) => sortFunction(a.header, b.header) * sortCriteria.order
        );
      } else if (firstTierIndex >= 0) {
        sortFunction =
          secondTierHeaders[secondTierIndex].sortFunction || numberSort;
        sortedData.sort(
          (a, b) =>
            sortFunction(
              a.content[sortColumn].value,
              b.content[sortColumn].value
            ) * sortCriteria.order
        );
      }
    }
    return sortedData;
  }),

  /**
   * @prop { Object? } rowHeadersHeader - Header for the row headers
   */
  rowHeadersHeader: null,

  // -------------------------------------------------------------------------
  // Observers

  /**
   * Update the visibility of the table columns based on the secondTierHeaders model
   *
   * @function
   * @returns {undefined}
   */
  updateColumnVisibility: Ember.observer(
    'secondTierHeaders.@each.visible',
    function() {
      const secondTierHeaders = this.get('secondTierHeaders');
      const secondTierHeadersLen = secondTierHeaders.length;
      const secondTierHeadersVisible = secondTierHeaders.filterBy(
        'visible',
        true
      ).length;
      const removeColumns =
        secondTierHeadersVisible < this.get('currentVisibleHeadersLen');
      const selectors = [];
      let cssSelector;

      secondTierHeaders.forEach(function(header, index) {
        if (
          (removeColumns && !header.visible) ||
          (!removeColumns && header.visible)
        ) {
          const offset = index - 1;
          const offsetStr = offset < 0 ? offset : `+${offset}`;

          selectors.push(`table tr.second-tier th.${header.value}`);
          selectors.push(
            `table tr.data td:nth-child(${secondTierHeadersLen}n${offsetStr})`
          );
        }
      });
      cssSelector = selectors.join(',');

      if (removeColumns) {
        // There are less second tier headers visible now so the class 'hidden'
        // will be added to the second tier headers that are no longer visible.
        // Otherwise, if there are more second tier headers visible now, the
        // class 'hidden' will be removed from them.
        this.$(cssSelector).addClass('hidden');
      } else {
        this.$(cssSelector).removeClass('hidden');
      }

      this.set('currentVisibleHeadersLen', secondTierHeadersVisible);
    }
  ),

  updateSortClasses: Ember.observer('sortCriteria', function() {
    const sortCriteria = this.get('sortCriteria');
    const totalSecondTierHeaders = this.get('secondTierHeaders').length;
    const rowHeadersHeader = !!this.get('rowHeadersHeader');
    const headers = this.$('.second-tier th');

    const currentHeaderIndex =
      rowHeadersHeader +
      (sortCriteria.firstTierIndex * totalSecondTierHeaders +
        sortCriteria.secondTierIndex);

    headers.removeClass('ascending').removeClass('descending');

    if (currentHeaderIndex >= 0 && sortCriteria.order > 0) {
      headers.eq(currentHeaderIndex).addClass('ascending');
    } else {
      headers.eq(currentHeaderIndex).addClass('descending');
    }
  }),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Initialize the table's sort criteria
   * @return {Object}
   */
  initSortCriteria: function() {
    // No columns will be sorted by default
    return {
      firstTierIndex: -1,
      secondTierIndex: 0,
      order: this.get('defaultSortOrder')
    };
  }
});
