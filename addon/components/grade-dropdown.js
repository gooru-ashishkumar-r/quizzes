import Ember from 'ember';
import DropdownItem from 'quizzes-addon/utils/dropdown-item';
import AppDropdown from 'quizzes-addon/components/app-dropdown';

/**
 * @typedef {object} GradeDropdown
 */
export default AppDropdown.extend({
  /**
   * @property {[]} grades
   */
  grades: Ember.A(),

  /**
   * @property {DropdownItem[]} dropdown items tree for rendering
   */
  tree: Ember.A(),

  /**
   * It only supports multiple
   * @see AppDropdown.multiple
   *
   * @property {bool}
   */
  multiple: true,

  /**
   * @see AppDropdown.didInsertElement
   */
  didInsertElement: function() {
    this._super(); //calling app-dropdown didInsertElement
    this.initDropdownItems();
  },

  /**
   * @see AppDropdown.willDestroyElement
   */
  willDestroyElement: function() {
    this._super(); //calling app-dropdown didInsertElement
    this.get('tree').clear();
    this.get('items').clear();
  },

  /**
   * Initialize the dropdown items
   */
  initDropdownItems: function() {
    const component = this,
      grades = component.get('grades'),
      items = component.get('items'),
      tree = component.get('tree');

    this.get('tree').clear();
    this.get('items').clear();

    grades.forEach(function(grade) {
      const levels = grade.get('levels'),
        hasLevels = levels && levels.length,
        item = {
          id: grade.get('id'),
          label: grade.get('name'),
          data: {
            grade: grade, //grade
            levels: Ember.A() //more dropdown items for levels
          }
        };

      const dropdownItem = DropdownItem.create(item);
      items.addObject(dropdownItem);
      tree.addObject(dropdownItem);

      if (hasLevels) {
        Ember.$.each(levels, function(index, level) {
          const levelItem = {
            id: level,
            label: level,
            data: {
              grade: grade
            }
          };

          var levelDropdownItem = DropdownItem.create(levelItem);
          dropdownItem.get('data').levels.addObject(levelDropdownItem);

          //adding to items to control selections
          items.addObject(levelDropdownItem);
        });
      }
    });
  },

  actions: {
    /**
     * When an items is selected
     * @param {DropdownItem} item
     */
    onItemSelected: function(item) {
      const component = this,
        selected = item.get('selected'),
        levelDropdownItems = item.get('data').levels,
        hasLevels = levelDropdownItems && levelDropdownItems.get('length');

      item.set('selected', !selected);
      if (hasLevels) {
        //when has levels
        levelDropdownItems.map(function(levelDropdownItem) {
          levelDropdownItem.set('selected', !selected);
        });
      }

      if (component.get('onChangeAction')) {
        component.sendAction('onChangeAction', component.get('selectedItems'));
      }
    }
  }
});
