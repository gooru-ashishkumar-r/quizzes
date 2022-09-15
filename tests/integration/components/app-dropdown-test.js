import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import DropdownItem from 'quizzes-addon/utils/dropdown-item';
import T from 'dummy/tests/helpers/assert';

moduleForComponent('app-dropdown', 'Integration | Component | app dropdown', {
  integration: true
});

test('Layout using defaults', function(assert) {
  assert.expect(16);

  const items = Ember.A();
  items.addObject(DropdownItem.create({ id: 1, label: 'Math' }));
  items.addObject(DropdownItem.create({ id: 2, label: 'Science' }));
  items.addObject(DropdownItem.create({ id: 3, label: 'History' }));
  items.addObject(DropdownItem.create({ id: 4, label: 'Language' }));

  this.set('items', items);

  this.render(hbs`{{app-dropdown items=items}}`);

  const $component = this.$(),
    $dropdown = $component.find('.app-dropdown');

  T.exists(assert, $dropdown, 'Missing app-dropdown');

  //button group
  const $buttonGroup = $dropdown.find('.btn-group');
  T.exists(assert, $buttonGroup, 'Missing btn-group');
  assert.ok(
    $buttonGroup.hasClass('btn-group-lg'),
    'Missing default btn group size class'
  );
  assert.ok(
    $buttonGroup.hasClass('keep-open-no'),
    'Missing keep-open-no class'
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
  const $dropdownMenu = $dropdown.find('.dropdown-menu');
  T.exists(assert, $dropdownMenu, 'Missing dropdown menu');
  T.notExists(
    assert,
    $dropdownMenu.find('.dropdown-header'),
    'Dropdown header should not exists'
  );
  assert.equal(
    $dropdownMenu.find('li a.item').length,
    4,
    'Missing anchor with item class'
  );
  assert.equal(
    T.text($dropdownMenu.find('li a.item:eq(0)')),
    'Math',
    'Wrong item text'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li.disabled'),
    'Disabled items should not exists'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li.selected'),
    'Selected items should not exists'
  );

  T.notExists(
    assert,
    $dropdown.find('.keep-open-no.open'),
    'Dropdown should not be open'
  );
  //open the dropdown
  $buttonGroup.find('.selected-text').click();
  T.exists(
    assert,
    $dropdown.find('.keep-open-no.open'),
    'Missing open class when click button'
  );
  //select a choice
  $dropdownMenu.find('li a.item:eq(0)').click();
  T.notExists(
    assert,
    $dropdown.find('.keep-open-no.open'),
    'Dropdown should not be open after selecting item'
  );
});

test('Layout with options', function(assert) {
  assert.expect(17);

  const items = Ember.A();
  items.addObject(DropdownItem.create({ id: 1, label: 'Math' }));
  items.addObject(DropdownItem.create({ id: 2, label: 'Science' }));
  items.addObject(DropdownItem.create({ id: 3, label: 'History' }));
  items.addObject(DropdownItem.create({ id: 4, label: 'Language' }));

  this.set('items', items);

  this
    .render(hbs`{{app-dropdown items=items btn-group-size='btn-group-sm' multiple=true
        split=false
        btn-type='btn-danger' placeholder='Select Subject' prompt='Select a subject'}}`);

  const $component = this.$(),
    $dropdown = $component.find('.app-dropdown');

  T.exists(assert, $dropdown, 'Missing app-dropdown');

  //button group
  const $buttonGroup = $dropdown.find('.btn-group');
  T.exists(assert, $buttonGroup, 'Missing btn-group');
  assert.ok(
    $buttonGroup.hasClass('btn-group-sm'),
    'Missing btn group size class'
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
    'Select Subject',
    'Missing provided placeholder text'
  );
  assert.equal(
    $buttonGroup.find('.btn.btn-danger').length,
    1,
    'Should be a single button when split=false'
  );

  //Dropdown menu
  const $dropdownMenu = $dropdown.find('.dropdown-menu');
  T.exists(assert, $dropdownMenu, 'Missing dropdown menu');
  T.exists(
    assert,
    $dropdownMenu.find('.dropdown-header'),
    'Missing dropdown header'
  );
  assert.equal(
    T.text($dropdownMenu.find('.dropdown-header')),
    'Select a subject',
    'Wrong dropdown header prompt text'
  );
  assert.equal(
    $dropdownMenu.find('li a.item').length,
    4,
    'Missing anchor with item class'
  );
  assert.equal(
    T.text($dropdownMenu.find('li a.item:eq(0)')),
    'Math',
    'Wrong item text'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li.disabled'),
    'Disabled items should not exists'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li.selected'),
    'Selected items should not exists'
  );

  T.notExists(
    assert,
    $dropdown.find('.keep-open-yes.open'),
    'Dropdown should not be open'
  );
  //open the dropdown
  $buttonGroup.find('.selected-text').click();
  T.exists(
    assert,
    $dropdown.find('.keep-open-yes.open'),
    'Missing open class when click button'
  );
  //select a choice
  $dropdownMenu.find('li a.item:eq(0)').click();
  T.exists(
    assert,
    $dropdown.find('.keep-open-yes.open'),
    'Dropdown should remain open after selecting item'
  );
});

test('Disabled/selected items by default', function(assert) {
  assert.expect(5);

  const items = Ember.A();
  items.addObject(
    DropdownItem.create({ id: 1, label: 'Math', disabled: true })
  );
  items.addObject(
    DropdownItem.create({ id: 2, label: 'Science', selected: true })
  );
  items.addObject(
    DropdownItem.create({ id: 3, label: 'History', disabled: true })
  );
  items.addObject(DropdownItem.create({ id: 4, label: 'Language' }));

  this.set('items', items);

  this.render(hbs`{{app-dropdown items=items}}`);

  const $component = this.$(),
    $dropdown = $component.find('.app-dropdown');

  //button group
  const $buttonGroup = $dropdown.find('.btn-group');
  T.exists(
    assert,
    $buttonGroup.find('.selected-text'),
    'Missing select text button'
  );
  assert.equal(
    T.text($buttonGroup.find('.selected-text')),
    'Science',
    'Wrong selected text'
  );

  //Dropdown menu
  const $dropdownMenu = $dropdown.find('.dropdown-menu');
  assert.equal(
    $dropdownMenu.find('li a.item').length,
    4,
    'Missing anchor with item class'
  );
  assert.equal(
    $dropdownMenu.find('li.disabled').length,
    2,
    'Missing disabled items'
  );
  assert.equal(
    $dropdownMenu.find('li.selected').length,
    1,
    'Missing selected items'
  );
});

test('Single select interaction', function(assert) {
  assert.expect(13);

  const items = Ember.A();
  items.addObject(
    DropdownItem.create({ id: 1, label: 'Math', selected: true })
  );
  items.addObject(
    DropdownItem.create({ id: 2, label: 'Science', disabled: true })
  );
  items.addObject(DropdownItem.create({ id: 3, label: 'History' }));
  items.addObject(DropdownItem.create({ id: 4, label: 'Language' }));

  this.set('items', items);

  //setting context
  this.on('myChangeAction', function(items) {
    assert.equal(items.length, 1, 'Only one element should be selected');
  });

  this.render(
    hbs`{{app-dropdown items=items onChangeAction='myChangeAction'}}`
  );

  const $component = this.$(),
    $dropdown = $component.find('.app-dropdown');

  //Dropdown menu
  const $dropdownMenu = $dropdown.find('.dropdown-menu');
  assert.equal(
    $dropdownMenu.find('li a.item').length,
    4,
    'Missing anchor with item class'
  );
  assert.equal(
    $dropdownMenu.find('li.disabled').length,
    1,
    'Missing disabled items'
  );
  assert.equal(
    $dropdownMenu.find('li.selected').length,
    1,
    'Missing selected items'
  );
  assert.equal(
    T.text($dropdownMenu.find('li.selected a')),
    'Math',
    'Wrong selected item'
  );

  //clicking at selectable item
  $dropdownMenu.find('li a.item:eq(2)').click(); //History

  assert.equal(
    $dropdownMenu.find('li a.item').length,
    4,
    'Missing anchor with item class'
  );
  assert.equal(
    $dropdownMenu.find('li.disabled').length,
    1,
    'Missing disabled items'
  );
  assert.equal(
    $dropdownMenu.find('li.selected').length,
    1,
    'Missing selected items'
  );
  assert.equal(
    T.text($dropdownMenu.find('li.selected a')),
    'History',
    'Wrong selected item'
  );

  //clicking at disabled item
  $dropdownMenu.find('li a.item:eq(1)').click(); //Science disabled
  assert.equal(
    $dropdownMenu.find('li a.item').length,
    4,
    'Missing anchor with item class'
  );
  assert.equal(
    $dropdownMenu.find('li.disabled').length,
    1,
    'Missing disabled items'
  );
  assert.equal(
    $dropdownMenu.find('li.selected').length,
    1,
    'Missing selected items'
  );
  assert.equal(
    T.text($dropdownMenu.find('li.selected a')),
    'History',
    'Wrong selected item'
  ); //History is still selected
});

test('Multiple select interaction', function(assert) {
  assert.expect(14);

  const items = Ember.A();
  items.addObject(
    DropdownItem.create({ id: 1, label: 'Math', selected: true })
  );
  items.addObject(
    DropdownItem.create({ id: 2, label: 'Science', disabled: true })
  );
  items.addObject(DropdownItem.create({ id: 3, label: 'History' }));
  items.addObject(DropdownItem.create({ id: 4, label: 'Language' }));

  this.set('items', items);

  //setting context
  this.on('myChangeAction', function(items) {
    assert.equal(items.length, 2, 'Two elements should be selected');
  });

  this.render(
    hbs`{{app-dropdown items=items onChangeAction='myChangeAction' multiple=true}}`
  );

  const $component = this.$(),
    $dropdown = $component.find('.app-dropdown');

  const $buttonGroup = $dropdown.find('.btn-group');
  assert.equal(
    T.text($buttonGroup.find('.selected-text')),
    'Math',
    'Wrong selected text'
  );

  //Dropdown menu
  const $dropdownMenu = $dropdown.find('.dropdown-menu');
  assert.equal(
    $dropdownMenu.find('li a.item').length,
    4,
    'Missing anchor with item class'
  );
  assert.equal(
    $dropdownMenu.find('li.disabled').length,
    1,
    'Missing disabled items'
  );
  assert.equal(
    $dropdownMenu.find('li.selected').length,
    1,
    'Missing selected items'
  );
  assert.equal(
    T.text($dropdownMenu.find('li.selected a')),
    'Math',
    'Wrong selected item'
  );

  //clicking at selectable item
  $dropdownMenu.find('li a.item:eq(2)').click(); //History

  assert.equal(
    $dropdownMenu.find('li a.item').length,
    4,
    'Missing anchor with item class'
  );
  assert.equal(
    $dropdownMenu.find('li.disabled').length,
    1,
    'Missing disabled items'
  );
  assert.equal(
    $dropdownMenu.find('li.selected').length,
    2,
    'Missing selected items'
  );
  assert.equal(
    T.text($buttonGroup.find('.selected-text')),
    'Math,History',
    'Wrong selected text'
  );

  //clicking at disabled item
  $dropdownMenu.find('li a.item:eq(1)').click(); //Science disabled
  assert.equal(
    $dropdownMenu.find('li a.item').length,
    4,
    'Missing anchor with item class'
  );
  assert.equal(
    $dropdownMenu.find('li.disabled').length,
    1,
    'Missing disabled items'
  );
  assert.equal(
    $dropdownMenu.find('li.selected').length,
    2,
    'Missing selected items'
  );
  assert.equal(
    T.text($buttonGroup.find('.selected-text')),
    'Math,History',
    'Wrong selected text'
  );
});

test('Multiple select interaction - unselect', function(assert) {
  assert.expect(10);

  const items = Ember.A();
  items.addObject(
    DropdownItem.create({ id: 1, label: 'Math', selected: true })
  );
  items.addObject(
    DropdownItem.create({ id: 2, label: 'Science', disabled: true })
  );
  items.addObject(DropdownItem.create({ id: 3, label: 'History' }));
  items.addObject(DropdownItem.create({ id: 4, label: 'Language' }));

  this.set('items', items);

  //setting context
  this.on('myChangeAction', function(items) {
    assert.equal(items.length, 0, 'No elements should be selected');
  });

  this.render(
    hbs`{{app-dropdown items=items onChangeAction='myChangeAction' multiple=true}}`
  );

  const $component = this.$(),
    $dropdown = $component.find('.app-dropdown');

  const $buttonGroup = $dropdown.find('.btn-group');
  assert.equal(
    T.text($buttonGroup.find('.selected-text')),
    'Math',
    'Wrong selected text'
  );

  //Dropdown menu
  const $dropdownMenu = $dropdown.find('.dropdown-menu');
  assert.equal(
    $dropdownMenu.find('li a.item').length,
    4,
    'Missing anchor with item class'
  );
  assert.equal(
    $dropdownMenu.find('li.disabled').length,
    1,
    'Missing disabled items'
  );
  assert.equal(
    $dropdownMenu.find('li.selected').length,
    1,
    'Missing selected items'
  );
  assert.equal(
    T.text($dropdownMenu.find('li.selected a')),
    'Math',
    'Wrong selected item'
  );

  //clicking at selectable item
  $dropdownMenu.find('li a.item:eq(0)').click(); //Math
  assert.equal(
    $dropdownMenu.find('li a.item').length,
    4,
    'Missing anchor with item class'
  );
  assert.equal(
    $dropdownMenu.find('li.disabled').length,
    1,
    'Missing disabled items'
  );
  assert.equal(
    $dropdownMenu.find('li.selected').length,
    0,
    'No selected items should be found'
  );
  assert.equal(
    T.text($buttonGroup.find('.selected-text')),
    'Select items',
    'Wrong selected text'
  );
});
