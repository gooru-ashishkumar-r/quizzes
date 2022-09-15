import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent(
  'player/qz-submit-confirmation',
  'Integration | Component | player/qz submit confirmation',
  {
    integration: true
  }
);

test('Submit Confirmation', function(assert) {
  this.render(hbs`{{player/qz-submit-confirmation}}`);
  var $component = this.$();
  assert.ok(
    $component.find('.qz-submit-confirmation').length,
    'Submit confirmation component should appear'
  );
  assert.ok(
    $component.find('.qz-submit-confirmation .panel-heading h3').length,
    'Missing title'
  );
  assert.ok(
    $component.find('.qz-submit-confirmation .panel-body .description').length,
    'Missing description'
  );
  assert.ok(
    $component.find('.qz-submit-confirmation .panel-body .actions .submit')
      .length,
    'Missing submit Button'
  );
});
test('Submit', function(assert) {
  assert.expect(2);

  this.on('parentAction', function() {
    assert.ok(true, 'external Action was called!');
  });

  this.render(
    hbs`{{player/qz-submit-confirmation onConfirmFinish='parentAction'}}`
  );
  var $component = this.$(); //component dom element
  var $submitButton = $component.find(
    '.qz-submit-confirmation .panel-body .actions .submit'
  );
  assert.ok($submitButton.length, 'Missing button');
  $submitButton.click();
});
