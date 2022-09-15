import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent(
  'editor/assessment/qz-file-picker',
  'Integration | Component | editor/assessment/qz file picker',
  {
    integration: true
  }
);

test('it renders', function(assert) {
  this.render(hbs`{{editor/assessment/qz-file-picker}}`);
  const $component = this.$('.editor.assessment.qz-file-picker');
  assert.ok($component.length, 'Component');
  assert.ok(
    $component.find('div:first-child input[readonly]').length,
    'Readonly input'
  );
  assert.ok(
    $component.find('div:first-child div.upload.btn').length,
    'Upload button'
  );
  assert.ok($component.find('.validation').length, 'Validation section');
});
