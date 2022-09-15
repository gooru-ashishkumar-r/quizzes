import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gru-image', 'Integration | Component | gru image', {
  integration: true,
  beforeEach: function() {
    this.inject.service('i18n');
  }
});

test('Layout without image - read only', function(assert) {
  this.render(hbs`{{gru-image isEditing=false srcImage=null }}`);

  const $component = this.$('.content.gru-image');
  assert.ok($component.length, 'Component found');
  assert.ok($component.hasClass('is-viewing'), 'Read only class');
  assert.ok($component.find('> i.library_add').length, 'Image placeholder');
});

test('Layout with image - read only', function(assert) {
  var imageUrl = '/path/image.png';
  this.set('imageUrl', imageUrl);
  this.render(hbs`{{gru-image isEditing=false srcImage=imageUrl }}`);

  const $component = this.$('.content.gru-image');
  assert.ok($component.length, 'Component found');
  assert.ok($component.hasClass('is-viewing'), 'Read only class');
  assert.ok($component.hasClass('has-src-image'), 'Has image class');
  assert.ok($component.find('> img.img-responsive').length, 'Image');
  assert.ok(
    $component.find('> img.img-responsive').prop('src'),
    '/path/image.png',
    'Image url'
  );
});

test('Layout without image - edit', function(assert) {
  this.render(hbs`{{gru-image isEditing=true srcImage=null editImage=null }}`);

  const $component = this.$('.content.gru-image');
  assert.ok($component.length, 'Component found');
  assert.ok($component.hasClass('is-editing'), 'Edit class');

  assert.ok($component.find('> i.library_add').length, 'Image placeholder');
  assert.ok($component.find('> .file-picker').length, 'File picker');
  assert.ok(
    $component.find('> .file-picker > button.btn-info').length,
    'Upload button'
  );
  assert.equal(
    $component.find('> .file-picker > button.btn-info').text().trim(),
    this.get('i18n').t('common.upload-thumbnail').string,
    'Upload button text'
  );
});

test('Layout with image - edit', function(assert) {
  var imageUrl = '/path/image.png';
  this.set('imageUrl', imageUrl);
  this.render(
    hbs`{{gru-image isEditing=true srcImage=imageUrl editImage=imageUrl}}`
  );

  const $component = this.$('.content.gru-image');
  assert.ok($component.length, 'Component found');
  assert.ok($component.hasClass('is-editing'), 'Edit class');
  assert.ok($component.hasClass('has-edit-image'), 'Has image class');

  assert.ok($component.find('> img.img-responsive').length, 'Image');
  assert.ok(
    $component.find('> img.img-responsive').prop('src'),
    '/path/image.png',
    'Image url'
  );
  assert.ok($component.find('> .file-picker').length, 'File picker');
  assert.ok(
    $component.find('> .file-picker > button.btn-info').length,
    'Update button'
  );
  assert.equal(
    $component.find('> .file-picker > button.btn-info').text().trim(),
    this.get('i18n').t('common.update-thumbnail').string,
    'Update button text'
  );
  assert.ok($component.find('> button.delete').length, 'Delete button');
});

test('Delete button replaces the currently selected image with a placeholder', function(
  assert
) {
  var imageUrl = '/path/image.png';
  this.set('imageUrl', imageUrl);
  this.render(
    hbs`{{gru-image isEditing=true srcImage=imageUrl editImage=imageUrl}}`
  );

  const $component = this.$('.content.gru-image');
  assert.ok($component.length, 'Component found');
  assert.ok($component.hasClass('is-editing'), 'Edit class');
  assert.ok($component.hasClass('has-edit-image'), 'Has image class');
  $component.find('> button.delete').click();

  assert.ok(!$component.hasClass('has-edit-image'), 'Image class removed');
  assert.ok($component.find('> i.library_add').length, 'Image placeholder');
  assert.ok(
    $component.find('> .file-picker > button.btn-info').length,
    'Upload button'
  );
  assert.equal(
    $component.find('> .file-picker > button.btn-info').text().trim(),
    this.get('i18n').t('common.upload-thumbnail').string,
    'Upload button text'
  );
});
