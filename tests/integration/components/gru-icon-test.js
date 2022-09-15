import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gru-icon', 'Integration | Component | gru icon', {
  integration: true
});

test('Layout', function(assert) {
  this.render(hbs`{{gru-icon name='search'}}`);

  const $component = this.$();
  const $icon = $component.find('.gru-icon.material-icons.search');
  assert.ok($icon.length, 'Missing icon');
  assert.equal($icon.text().trim(), 'search', 'Wrong icon name');
});
