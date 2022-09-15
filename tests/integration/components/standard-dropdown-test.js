import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';

moduleForComponent(
  'standard-dropdown',
  'Integration | Component | standard dropdown',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('Layout and interaction', function(assert) {
  assert.expect(12);

  const items = Ember.A();
  items.addObject(
    Ember.Object.create({
      id: 1,
      name: 'CCSS',
      title: 'Common Core State Standard'
    })
  );
  items.addObject(
    Ember.Object.create({
      id: 2,
      name: 'CA SS',
      title: 'California State Standard'
    })
  );
  items.addObject(
    Ember.Object.create({
      id: 2,
      name: 'NGSS',
      title: 'Next Generation State Standard'
    })
  );

  this.set('items', items);

  //setting context
  this.on('myStandardSelectedAction', function(items) {
    assert.equal(items.length, 1, 'Only one element should be selected');
  });

  this.render(
    hbs`{{standard-dropdown standards=items onStandardSelectedAction='myStandardSelectedAction'}}`
  );

  const $component = this.$(),
    $dropdown = $component.find('.standard-dropdown');

  T.exists(assert, $dropdown, 'Missing standard-dropdown');

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

  //Dropdown menu
  const $dropdownMenu = $dropdown.find('.dropdown-menu');
  T.exists(assert, $dropdownMenu, 'Missing dropdown menu');
  assert.equal($dropdownMenu.find('li a.item').length, 3, 'Missing items');
  assert.equal(
    $dropdownMenu.find('li a.item strong').length,
    3,
    'Missing item name'
  );
  assert.equal(
    $dropdownMenu.find('li a.item p').length,
    3,
    'Missing item title'
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

  //clicking at selectable item
  $dropdownMenu.find('li a.item:eq(1)').click(); //CCSS
  assert.equal(
    $dropdownMenu.find('li.selected').length,
    1,
    'Missing selected items'
  );
});
