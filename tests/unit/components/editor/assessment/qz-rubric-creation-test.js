import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent(
  'editor/assessment/qz-rubric-creation',
  'Unit | Component | editor/assessment/qz rubric creation',
  {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true
  }
);

test('addURL', function(assert) {
  const component = this.subject();
  component.send('addURL', 'url');
  assert.equal(component.get('resource.url'), 'url', 'Incorrect URL');
});
