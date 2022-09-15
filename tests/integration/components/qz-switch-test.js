import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import Ember from 'ember';

moduleForComponent('qz-switch', 'Integration | Component | qz switch', {
  integration: true,
  beforeEach: function() {
    this.container.lookup('service:i18n').set('locale', 'en');
  }
});

test('Switch Layout', function(assert) {
  assert.expect(2);
  const switchOptions = Ember.A([
    Ember.Object.create({
      label: 'Option A',
      value: 'some-value'
    }),
    Ember.Object.create({
      label: 'Option B',
      value: 'some-value'
    })
  ]);

  this.set('switchOptions', switchOptions);
  this.render(hbs`{{qz-switch switchOptions=switchOptions}}`);

  const $component = this.$(); //component dom element
  const $switch = $component.find('.qz-switch');

  T.exists(assert, $switch, 'Missing switch component');
  T.exists(assert, $switch.find('.switch'), 'Missing switch');
});

test('Switch', function(assert) {
  assert.expect(2);

  const switchOptions = Ember.A([
    Ember.Object.create({
      label: 'Option A',
      value: 'some-value'
    }),
    Ember.Object.create({
      label: 'Option B',
      value: 'some-value'
    })
  ]);
  this.set('switchOptions', switchOptions);

  this.render(
    hbs`{{qz-switch switchOptions=switchOptions onOptionSwitch='parentAction'}}`
  );

  const $component = this.$(); //component dom element
  const $switchComponent = $component.find('.qz-switch');
  var counter = 0;

  this.on('parentAction', function(option) {
    if (counter === 0) {
      assert.equal(true, option);
    } else {
      assert.equal(false, option);
    }
    counter += 1;
  });
  $switchComponent.find('a').click();
  $switchComponent.find('a').click();
});
