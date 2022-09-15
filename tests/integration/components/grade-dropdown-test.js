import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';

moduleForComponent(
  'grade-dropdown',
  'Integration | Component | grade dropdown',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('Layout using defaults', function(assert) {
  assert.expect(17);

  const grades = Ember.A();
  grades.addObject(Ember.Object.create({ id: 1, name: 'Pre-K', levels: [] }));
  grades.addObject(
    Ember.Object.create({
      id: 1,
      name: 'Elementary',
      levels: ['K', '1', '2', '3', '4', '5']
    })
  );
  grades.addObject(
    Ember.Object.create({
      id: 1,
      name: 'Middle School',
      levels: ['6', '7', '8']
    })
  );
  grades.addObject(
    Ember.Object.create({
      id: 1,
      name: 'High School',
      levels: ['9', '10', '11', '12']
    })
  );
  grades.addObject(
    Ember.Object.create({ id: 1, name: 'Higher Ed', levels: [] })
  );

  this.set('grades', grades);

  this.render(hbs`{{grade-dropdown grades=grades}}`);

  const $component = this.$(),
    $dropdown = $component.find('.grade-dropdown');

  T.exists(assert, $dropdown, 'Missing grade-dropdown');

  //button group
  const $buttonGroup = $dropdown.find('.btn-group');
  T.exists(assert, $buttonGroup, 'Missing btn-group');
  assert.ok(
    $buttonGroup.hasClass('btn-group-lg'),
    'Missing default btn group size class'
  );
  assert.ok(
    $buttonGroup.hasClass('keep-open-yes'),
    'Missing keep-open-yes class'
  );
  T.exists(
    assert,
    $buttonGroup.find('.selected-text'),
    'Missing select text button'
  );
  assert.equal(
    T.text($buttonGroup.find('.selected-text')),
    'Select items',
    'Wrong default selected text'
  );
  assert.equal(
    $buttonGroup.find('.btn.btn-primary').length,
    2,
    'Missing default btn-primary class'
  );

  //Dropdown menu
  const $dropdownMenu = $dropdown.find('.dropdown-menu.no-close');
  T.exists(assert, $dropdownMenu, 'Missing dropdown menu');
  T.notExists(
    assert,
    $dropdownMenu.find('.dropdown-header'),
    'Dropdown header should not exists'
  );

  //assert parent items
  assert.equal(
    $dropdownMenu.find('li span.item.parent').length,
    5,
    'Missing parent items'
  );
  assert.equal(
    T.text($dropdownMenu.find('li span.item.parent:eq(0)')),
    'Pre-K',
    'Wrong item text'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li span.item.parent.disabled'),
    'Disabled parent items should not exists'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li span.item.parent.selected'),
    'Selected parent items should not exists'
  );

  //assert level items
  assert.equal(
    $dropdownMenu.find('li span.item.level').length,
    13,
    'Missing level items'
  );
  assert.equal(
    T.text($dropdownMenu.find('li span.item.level:eq(0)')),
    'K',
    'Wrong item text'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li span.item.level.disabled'),
    'Disabled level items should not exists'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li span.item.level.selected'),
    'Selected level items should not exists'
  );
});

test('Interaction - notify change event', function(assert) {
  assert.expect(5);

  const grades = Ember.A();
  grades.addObject(Ember.Object.create({ id: 1, name: 'Pre-K', levels: [] }));

  this.set('grades', grades);

  this.on('myChangeAction', function(items) {
    assert.equal(items.length, 1, 'Only one element should be selected');
  });

  this.render(
    hbs`{{grade-dropdown grades=grades onChangeAction='myChangeAction'}}`
  );

  const $component = this.$(),
    $dropdown = $component.find('.grade-dropdown');

  //Dropdown menu
  const $dropdownMenu = $dropdown.find('.dropdown-menu.no-close');

  //assert parent items
  assert.equal(
    T.text($dropdownMenu.find('li span.item.parent:eq(0)')),
    'Pre-K',
    'Wrong item text'
  );
  $dropdownMenu.find('li span.item.parent:eq(0)').click();

  assert.equal(
    $dropdownMenu.find('li span.item.parent').length,
    1,
    'Missing parent items'
  );
  assert.equal(
    $dropdownMenu.find('li span.item.parent.selected').length,
    1,
    'Missing selected parent items'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li span.item.parent.disabled'),
    'Disabled parent items should not exists'
  );
});

test('Interaction select/unselect items', function(assert) {
  assert.expect(41);

  const grades = Ember.A();
  grades.addObject(Ember.Object.create({ id: 1, name: 'Pre-K', levels: [] }));
  grades.addObject(
    Ember.Object.create({
      id: 1,
      name: 'Elementary',
      levels: ['K', '1', '2', '3', '4', '5']
    })
  );
  grades.addObject(
    Ember.Object.create({
      id: 1,
      name: 'Middle School',
      levels: ['6', '7', '8']
    })
  );
  grades.addObject(
    Ember.Object.create({
      id: 1,
      name: 'High School',
      levels: ['9', '10', '11', '12']
    })
  );
  grades.addObject(
    Ember.Object.create({ id: 1, name: 'Higher Ed', levels: [] })
  );

  this.set('grades', grades);
  this.on('myChangeAction', function() {
    //do nothing
  });
  this.render(
    hbs`{{grade-dropdown grades=grades onChangeAction='myChangeAction'}}`
  );

  const $component = this.$(),
    $dropdown = $component.find('.grade-dropdown');

  T.exists(assert, $dropdown, 'Missing grade-dropdown');

  /**
   * Button group validations
   */
  const $buttonGroup = $dropdown.find('.btn-group');
  T.exists(assert, $buttonGroup, 'Missing btn-group');
  assert.ok(
    $buttonGroup.hasClass('btn-group-lg'),
    'Missing default btn group size class'
  );
  assert.ok(
    $buttonGroup.hasClass('keep-open-yes'),
    'Missing keep-open-yes class'
  );
  T.exists(
    assert,
    $buttonGroup.find('.selected-text'),
    'Missing select text button'
  );
  assert.equal(
    T.text($buttonGroup.find('.selected-text')),
    'Select items',
    'Wrong default selected text'
  );
  assert.equal(
    $buttonGroup.find('.btn.btn-primary').length,
    2,
    'Missing default btn-primary class'
  );

  //Dropdown menu
  const $dropdownMenu = $dropdown.find('.dropdown-menu.no-close');

  /**
    Select a parent item with no levels
   */
  assert.equal(
    T.text($dropdownMenu.find('li span.item.parent:eq(0)')),
    'Pre-K',
    'Wrong item text'
  );
  $dropdownMenu.find('li span.item.parent:eq(0)').click();
  //verify selected text
  assert.equal(
    T.text($buttonGroup.find('.selected-text')),
    'Pre-K',
    'Wrong selected text'
  );
  //verify parent items
  assert.equal(
    $dropdownMenu.find('li span.item.parent').length,
    5,
    'Missing parent items'
  );
  assert.equal(
    $dropdownMenu.find('li span.item.parent.selected').length,
    1,
    'Missing selected parent items'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li span.item.parent.disabled'),
    'Disabled parent items should not exists'
  );
  //verify level items
  assert.equal(
    $dropdownMenu.find('li span.item.level').length,
    13,
    'Missing level items'
  );
  assert.equal(
    T.text($dropdownMenu.find('li span.item.level:eq(0)')),
    'K',
    'Wrong item text'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li span.item.level.disabled'),
    'Disabled level items should not exists'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li span.item.level.selected'),
    'Selected level items should not exists'
  );

  /**
   Unselect a parent item with no levels
   */
  $dropdownMenu.find('li span.item.parent:eq(0)').click();
  //verify selected text
  assert.equal(
    T.text($buttonGroup.find('.selected-text')),
    'Select items',
    'Wrong selected text'
  );
  //verify parent items
  assert.equal(
    $dropdownMenu.find('li span.item.parent').length,
    5,
    'Missing parent items'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li span.item.parent.selected'),
    'Selected parent items should not exists'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li span.item.parent.disabled'),
    'Disabled parent items should not exists'
  );
  //verify level items
  assert.equal(
    $dropdownMenu.find('li span.item.level').length,
    13,
    'Missing level items'
  );
  assert.equal(
    T.text($dropdownMenu.find('li span.item.level:eq(0)')),
    'K',
    'Wrong item text'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li span.item.level.disabled'),
    'Disabled level items should not exists'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li span.item.level.selected'),
    'Selected level items should not exists'
  );

  /**
   Select a parent item with levels
   */
  assert.equal(
    T.text($dropdownMenu.find('li span.item.parent:eq(1)')),
    'Elementary',
    'Wrong item text'
  );
  $dropdownMenu.find('li span.item.parent:eq(1)').click();
  //verify selected text
  assert.equal(
    T.text($buttonGroup.find('.selected-text')),
    'Elementary,K,1,2,3,4,5',
    'Wrong selected text'
  );
  //verify parent items
  assert.equal(
    $dropdownMenu.find('li span.item.parent').length,
    5,
    'Missing parent items'
  );
  assert.equal(
    $dropdownMenu.find('li span.item.parent.selected').length,
    1,
    'Missing selected parent items'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li span.item.parent.disabled'),
    'Disabled parent items should not exists'
  );
  //verify level items
  assert.equal(
    $dropdownMenu.find('li span.item.level').length,
    13,
    'Missing level items'
  );
  assert.equal(
    T.text($dropdownMenu.find('li span.item.level:eq(1)')),
    '1',
    'Wrong item text'
  );
  assert.equal(
    $dropdownMenu.find('li span.item.level.selected').length,
    6,
    'Missing selected level items'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li span.item.level.disabled'),
    'Disabled level items should not exists'
  );

  /**
   Unselect a parent item with no levels
   */
  $dropdownMenu.find('li span.item.parent:eq(1)').click(); //Elementary
  //verify selected text
  assert.equal(
    T.text($buttonGroup.find('.selected-text')),
    'Select items',
    'Wrong selected text'
  );
  //verify parent items
  assert.equal(
    $dropdownMenu.find('li span.item.parent').length,
    5,
    'Missing parent items'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li span.item.parent.selected'),
    'Selected parent items should not exists'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li span.item.parent.disabled'),
    'Disabled parent items should not exists'
  );
  //verify level items
  assert.equal(
    $dropdownMenu.find('li span.item.level').length,
    13,
    'Missing level items'
  );
  assert.equal(
    T.text($dropdownMenu.find('li span.item.level:eq(0)')),
    'K',
    'Wrong item text'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li span.item.level.disabled'),
    'Disabled level items should not exists'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li span.item.level.selected'),
    'Selected level items should not exists'
  );
});
