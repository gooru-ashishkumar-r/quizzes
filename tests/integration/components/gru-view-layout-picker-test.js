import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';

moduleForComponent(
  'gru-view-layout-picker',
  'Integration | Component | gru view layout picker',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('View-Layout-Picker Layout', function(assert) {
  assert.expect(4);

  this.render(hbs`{{gru-view-layout-picker}}`);

  const $component = this.$(); //component dom element
  const $viewLayoutPicker = $component.find('.gru-view-layout-picker');

  T.exists(assert, $viewLayoutPicker, 'Missing view layout picker');
  T.exists(
    assert,
    $viewLayoutPicker.find('.view-layout-list'),
    'Missing view layout picker options'
  );
  T.exists(
    assert,
    $viewLayoutPicker.find('.view_module'),
    'Missing thumbnails icon'
  );
  T.exists(assert, $viewLayoutPicker.find('.view_list'), 'Missing list icon');
});

test('Select option', function(assert) {
  assert.expect(3);

  this.on('parentAction', function(option) {
    assert.equal('list', option);
  });

  this.render(
    hbs`{{gru-view-layout-picker onViewLayoutChange='parentAction'}}`
  );
  var $component = this.$(); //component dom element
  var $viewLayoutPicker = $component.find('.view-layout-list');
  $viewLayoutPicker.find('div:last-child a').click();
  assert.ok($viewLayoutPicker.find('div:last-child').hasClass('active'));
  T.notExists(
    assert,
    $viewLayoutPicker.find('div.thumbnails.active'),
    'Thumbnails option should not be active'
  );
});

test('Select option again', function(assert) {
  assert.expect(1);
  this.render(hbs`{{gru-view-layout-picker}}`);
  var $component = this.$(); //component dom element
  var $viewLayoutPicker = $component.find('.view-layout-list');
  $viewLayoutPicker.find('div.list a').click();
  assert.ok($viewLayoutPicker.find('div.list').hasClass('active'));
});

test('Select another option', function(assert) {
  assert.expect(3);

  this.render(hbs`{{gru-view-layout-picker }}`);
  var $component = this.$(); //component dom element
  var $viewLayoutPicker = $component.find('.view-layout-list');
  $viewLayoutPicker.find('div:last-child a').click();
  assert.ok($viewLayoutPicker.find('div.list').hasClass('active'));
  $viewLayoutPicker.find('div:first-child a').click();
  T.notExists(
    assert,
    $viewLayoutPicker.find('div.list.active'),
    'List option should not be active'
  );
  assert.ok($viewLayoutPicker.find('div.thumbnails').hasClass('active'));
});
