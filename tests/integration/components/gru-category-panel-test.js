import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent(
  'gru-category-panel',
  'Integration | Component | gru category panel',
  {
    integration: true
  }
);

test('it renders', function(assert) {
  this.render(hbs`
    {{gru-category-panel
      component-class="test-class"
      title="Panel Title"
      body="Panel Body"
      cta-link="http://test-link.com"
      cta-text="Panel Call To Action Text"}}
  `);

  var $component = this.$();

  assert.ok(
    $component.find('.ember-view').hasClass('gru-category-panel'),
    'Component class is missing'
  );
  assert.ok(
    $component.find('.ember-view').hasClass('test-class'),
    'Component specific class is missing'
  );
  assert.equal(
    $component.find('strong').text(),
    'Panel Title',
    'Incorrect title text'
  );
  assert.equal(
    $component.find('.content span').text(),
    'Panel Body',
    'Incorrect body text'
  );
  assert.equal(
    $component.find('.content .cta').text().trim(),
    'Panel Call To Action Text',
    'Incorrect call to action text'
  );
  assert.equal(
    $component.find('.content .cta a').attr('href'),
    'http://test-link.com',
    'Incorrect call to action link'
  );
});
