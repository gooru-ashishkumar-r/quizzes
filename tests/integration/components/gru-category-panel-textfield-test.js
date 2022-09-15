import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent(
  'gru-category-panel-textfield',
  'Integration | Component | gru category panel textfield',
  {
    integration: true
  }
);

test('it renders', function(assert) {
  this.render(hbs`
    {{gru-category-panel-textfield
      component-class="test-class"
      title="Panel Title"
      body="Panel Body"
      cta-text="Panel Call To Action Text"
      text-placeholder="Placeholder text"}}
  `);

  var $component = this.$();

  assert.ok(
    $component.find('.ember-view').hasClass('gru-category-panel'),
    'Component class is missing'
  );
  assert.ok(
    $component.find('.ember-view').hasClass('gru-category-panel-textfield'),
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
    $component.find('.content .cta button').text(),
    'Panel Call To Action Text',
    'Incorrect call to action text'
  );
  assert.equal(
    $component.find('.content .cta input').attr('placeholder'),
    'Placeholder text',
    'Incorrect placeholder text'
  );
});
