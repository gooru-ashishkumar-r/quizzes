import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';

moduleForComponent(
  'role-radio-button',
  'Integration | Component | role radio button',
  {
    integration: true
  }
);

test('renders role radio button', function(assert) {
  assert.expect(4); // making sure all asserts are called

  this.render(hbs`{{role-radio-button}}`); // render the component
  var $component = this.$(); // component dom element

  T.exists(
    assert,
    $component.find('#teacherRadioButton'),
    'Missing teacher radio option'
  );
  T.exists(
    assert,
    $component.find('#studentRadioButton'),
    'Missing teacher radio option'
  );
  T.exists(
    assert,
    $component.find('#parentRadioButton'),
    'Missing teacher radio option'
  );
  T.exists(
    assert,
    $component.find('#otherRadioButton'),
    'Missing teacher radio option'
  );
});
