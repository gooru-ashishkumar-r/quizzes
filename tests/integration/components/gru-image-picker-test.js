import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent(
  'gru-image-picker',
  'Integration | Component | gru image picker',
  {
    integration: true
  }
);

test('it renders', function(assert) {
  this.render(hbs`{{gru-image-picker}}`);

  const $component = this.$('.gru-image-picker');
  assert.ok($component.length, 'Component does not have the component class');
  assert.ok(
    $component.find('> .instruction').length,
    'Instruction text is missing'
  );
  assert.ok(
    $component.find('> .file-picker.single').length,
    'File picker component is missing'
  );
  assert.ok(
    $component.find('> .file-picker .file-picker__preview').length,
    'Preview container inside the file picker component is missing'
  );

  const $fileInput = $component.find('.file-picker input[type="file"]');
  assert.ok(
    $fileInput.length,
    'Input element for the file picker component is missing'
  );
  assert.ok(
    $fileInput.attr('accept').match(/.jpg/),
    'Image picker does not support JPG files'
  );
  assert.ok(
    $fileInput.attr('accept').match(/.jpeg/),
    'Image picker does not support JPEG files'
  );
  assert.ok(
    $fileInput.attr('accept').match(/.gif/),
    'Image picker does not support GIF files'
  );
  assert.ok(
    $fileInput.attr('accept').match(/.png/),
    'Image picker does not support PNG files'
  );

  assert.ok(
    $component.find('> .validation').length,
    'Section for displaying image picker errors is missing'
  );
  assert.ok(
    !$component.find('> .validation span.error').length,
    'No errors should be displayed'
  );
  assert.ok(
    $component.find('> .restriction').length,
    'Restriction text is missing'
  );
  assert.ok(
    !$component.find('> .actions').length,
    'Buttons container should not be displayed by default'
  );
});

test('it renders submit and reset (cancel) buttons when an image has been selected', function(
  assert
) {
  this.set('isFileInputEmpty', false);

  this.render(hbs`{{gru-image-picker isFileInputEmpty=isFileInputEmpty }}`);

  const $component = this.$('.gru-image-picker');
  assert.ok(
    $component.find('> .actions').length,
    'Buttons container is missing'
  );
  assert.ok(
    $component.find('> .actions button.reset').length,
    'Reset button is missing'
  );
  assert.ok(
    $component.find('> .actions button.submit').length,
    'Submit button is missing'
  );
});
