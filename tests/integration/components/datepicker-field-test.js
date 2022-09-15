import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';

moduleForComponent(
  'datepicker-field',
  'Integration | Component | datepicker field',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('renders datepicker', function(assert) {
  assert.expect(4); // making sure all asserts are called

  this.render(
    hbs`{{datepicker-field onSelectDateAction=onSelectDateOfBirthAction placeholder="MyBirthday"}}`
  ); // render the component
  var $component = this.$(); // component dom element

  T.exists(
    assert,
    $component.find('div.datepicker'),
    'Div container element not found'
  );
  T.exists(
    assert,
    $component.find('#datepicker'),
    'Missing datepicker textbox'
  );
  T.exists(
    assert,
    $component.find('button.datepicker-icon'),
    'Datepicker icon element not found'
  );
  assert.equal(
    this.$('#datepicker').attr('placeholder'),
    'MyBirthday',
    'Wrong placeholder'
  );
});
