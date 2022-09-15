import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent(
  'gru-slide-up-menu',
  'Unit | Component | gru slide up menu',
  {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true
  }
);

test('closeMenu', function(assert) {
  const component = this.subject();
  component.set('visible', true);
  component.send('closeMenu');
  assert.equal(component.get('visible'), false, 'Should be hide');
});
