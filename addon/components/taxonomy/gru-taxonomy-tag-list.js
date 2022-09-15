import Ember from 'ember';

/**
 * Taxonomy tag list
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['taxonomy', 'gru-taxonomy-tag-list'],

  classNameBindings: ['isInCard:in-card'],

  // --------------------------------------------
  // Actions
  actions: {
    removeTag: function(tag) {
      if (this.get('onRemove')) {
        this.get('onRemove')(tag);
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events
  setup: Ember.on('didInsertElement', function() {
    if (this.get('nonVisibleTags')) {
      this.setupTooltip();
    }
  }),

  cleanUp: Ember.on('willDestroyElement', function() {
    const $anchor = this.$('button.non-visible-tags');
    $anchor.off('click');

    // In case a popover was open, it will need to be destroyed
    $anchor.popover('destroy');
  }),

  // --------------------------------------------
  // Properties

  /**
   * @property {boolean} Should the taxonomy tags in the list display a tooltip with more details
   */
  hasTooltips: true,

  /**
   * @property {boolean} Is the taxonomy tag list contained within a content card
   */
  isInCard: false,

  /**
   * @property {boolean} Is the taxonomy tag list called from search
   */
  isInSearch: false,

  /**
   * @property {TaxonomyTag[]} taxonomy tag
   */
  tags: null,

  /**
   * Indicates the total of tags visible
   * @property {number}
   */
  tagsVisible: null,

  /**
   * @property {TaxonomyTag[]} taxonomy tag
   */
  visibleTags: Ember.computed('tags.[]', function() {
    const tagsVisible = this.get('tagsVisible') || 999999; //long number so it show all when no provided
    return this.get('tags').filter(function(tag, index) {
      return index < tagsVisible;
    });
  }),

  /**
   * @property {number}
   */
  totalTags: Ember.computed.alias('tags.length'),

  /**
   * Indicates how many tags are not visible
   * @property {number}
   */
  nonVisibleTags: Ember.computed('totalTags', function() {
    const totalTags = this.get('totalTags');
    const tagsVisible = this.get('tagsVisible') || totalTags;
    const nonVisibleTags = totalTags - tagsVisible;
    return nonVisibleTags > 0 ? nonVisibleTags : 0;
  }),

  /**
   * @property {string}
   */
  onRemove: null,

  // -------------------------------------------------------------------------
  // Methods

  setupTooltip: function() {
    var $anchor = this.$('button.non-visible-tags');

    if ($anchor.length) {
      const component = this;
      const placement =
        this.get('isInCard') || this.get('isInSearch')
          ? 'bottom'
          : 'auto right';

      $anchor.addClass('clickable');
      $anchor.attr('data-html', 'true');
      $anchor.popover({
        placement: placement,
        content: function() {
          return component.$('.all-tags').html();
        },
        trigger: 'manual'
      });

      $anchor.click(function() {
        var $this = $(this);
        if (!$this.hasClass('list-open')) {
          // Close all tag-list popovers by simulating a click on them
          $('.non-visible-tags.list-open').click();
          $this.addClass('list-open').popover('show');
        } else {
          $this.removeClass('list-open').popover('hide');
        }
      });
    }
  }
});
