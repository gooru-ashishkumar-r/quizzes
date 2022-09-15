import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';

moduleForComponent(
  'gru-select-date-picker',
  'Integration | Component | gru select date picker',
  {
    integration: true
  }
);

test('Layout', function(assert) {
  this.render(hbs`{{gru-select-date-picker}}`);

  const $component = this.$();
  T.exists(
    assert,
    $component.find('.birth-day-date'),
    'Missing birth-day-date wrapper'
  );
  assert.equal(
    T.text($component.find('.birth-day-date .required')),
    'Birthday',
    'Wrong birthday label'
  );
  T.exists(
    assert,
    $component.find('.birth-months'),
    'Missing birth-months field'
  );
  T.exists(assert, $component.find('.birth-days'), 'Missing birth-days field');
  T.exists(
    assert,
    $component.find('.birth-years'),
    'Missing birth-years field'
  );
  assert.equal(
    $component.find('select.selectpicker').length,
    3,
    'Number of selectpickers is incorrect'
  );
});
