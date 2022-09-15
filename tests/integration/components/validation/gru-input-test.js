import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import wait from 'ember-test-helpers/wait';
import { validator, buildValidations } from 'ember-cp-validations';

moduleForComponent('gru-input', 'Integration | Component | gru input', {
  integration: true
});

const Validations = buildValidations({
  term: validator('presence', true)
});

test('Layout and clear functionality', function(assert) {
  assert.expect(5); // making sure all asserts are called

  const Model = Ember.Object.extend(Validations, { term: null });
  this.set(
    'model',
    Model.create(Ember.getOwner(this).ownerInjection(), {
      term: ''
    })
  );
  this.render(
    hbs`{{validation/gru-input model=model valuePath='term' hasClearButton=true}}`
  ); // render the component
  var $component = this.$(); // component dom element
  var $input = $component.find('input[type=text]');

  T.exists(assert, $input, 'Input element not found');
  assert.equal($input.val(), '', 'Wrong value');

  $input.val('Sol');
  $input.blur();

  return wait().then(function() {
    assert.ok(
      !$component.find('.error-messages .error').length,
      'Input error message was not hidden'
    );

    $input.val('');
    $input.blur();
    return wait().then(function() {
      assert.ok(
        $component.find('.error-messages .error').length,
        'Input error message was hidden'
      );
      $component.find('.clear').click();
      assert.equal($input.val(), '', 'wrong value');
    });
  });
});
