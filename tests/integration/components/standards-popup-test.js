import { moduleForComponent, test } from 'ember-qunit';
import T from 'dummy/tests/helpers/assert';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent(
  'standards-popup',
  'Integration | Component | standards popup',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('gru-standards-popup', function(assert) {
  assert.expect(5);

  var standards = Ember.A([
    {
      name: 'CCSS.ELA-Literacy.RI.9-10.6',
      description:
        'Determine an author’s point of view or purpose in a text and analyze how an author uses rhetoric to advance that point of view or purpose.'
    }
  ]);

  this.set('standards', standards);

  this.render(hbs`{{gru-standards-popup model=standards}}`);
  var $component = this.$(); //component dom element

  var $standardsPopupSection = $component.find('.gru-standards-popup');
  assert.ok($standardsPopupSection, 'Missing standards popup');
  assert.ok(
    $standardsPopupSection.find('.standard-title'),
    'Missing standard title'
  );
  assert.equal(
    T.text($standardsPopupSection.find('.standard-title span')),
    'CCSS.ELA-Literacy.RI.9-10.6',
    'Incorrect standard title'
  );

  T.exists(
    assert,
    $standardsPopupSection.find('.standard-description'),
    'Missing standard description'
  );
  assert.equal(
    T.text($standardsPopupSection.find('p')),
    'Determine an author’s point of view or purpose in a text and analyze how an author uses rhetoric to advance that point of view or purpose.'
  );
});
